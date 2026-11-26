import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import apiRoutes from './routes/api';

// --- YANGI IMPORTLAR (Avtomatlashtirish uchun) ---
import cron from 'node-cron';
import { generateDailyNews } from './services/newsGenerator'; 
// -------------------------------------------------

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS va Parserlar
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 2. UPLOADS papkasini sozlash
const uploadPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
    console.log('✅ "uploads" papkasi yaratildi');
}
app.use('/uploads', express.static(uploadPath));

// 3. ROUTERLARNI ULASH
app.use('/api', apiRoutes); 

// 4. MONGODB BILAN BOG'LANISH
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agronomai')
  .then(() => console.log('✅ MongoDB bazasiga ulandi'))
  .catch((err) => console.error('❌ Baza xatosi:', err));

// --- 5. CRON JOB (AVTOMATIK YANGILIK) ---
// Har kuni ertalab soat 08:00 da ishga tushadi
cron.schedule('0 8 * * *', async () => {
  console.log("⏰ Vaqt bo'ldi! Avtomatik yangilik yaratilmoqda...");
  await generateDailyNews();
});

// TEST UCHUN (Server yonishi bilan bitta yangilik yaratish):
// Agar xohlasangiz, pastdagi izohni olib tashlang va serverni qayta yoqing:
// generateDailyNews(); 
// ----------------------------------------

app.get('/', (req, res) => {
  res.send('AgronomAI Serveri Ishlamoqda 🚀');
});

app.listen(PORT, () => {
  console.log(`Server http://localhost:${PORT} da ishga tushdi`);
});