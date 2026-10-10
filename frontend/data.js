const CATS=[
{id:'sv',n:'Sinh tồn',e:'🏕️',c:'#F08A24',bg:'linear-gradient(#FFD9A8,#FFF3DC)'},
{id:'bv',n:'Tự bảo vệ',e:'🛡️',c:'#7B5CFF',bg:'linear-gradient(#D9CCFF,#F1EBFF)'},
{id:'ks',n:'Kỹ năng sống',e:'🧼',c:'#1FA98E',bg:'linear-gradient(#BDEFE3,#E9FBF5)'},
{id:'lp',n:'Lễ phép',e:'🙏',c:'#E8559A',bg:'linear-gradient(#FFCFE3,#FFEEF5)'},
{id:'vl',n:'Vâng lời',e:'👍',c:'#3A7BE0',bg:'linear-gradient(#C4DDFF,#EAF3FF)'},
{id:'xl',n:'Xin lỗi & bạn bè',e:'🤝',c:'#E5A800',bg:'linear-gradient(#FFEBA3,#FFF9DE)'}];
/* [bg, nhân vật 'khóa:x:tư thế:cảm xúc', lời, đạo cụ] */
const COMICS=[
{id:'c1',t:'Hero rửa tay',e:'🧼',p:0,link:'tay',pn:[
 ['#D6F1FF','me:20:idle,mom:62:wave','Hero chơi đất xong, tay lấm lem. Mẹ gọi: "Con ơi, ăn cơm nào!"','🍚🌤️'],
 ['#FFF0C9','me:34:walk:worry','Hero nhớ lời cô dạy: phải rửa tay trước khi ăn!','🚰'],
 ['#D9F7EC','me:40:wave','Hero xoa xà phòng và hát: "Bàn tay sạch, vi trùng chạy!"','🫧🧼'],
 ['#FFE3EC','me:24:cheer,mom:60:cheer','Mẹ mỉm cười: "Tay sạch bong! Con giỏi lắm!"','🍽️💛']]},
{id:'c2',t:'Bạn mới trong lớp',e:'🧒',p:0,link:'chiase',pn:[
 ['#E9F2FF','me:16:idle,gB:62:sad:sad','Lớp có bạn mới tên Nam. Nam đứng một mình, buồn thiu.','🏫'],
 ['#FFF0C9','me:34:walk,gB:62:sad:sad','Hero đến làm quen: "Chào Nam! Mình là Hero."','👋'],
 ['#D9F7EC','me:30:give,gB:52:wave','Hero rủ Nam: "Mình cùng chơi xếp hình nhé!"','🧱'],
 ['#FFE3EC','me:28:cheer,gB:50:cheer','Hai bạn cười vang. Có bạn mới thật vui!','🎈🎈']]},
{id:'c3',t:'Trời mưa đi học',e:'☔',p:0,link:'duong',pn:[
 ['#CFE0F5','me:24:idle,mom:58:idle','Sáng nay trời mưa to. Mẹ đưa Hero đến trường.','☔🌧️'],
 ['#DDE8F5','me:30:hold,mom:48:hold','Hero nắm chặt tay mẹ khi qua đường.','🚦'],
 ['#FFE2E2','me:24:no,mom:58:idle','Đèn đỏ rồi! Hero và mẹ đứng lại chờ đèn xanh.','🔴🚗'],
 ['#E3F7E8','me:30:bow,teacher:62:wave','Đến lớp, Hero khoanh tay chào: "Con chào cô ạ!"','🏫🌈']]},
{id:'c4',t:'Dọn phòng cùng mẹ',e:'🧸',p:1,link:'don',pn:[
 ['#FFF3D6','me:22:sad:worry,mom:60:idle','Phòng của Hero bừa bộn đồ chơi.','🧸🚗🧩'],
 ['#FFE9C9','me:28:idle,mom:60:wave','Mẹ nhẹ nhàng: "Chơi xong thì dọn lại nhé con."','💬'],
 ['#D9F7EC','me:30:give','Hero nhặt từng món bỏ vào hộp.','📦'],
 ['#FFE3EC','me:24:cheer,mom:60:hug','Phòng gọn gàng! Mẹ ôm Hero thật chặt.','✨💛']]}];

const TITLES=['Hero Tập Sự','Hero Dũng Cảm','Hero Nhanh Nhẹn','Hero Siêu Nhân','Hero Chiến Binh','Hero Huyền Thoại'];

