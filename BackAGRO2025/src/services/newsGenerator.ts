import { GoogleGenerativeAI } from '@google/generative-ai';
import { News } from '../models/News';
import dotenv from 'dotenv';

dotenv.config();

// API Key borligini tekshiramiz
if (!process.env.GOOGLE_API_KEY) {
  console.error("❌ Xato: GOOGLE_API_KEY topilmadi!");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

export const generateDailyNews = async () => {
  try {
    // Model nomi to'g'irlandi: gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const today = new Date().toLocaleDateString('uz-UZ');
    
    const prompt = `
      Sen "AgronomAI" platformasi uchun tajribali agronom va qishloq xo'jaligi jurnalistisan.
      Bugungi sana: ${today}. 
      Xorazm viloyati iqlimi, tuproq sharoiti va hozirgi faslni (fevral oyi - qish/erta bahorga tayyorgarlik) hisobga olib, dehqonlar uchun juda muhim bo'lgan bitta yangilik yoki foydali maslahat yoz.

      Mavzu tanlashda erkin bo'l (Paxta, bug'doy, issiqxona, bog'dorchilik yoki yangi texnologiyalar).

      Javobni FAQAT quyidagi JSON formatida qaytar (markdown 'json' tegisiz, faqat ob'ekt):
      {
        "title": "Sarlavha (o'zbek tilida)",
        "content": "Asosiy matn (3-4 ta mazmunli gap, o'zbek tilida)",
        "category": "Maslahat | Texnologiya | Yangilik",
        "image_keyword": "wheat field | tractor | cotton | greenhouse"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON qismini ajratib olish (xavfsizroq usul)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("AI dan noto'g'ri formatda javob keldi");

    const newsData = JSON.parse(jsonMatch[0]);

    // Dinamik rasm yaratish (Mavzuga qarab Unsplash dan rasm tanlaydi)
    const randomId = Math.floor(Math.random() * 1000);
    const finalImage = `https://source.unsplash.com/featured/800x600/?agriculture,farming,${newsData.image_keyword || 'farm'}&sig=${randomId}`;

    // Bazaga saqlash
    const newEntry = await News.create({
        title: newsData.title,
        content: newsData.content,
        category: newsData.category,
        image: finalImage,
        date: new Date()
    });

    console.log("✅ Yangi yangilik bazaga qo'shildi:", newsData.title);
    return newEntry;

  } catch (error) {
    console.error("❌ News Generation Error:", error);
    return null;
  }
};