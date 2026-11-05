# Trail Pack Checklist (PWA)

## ไฟล์
- index.html — ตัวแอป
- manifest.webmanifest — ข้อมูลแอป (ชื่อ ไอคอน สี)
- sw.js — Service worker ทำให้ใช้งานออฟไลน์ได้
- lucide.min.js — ไอคอน (เก็บในเครื่อง ไม่ต้องใช้เน็ต)
- icons/ — ไอคอนแอป

## วิธีขึ้นเว็บ (ต้องเป็น HTTPS)
**GitHub Pages:** สร้าง repo → อัปโหลดไฟล์ทั้งหมด → Settings → Pages → Branch: main / root → Save
**Netlify:** ลากโฟลเดอร์นี้ไปวางที่ app.netlify.com/drop
**VPS:** วางไฟล์ในโฟลเดอร์เว็บ (nginx) ที่มี SSL

## ติดตั้งบนมือถือ
- Android (Chrome): แบนเนอร์ "ติดตั้งเป็นแอป" ขึ้นอัตโนมัติ กด ติดตั้ง
- iPhone (Safari): กด ติดตั้ง → ทำตามขั้นตอน แชร์ → เพิ่มไปยังหน้าจอโฮม

## อัปเดตเวอร์ชัน
แก้ไฟล์แล้วเปลี่ยน `CACHE='trailpack-v3'` ใน sw.js เป็น v4, v5 ... เพื่อให้เครื่องผู้ใช้โหลดใหม่
# trailpack.github.io
