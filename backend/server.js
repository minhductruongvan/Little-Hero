const express = require('express');
const crypto = require('crypto');
const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const { promisify } = require('util');

const app = express();
app.use((req, res, next) => {
    express.json({ limit: req.path === '/api/chat' ? '17mb' : '16kb' })(req, res, next);
});

// 1. Phục vụ các file giao diện HTML, CSS, JS trong dự án
app.use(express.static(path.join(__dirname, '..')));

// 2. Định tuyến cho trang chủ
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'little-hero.html'));
});

// Khởi tạo Gemini Client
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
const chatFileTypes = new Set([
    'application/pdf',
    'text/plain',
    'text/csv',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/mov',
    'video/avi',
    'video/x-msvideo',
    'video/x-flv',
    'video/mpg',
    'video/webm',
    'video/wmv',
    'video/x-ms-wmv',
    'video/3gpp'
]);
const authFile = process.env.LITTLE_HERO_AUTH_FILE
    || path.join(os.homedir(), '.little-hero', 'accounts.json');
const scrypt = promisify(crypto.scrypt);
let authQueue = Promise.resolve();

const withAuthUsers = (operation) => {
    const result = authQueue.then(async () => {
        let users;
        try {
            users = JSON.parse(await fs.readFile(authFile, 'utf8'));
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
            users = [];
        }
        if (!Array.isArray(users)) throw new Error('Invalid account store.');
        return operation(users);
    });
    authQueue = result.then(() => undefined, () => undefined);
    return result;
};

const saveAuthUsers = async (users) => {
    await fs.mkdir(path.dirname(authFile), { recursive: true });
    const temporaryFile = `${authFile}.${process.pid}.${crypto.randomBytes(6).toString('hex')}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(users), { mode: 0o600 });
    await fs.rename(temporaryFile, authFile);
};

const normalizePhone = (phone) => phone.replace(/[ ()-]/g, '');

const validAccountDetails = (body) => {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!name || name.length > 80) return { error: 'Hãy nhập họ và tên (tối đa 80 ký tự).', code: 'INVALID_NAME', field: 'fullName' };
    if (!/^[^\s@]+@gmail\.com$/i.test(email)) return { error: 'Email chưa đúng định dạng. Hãy nhập địa chỉ Gmail hợp lệ, ví dụ ten@gmail.com.', code: 'INVALID_EMAIL', field: 'email' };
    if (!/^\+84\d{9,10}$/.test(normalizePhone(phone))) return { error: 'Số điện thoại chưa đúng định dạng. Hãy nhập +84 và 9–10 chữ số tiếp theo.', code: 'INVALID_PHONE', field: 'phone' };
    if (password.length < 8 || password.length > 128) return { error: 'Mật khẩu phải có ít nhất 8 ký tự (tối đa 128 ký tự).', code: 'INVALID_PASSWORD', field: 'password' };
    return { name, email, phone: normalizePhone(phone), password };
};

app.post('/api/auth/register', async (req, res) => {
    const details = validAccountDetails(req.body || {});
    if (details.error) return res.status(400).json(details);
    try {
        const user = await withAuthUsers(async (users) => {
            if (users.some((account) => account.email?.toLowerCase() === details.email)) {
                return { error: { error: 'Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.', code: 'EMAIL_EXISTS', field: 'email' } };
            }
            if (users.some((account) => typeof account.phone === 'string' && normalizePhone(account.phone) === details.phone)) {
                return { error: { error: 'Số điện thoại này đã được đăng ký bằng tài khoản khác.', code: 'PHONE_EXISTS', field: 'phone' } };
            }
            const salt = crypto.randomBytes(16).toString('hex');
            const passwordHash = await scrypt(details.password, salt, 64, {
                N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024
            });
            const account = {
                name: details.name,
                email: details.email,
                phone: details.phone,
                salt,
                passwordHash: passwordHash.toString('hex')
            };
            users.push(account);
            await saveAuthUsers(users);
            return { user: { name: account.name, email: account.email, phone: account.phone } };
        });
        if (user.error) return res.status(user.error.code.endsWith('_EXISTS') ? 409 : 400).json(user.error);
        res.status(201).json(user);
    } catch (error) {
        console.error('Lỗi tạo tài khoản Little Hero:', error);
        res.status(500).json({ error: 'Không thể tạo tài khoản lúc này. Vui lòng thử lại.' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!/^[^\s@]+@gmail\.com$/i.test(email) || !password || password.length > 128) {
        return res.status(400).json({ error: 'Hãy nhập Gmail và mật khẩu hợp lệ.' });
    }
    try {
        const user = await withAuthUsers(async (users) => {
            const account = users.find((entry) => entry.email === email);
            const salt = account?.salt || '00000000000000000000000000000000';
            const expected = account?.passwordHash || '0'.repeat(128);
            const actual = await scrypt(password, salt, 64, {
                N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024
            });
            const expectedBytes = Buffer.from(expected, 'hex');
            if (!account || expectedBytes.length !== actual.length || !crypto.timingSafeEqual(actual, expectedBytes)) {
                return null;
            }
            return { name: account.name, email: account.email, phone: account.phone };
        });
        if (!user) return res.status(401).json({ error: 'Gmail hoặc mật khẩu không chính xác.' });
        res.json({ user });
    } catch (error) {
        console.error('Lỗi đăng nhập Little Hero:', error);
        res.status(500).json({ error: 'Không thể đăng nhập lúc này. Vui lòng thử lại.' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ configured: Boolean(ai) });
});

app.post('/api/chat', async (req, res) => {
    if (!ai) return res.status(503).json({ error: 'Gemini chưa được cấu hình. Hãy đặt biến môi trường GEMINI_API_KEY trên máy chủ.' });

    const messages = req.body?.messages;
    const attachments = req.body?.attachments || [];
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 12) {
        return res.status(400).json({ error: 'Cuộc trò chuyện không hợp lệ.' });
    }
    if (!Array.isArray(attachments) || attachments.length > 3) {
        return res.status(400).json({ error: 'Mỗi tin nhắn chỉ có thể gửi tối đa 3 tệp.' });
    }

    const contents = [];
    for (const message of messages) {
        const role = message?.role === 'assistant' || message?.role === 'model' ? 'model' : message?.role === 'user' ? 'user' : '';
        const text = typeof message?.content === 'string' ? message.content.trim() : '';
        if (!role || !text || text.length > 2000) {
            return res.status(400).json({ error: 'Tin nhắn không hợp lệ hoặc vượt quá giới hạn.' });
        }
        contents.push({ role, parts: [{ text }] });
    }
    if (contents[contents.length - 1].role !== 'user') {
        return res.status(400).json({ error: 'Tin nhắn cuối phải là câu hỏi của bạn.' });
    }

    let totalAttachmentBytes = 0;
    const attachmentParts = [];
    for (const attachment of attachments) {
        const { mimeType, data, name } = attachment || {};
        if (typeof mimeType !== 'string' || !chatFileTypes.has(mimeType) || typeof data !== 'string' || data.length % 4 !== 0 || !/^[A-Za-z0-9+/]*={0,2}$/.test(data)) {
            return res.status(400).json({ error: 'Loại tệp không được hỗ trợ.' });
        }
        const bytes = Buffer.byteLength(data, 'base64');
        totalAttachmentBytes += bytes;
        if (!bytes || bytes > 10 * 1024 * 1024 || totalAttachmentBytes > 12 * 1024 * 1024) {
            return res.status(413).json({ error: 'Tệp vượt quá giới hạn 10 MB mỗi tệp hoặc 12 MB mỗi tin nhắn.' });
        }
        const safeName = typeof name === 'string' ? name.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 120) : 'Tệp đính kèm';
        attachmentParts.push({ text: `Tệp đính kèm: ${safeName}` }, { inlineData: { mimeType, data } });
    }
    if (attachments.length) contents[contents.length - 1].parts.push(...attachmentParts);

    try {
        const response = await ai.models.generateContentStream({
            model: 'gemini-3.8-flash',
            contents,
            config: {
                systemInstruction: `Bạn là Hero, trợ lý thân thiện trong ứng dụng Little Hero dành cho gia đình và trẻ em. Mặc định luôn trả lời bằng tiếng Việt tự nhiên, rõ ràng và ngắn gọn; chỉ dùng ngôn ngữ khác khi người dùng yêu cầu rõ ràng. Có thể trả lời chủ đề ngoài ứng dụng. Khi phù hợp, hướng dẫn tới tính năng liên quan: bản đồ (#/map), bài học (#/lessons), truyện (#/stories), trò chơi (#/games), nhiệm vụ (#/quests), thành tích (#/achievements), tủ đồ (#/wardrobe), phụ huynh (#/parents), gói dịch vụ (#/pricing), tài khoản (#/auth), hỗ trợ (#/faq). Không khẳng định có thể thực hiện thanh toán hoặc thay thế người lớn đáng tin cậy.`,
                maxOutputTokens: 512,
                temperature: 0.4
            }
        });
        res.status(200);
        res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache, no-transform');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();
        let hasText = false;
        for await (const chunk of response) {
            if (typeof chunk.text !== 'string' || !chunk.text) continue;
            hasText = true;
            res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
        if (hasText) res.write('data: [DONE]\n\n');
        else res.write(`data: ${JSON.stringify({ error: 'Gemini không trả về nội dung. Hãy thử lại với câu hỏi hoặc tệp khác.' })}\n\n`);
        res.end();
    } catch (error) {
        const status = Number(error?.status || error?.statusCode) || 0;
        const message = String(error?.message || 'Unknown Gemini API error')
            .replaceAll(process.env.GEMINI_API_KEY || '\u0000', '[redacted]')
            .slice(0, 800);
        console.error(`Gemini API request failed (HTTP ${status || 'unknown'}): ${message}`);

        if (status === 400) {
            const responseMessage = 'Gemini từ chối yêu cầu. Hãy thử câu hỏi văn bản ngắn hơn hoặc tệp được hỗ trợ.';
            if (res.headersSent) {
                res.write(`data: ${JSON.stringify({ error: responseMessage })}\n\n`);
                return res.end();
            }
            return res.status(502).json({ error: responseMessage });
        }
        if (status === 401 || status === 403) {
            const responseMessage = 'Gemini từ chối API key hoặc key chưa có quyền dùng API. Hãy tạo key trong Google AI Studio, bật Gemini API và khởi động lại máy chủ với key đó.';
            if (res.headersSent) {
                res.write(`data: ${JSON.stringify({ error: responseMessage })}\n\n`);
                return res.end();
            }
            return res.status(502).json({ error: responseMessage });
        }
        if (status === 429) {
            const responseMessage = 'Gemini đang hết hạn mức hoặc quá nhiều yêu cầu. Hãy kiểm tra quota/billing của dự án Google AI Studio và thử lại sau.';
            if (res.headersSent) {
                res.write(`data: ${JSON.stringify({ error: responseMessage })}\n\n`);
                return res.end();
            }
            return res.status(502).json({ error: responseMessage });
        }
        if (status === 404) {
            const responseMessage = 'Model Gemini không khả dụng cho API key hoặc tài khoản này. Hãy kiểm tra tên model và quyền truy cập trong Google AI Studio.';
            if (res.headersSent) {
                res.write(`data: ${JSON.stringify({ error: responseMessage })}\n\n`);
                return res.end();
            }
            return res.status(502).json({ error: responseMessage });
        }
        if (error?.name === 'TypeError' || /fetch failed|network|timeout|timed out/i.test(message)) {
            const responseMessage = 'Máy chủ không kết nối được tới Gemini. Hãy kiểm tra Internet, proxy hoặc tường lửa rồi thử lại.';
            if (res.headersSent) {
                res.write(`data: ${JSON.stringify({ error: responseMessage })}\n\n`);
                return res.end();
            }
            return res.status(502).json({ error: responseMessage });
        }
        const responseMessage = `Gemini chưa thể xử lý yêu cầu${status ? ` (HTTP ${status})` : ''}. Xem dòng lỗi Gemini API trong cửa sổ PowerShell đang chạy máy chủ để biết chi tiết; không chia sẻ API key.`;
        if (res.headersSent) {
            res.write(`data: ${JSON.stringify({ error: responseMessage })}\n\n`);
            return res.end();
        }
        res.status(502).json({ error: responseMessage });
    }
});

app.use((error, req, res, next) => {
    if (error?.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Yêu cầu quá lớn. Hãy giảm kích thước tệp đính kèm.' });
    }
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({ error: 'Dữ liệu gửi lên không hợp lệ.' });
    }
    next(error);
});

const PORT = process.env.PORT || 5500;
const HOST = process.env.HOST || '127.0.0.1';
const server = app.listen(PORT, HOST, () => console.log(`Server running on http://${HOST}:${PORT}`));
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the app currently using that port, then restart the Little Hero backend.`);
    } else {
        console.error('Little Hero backend failed to start:', error);
    }
    process.exitCode = 1;
});