import { Request, Response } from 'express';
import { News } from '../models/News';
// Oldingi qadamda yaratgan servisimizni import qilamiz
import { generateDailyNews } from '../services/newsGenerator';

// 1. Barcha yangiliklarni olish
export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await News.find().sort({ date: -1 }); // Eng yangisi birinchi turadi
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: "Yangiliklarni olishda xatolik" });
  }
};

// 2. Qo'lda yangilik yaratish (Admin uchun)
export const createNews = async (req: Request, res: Response) => {
  try {
    const newNews = await News.create(req.body);
    res.status(201).json(newNews);
  } catch (error) {
    res.status(500).json({ error: "Yangilik yaratishda xatolik" });
  }
};

// 3. YANGI: Majburiy AI orqali yangilik yaratish (Test qilish uchun)
export const forceGenerateNews = async (req: Request, res: Response) => {
  try {
    console.log("Majburiy yangilik yaratish so'rovi keldi...");
    const generatedNews = await generateDailyNews();
    
    if (generatedNews) {
        res.json({ message: "Yangilik muvaffaqiyatli yaratildi!", data: generatedNews });
    } else {
        res.status(500).json({ error: "AI yangilik yarata olmadi." });
    }
  } catch (error) {
    console.error("Force Generate Error:", error);
    res.status(500).json({ error: "Server xatosi" });
  }
};