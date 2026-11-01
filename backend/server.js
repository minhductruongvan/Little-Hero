const express = require('express');
const crypto = require('crypto');
const fsSync = require('fs');
const os = require('os');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
const { DatabaseSync } = require('node:sqlite');
const { promisify } = require('util');

const app = express();
const configuredAppOrigins = (process.env.LITTLE_HERO_ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
const allowedAppOrigins = new Set([
    'http://localhost:5500',
    'http://127.0.0.1:5500',
    'https://littlehero.id.vn',
    'https://www.littlehero.id.vn',
    ...configuredAppOrigins
]);
app.use((req, res, next) => {
    const origin = req.get('origin');
    if (allowedAppOrigins.has(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.vary('Origin');
    }
    if (req.method === 'OPTIONS' && req.path.startsWith('/api/')) return res.sendStatus(204);
    next();
});
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
const legacyAuthFile = process.env.LITTLE_HERO_AUTH_FILE
    || path.join(os.homedir(), '.little-hero', 'accounts.json');
const databaseFile = process.env.LITTLE_HERO_DATABASE_FILE
    || path.join(path.dirname(legacyAuthFile), 'accounts.sqlite');
fsSync.mkdirSync(path.dirname(databaseFile), { recursive: true });
const databaseDescriptor = fsSync.openSync(databaseFile, 'a', 0o600);
fsSync.closeSync(databaseDescriptor);
fsSync.chmodSync(databaseFile, 0o600);
const accountDatabase = new DatabaseSync(databaseFile);
accountDatabase.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA synchronous = FULL;
    CREATE TABLE IF NOT EXISTS accounts (
        email TEXT PRIMARY KEY COLLATE NOCASE,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        salt TEXT NOT NULL,
        password_hash TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS accounts_phone_idx ON accounts (phone);
`);
const scrypt = promisify(crypto.scrypt);
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
let authQueue = Promise.resolve();
const passwordRecoveryChallenges = new Map();
const passwordRecoveryRequests = new Map();

const withAuthUsers = (operation) => {
    const result = authQueue.then(async () => {
        const users = accountDatabase.prepare(`
            SELECT email, name, phone, salt, password_hash AS passwordHash
            FROM accounts
        `).all();
        return operation(users);
    });
    authQueue = result.then(() => undefined, () => undefined);
    return result;
};

const saveAuthUsers = (users) => {
    const upsertAccount = accountDatabase.prepare(`
        INSERT INTO accounts (email, name, phone, salt, password_hash)
        VALUES (@email, @name, @phone, @salt, @passwordHash)
        ON CONFLICT(email) DO UPDATE SET
            name = excluded.name,
            phone = excluded.phone,
            salt = excluded.salt,
            password_hash = excluded.password_hash
    `);
    accountDatabase.exec('BEGIN IMMEDIATE');
    try {
        users.forEach((account) => upsertAccount.run(account));
        accountDatabase.exec('COMMIT');
    } catch (error) {
        accountDatabase.exec('ROLLBACK');
        throw error;
    }
};

if (fsSync.existsSync(legacyAuthFile) && path.resolve(legacyAuthFile) !== path.resolve(databaseFile)
    && accountDatabase.prepare('SELECT COUNT(*) AS count FROM accounts').get().count === 0) {
    const legacyUsers = JSON.parse(fsSync.readFileSync(legacyAuthFile, 'utf8'));
    if (!Array.isArray(legacyUsers)) throw new Error('Invalid legacy account store.');
    saveAuthUsers(legacyUsers);
    console.log(`Migrated ${legacyUsers.length} Little Hero accounts to SQLite.`);
}

const normalizePhone = (phone) => phone.replace(/[ ()-]/g, '');

const validAccountDetails = (body) => {
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (name.length < 2 || name.length > 80) return { error: 'Hãy nhập họ và tên (từ 2 đến 80 ký tự).', code: 'INVALID_NAME', field: 'fullName' };
    if (email.length > 254 || !validEmail(email)) return { error: 'Email chưa đúng định dạng. Hãy nhập địa chỉ email hợp lệ.', code: 'INVALID_EMAIL', field: 'email' };
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
    if (email.length > 254 || !validEmail(email) || !password || password.length > 128) {
        return res.status(400).json({ error: 'Hãy nhập email và mật khẩu hợp lệ.' });
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
        if (!user) return res.status(401).json({ error: 'Email hoặc mật khẩu không chính xác.' });
        res.json({ user });
    } catch (error) {
        console.error('Lỗi đăng nhập Little Hero:', error);
        res.status(500).json({ error: 'Không thể đăng nhập lúc này. Vui lòng thử lại.' });
    }
});

const recoveryChannelConfigured = (channel) => channel === 'email'
    ? Boolean(process.env.RESEND_API_KEY && process.env.LITTLE_HERO_EMAIL_FROM)
    : Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER);

const sendRecoveryCode = async (channel, destination, code) => {
    if (channel === 'email') {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: process.env.LITTLE_HERO_EMAIL_FROM,
                to: [destination],
                subject: 'Mã khôi phục mật khẩu Little Hero',
                text: `Mã xác minh của bạn là ${code}. Mã có hiệu lực trong 10 phút. Nếu bạn không yêu cầu khôi phục mật khẩu, hãy bỏ qua email này.`
            })
        });
        if (!response.ok) throw new Error(`Email delivery failed with status ${response.status}.`);
        return;
    }

    const body = new URLSearchParams({
        To: destination,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: `Ma xac minh Little Hero: ${code}. Ma co hieu luc trong 10 phut.`
    });
    const credentials = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(process.env.TWILIO_ACCOUNT_SID)}/Messages.json`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body
    });
    if (!response.ok) throw new Error(`SMS delivery failed with status ${response.status}.`);
};

app.post('/api/auth/recovery/request', async (req, res) => {
    const channel = req.body?.channel;
    const identifier = typeof req.body?.identifier === 'string' ? req.body.identifier.trim() : '';
    const email = channel === 'email' ? identifier.toLowerCase() : '';
    const phone = channel === 'phone' ? normalizePhone(identifier) : '';
    if (!['email', 'phone'].includes(channel)
        || (channel === 'email' && (email.length > 254 || !validEmail(email)))
        || (channel === 'phone' && !/^\+84\d{9,10}$/.test(phone))) {
        return res.status(400).json({ error: 'Hãy nhập email hoặc số điện thoại đã đăng ký hợp lệ.' });
    }
    if (!recoveryChannelConfigured(channel)) {
        return res.status(503).json({
            error: channel === 'email'
                ? 'Máy chủ chưa cấu hình dịch vụ gửi email khôi phục.'
                : 'Máy chủ chưa cấu hình dịch vụ gửi SMS khôi phục.'
        });
    }

    const destination = channel === 'email' ? email : phone;
    const now = Date.now();
    for (const [key, requestTime] of passwordRecoveryRequests) {
        if (now - requestTime >= 60_000) passwordRecoveryRequests.delete(key);
    }
    for (const [challengeId, challenge] of passwordRecoveryChallenges) {
        if (challenge.expiresAt <= now) passwordRecoveryChallenges.delete(challengeId);
    }
    if (passwordRecoveryChallenges.size >= 10_000) {
        return res.status(503).json({ error: 'Dịch vụ khôi phục đang bận. Vui lòng thử lại sau.' });
    }
    const lastRequest = passwordRecoveryRequests.get(`${channel}:${destination}`);
    if (lastRequest && now - lastRequest < 60_000) {
        return res.status(429).json({ error: 'Vui lòng đợi một phút trước khi yêu cầu mã mới.' });
    }
    passwordRecoveryRequests.set(`${channel}:${destination}`, now);

    try {
        const account = await withAuthUsers((users) => users.find((entry) =>
            channel === 'email'
                ? entry.email?.toLowerCase() === email
                : typeof entry.phone === 'string' && normalizePhone(entry.phone) === phone
        ));
        const challengeId = crypto.randomBytes(24).toString('hex');
        const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0');
        const secret = crypto.randomBytes(32).toString('hex');
        const codeHash = crypto.createHmac('sha256', secret).update(code).digest();
        passwordRecoveryChallenges.set(challengeId, {
            email: account?.email || '',
            secret,
            codeHash,
            expiresAt: now + 10 * 60_000,
            attempts: 0
        });
        if (account) {
            try {
                await sendRecoveryCode(channel, destination, code);
            } catch (error) {
                passwordRecoveryChallenges.delete(challengeId);
                console.error('Không thể gửi mã khôi phục Little Hero:', error.message);
                return res.status(502).json({ error: 'Không thể gửi mã xác minh lúc này. Vui lòng thử lại sau.' });
            }
        }
        res.json({
            challengeId,
            message: 'Nếu thông tin này thuộc tài khoản Little Hero, mã xác minh sẽ được gửi trong ít phút.'
        });
    } catch (error) {
        console.error('Lỗi yêu cầu khôi phục mật khẩu Little Hero:', error);
        res.status(500).json({ error: 'Không thể yêu cầu mã khôi phục lúc này. Vui lòng thử lại.' });
    }
});

app.post('/api/auth/recovery/reset', async (req, res) => {
    const challengeId = typeof req.body?.challengeId === 'string' ? req.body.challengeId : '';
    const code = typeof req.body?.code === 'string' ? req.body.code.trim() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    if (!/^[a-f0-9]{48}$/.test(challengeId) || !/^\d{6}$/.test(code)) {
        return res.status(400).json({ error: 'Mã xác minh hoặc yêu cầu khôi phục không hợp lệ.' });
    }
    if (password.length < 8 || password.length > 128) {
        return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 8 ký tự (tối đa 128 ký tự).' });
    }

    const challenge = passwordRecoveryChallenges.get(challengeId);
    if (!challenge || challenge.expiresAt < Date.now() || !challenge.email) {
        passwordRecoveryChallenges.delete(challengeId);
        return res.status(400).json({ error: 'Mã xác minh đã hết hạn hoặc không hợp lệ. Hãy yêu cầu mã mới.' });
    }
    challenge.attempts += 1;
    const submittedHash = crypto.createHmac('sha256', challenge.secret).update(code).digest();
    if (challenge.attempts > 5 || !crypto.timingSafeEqual(submittedHash, challenge.codeHash)) {
        if (challenge.attempts >= 5) passwordRecoveryChallenges.delete(challengeId);
        return res.status(400).json({ error: 'Mã xác minh không chính xác hoặc đã hết lượt thử.' });
    }

    try {
        const updated = await withAuthUsers(async (users) => {
            const account = users.find((entry) => entry.email === challenge.email);
            if (!account) return false;
            const salt = crypto.randomBytes(16).toString('hex');
            const passwordHash = await scrypt(password, salt, 64, {
                N: 16384, r: 8, p: 1, maxmem: 32 * 1024 * 1024
            });
            account.salt = salt;
            account.passwordHash = passwordHash.toString('hex');
            await saveAuthUsers(users);
            return true;
        });
        passwordRecoveryChallenges.delete(challengeId);
        if (!updated) return res.status(400).json({ error: 'Không tìm thấy tài khoản cần khôi phục.' });
        res.json({ message: 'Đã đổi mật khẩu. Bạn có thể đăng nhập bằng mật khẩu mới.' });
    } catch (error) {
        console.error('Lỗi đặt lại mật khẩu Little Hero:', error);
        res.status(500).json({ error: 'Không thể đổi mật khẩu lúc này. Vui lòng thử lại.' });
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
                systemInstruction: `Bạn là Hero, trợ lý AI thân thiện trong ứng dụng Little Hero dành cho gia đình và trẻ em. Hỗ trợ câu hỏi tổng quát trên nhiều chủ đề và câu hỏi về Little Hero; trả lời tự nhiên bằng tiếng Việt trừ khi người dùng yêu cầu ngôn ngữ khác. Đọc kỹ toàn bộ ngữ cảnh hội thoại và nội dung tệp đính kèm trước khi trả lời. Đưa ra câu trả lời hữu ích, có cấu trúc và đủ chi tiết; hỏi lại khi thiếu thông tin quan trọng. Phân biệt điều đã biết với suy đoán, nói rõ khi không chắc hoặc cần thông tin cập nhật; không bịa dữ kiện, không tuyên bố đã tìm kiếm Internet hay thực hiện hành động bên ngoài. Khi phù hợp, hướng dẫn tới tính năng liên quan: bản đồ (#/map), bài học (#/lessons), truyện (#/stories), trò chơi (#/games), nhiệm vụ (#/quests), thành tích (#/achievements), tủ đồ (#/wardrobe), phụ huynh (#/parents), gói dịch vụ (#/pricing), tài khoản (#/auth), hỗ trợ (#/faq). Không yêu cầu người dùng gửi mật khẩu, mã xác minh, địa chỉ nhà hoặc dữ liệu riêng tư của trẻ; không khẳng định có thể thực hiện thanh toán, chẩn đoán y tế hay thay thế chuyên gia/người lớn đáng tin cậy. Nếu ai đó có thể đang gặp nguy hiểm, hướng dẫn họ tìm người lớn đáng tin cậy hoặc dịch vụ khẩn cấp tại nơi họ sống.`,
                maxOutputTokens: 1024,
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://127.0.0.1:${PORT}`));