// ตั้งค่าแผนที่เริ่มต้น (Bangkok)
let map = L.map('map').setView([13.7563, 100.5018], 10);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
let marker = L.marker([13.7563, 100.5018]).addTo(map);

// ฟังก์ชันอัปเดตแผนที่
function updateMap(lat, lng) {
    map.setView([lat, lng], 15);
    marker.setLatLng([lat, lng]);
}

// ระบบดึงพิกัด GPS อัตโนมัติ
document.getElementById('btnGetLocation').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            document.getElementById('lat').value = lat;
            document.getElementById('lng').value = lng;
            updateMap(lat, lng);
            alert('ดึงพิกัด GPS สำเร็จ!');
        }, () => {
            alert('ไม่สามารถเข้าถึงพิกัด GPS ได้ โปรดอนุญาตการเข้าถึง Location');
        });
    } else {
        alert('บราวเซอร์ของคุณไม่รองรับ GPS');
    }
});

// หากพิมพ์พิกัด Manual ให้แผนที่เปลี่ยนตาม
document.getElementById('lat').addEventListener('change', updateManual);
document.getElementById('lng').addEventListener('change', updateManual);
function updateManual() {
    let lat = document.getElementById('lat').value;
    let lng = document.getElementById('lng').value;
    if(lat && lng) updateMap(lat, lng);
}

// ส่งข้อมูลไปบันทึกที่ Server
document.getElementById('gpsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        empId: document.getElementById('empId').value,
        position: document.getElementById('position').value,
        date: document.getElementById('date').value,
        lat: document.getElementById('lat').value,
        lng: document.getElementById('lng').value
    };

    const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if(response.ok) {
        alert('บันทึกข้อมูลเรียบร้อยแล้ว');
        document.getElementById('gpsForm').reset();
    }
});

// ฟังก์ชัน Export CSV
document.getElementById('btnExport').addEventListener('click', () => {
    window.location.href = '/api/export';
});