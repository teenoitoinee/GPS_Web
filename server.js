const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ตัวแปรเก็บข้อมูลชั่วคราวใน Memory (สำหรับใช้งานเบื้องต้น)
let database = [];

// API สำหรับรับข้อมูลและบันทึก
app.post('/api/save', (req, res) => {
    const data = req.body;
    data.timestamp = new Date().toISOString(); // แสตมป์เวลาจริงที่เซิร์ฟเวอร์
    database.push(data);
    console.log("บันทึกข้อมูลใหม่:", data);
    res.status(200).send({ message: 'Success' });
});

// API สำหรับ Export เป็น CSV
app.get('/api/export', (req, res) => {
    if (database.length === 0) {
        return res.status(404).send("ยังไม่มีข้อมูลให้ Export");
    }

    // สร้าง Header ของ CSV
    const headers = "EmpID,Position,Date,Latitude,Longitude,Timestamp\n";
    
    // นำข้อมูลมาต่อกัน
    const rows = database.map(row => {
        return `${row.empId},${row.position},${row.date},${row.lat},${row.lng},${row.timestamp}`;
    }).join("\n");

    const csvData = headers + rows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="gps_data.csv"');
    res.send(csvData);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
