const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ให้ Server อ่านข้อมูลแบบ JSON ได้
app.use(express.json());

// ให้ Server เข้าถึงไฟล์ในโฟลเดอร์ public (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ตัวแปรเก็บข้อมูลชั่วคราวใน Memory (ถ้า Restart Server ข้อมูลจะรีเซ็ต)
// *ข้อควรระวังของ Render ตัวฟรี: Server จะรีเซ็ตตัวเองถ้าระบบหลับ ทำให้ข้อมูลในอาเรย์นี้หายไป 
// หากใช้จริงในระยะยาว แนะนำให้เชื่อมต่อ Database เช่น MongoDB หรือ PostgreSQL เพิ่มเติมครับ
let savedData = [];

// API สำหรับบันทึกข้อมูล
app.post('/api/save', (req, res) => {
    const { empId, position, date, latitude, longitude, type } = req.body;
    
    if (!empId || !position || !date || !latitude || !longitude) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const newData = { empId, position, date, latitude, longitude, type, timestamp: new Date().toLocaleString() };
    savedData.push(newData);
    
    res.json({ success: true, message: 'บันทึกข้อมูลสำเร็จ!', data: savedData });
});

// API สำหรับดึงข้อมูลทั้งหมดไปทำ CSV
app.get('/api/data', (req, res) => {
    res.json(savedData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// เพิ่มโค้ดนี้เข้าไปใน server.js เพื่อล็อกมงให้เข้าหน้าแรกแล้วเจอ index.html แน่นอน
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});