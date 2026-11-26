import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { UserCrop } from '../models/UserCrop';
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

// 1. Yangi ekin qo'shish va Reja tuzish (AI)
export const generateCropPlan = async (req: Request, res: Response) => {
  try {
    const { userId, cropName, plantingDate } = req.body;

    if (!cropName) return res.status(400).json({ error: "Ekin nomini kiriting" });

    // Modelni 1.5-flash ga o'zgartirdim (barqaror ishlashi uchun)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
      Sen professional agronomsan. Xorazm (O'zbekiston) iqlimi uchun "${cropName}" yetishtirish rejasini tuzib ber.
      Ekish sanasi: ${plantingDate}.
      
      Vazifa:
      1. Shu ekinning Xorazm iqlimida o'rtacha pishish vaqtini hisobla.
      2. Muhim agrotexnik tadbirlarni (su'g'orish, o'g'itlash) rejalashtir (kamida 5-6 ta bosqich).

      Javobni FAQAT JSON formatida ber. Boshqa gap yozma.
      Format:
      {
        "harvestDate": "YYYY-MM-DD",  
        "schedule": [
           { "dayOffset": 0, "title": "Ekish", "description": "..." },
           { "dayOffset": 5, "title": "Su'g'orish", "description": "..." }
        ]
      }
      Javob tili: O'zbekcha.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // JSON tozalash
    const start = responseText.indexOf('{');
    const end = responseText.lastIndexOf('}') + 1;
    const jsonStr = responseText.substring(start, end);
    const data = JSON.parse(jsonStr); 

    // Bazaga saqlash
    const newCrop = await UserCrop.create({
        userId,
        cropName,
        plantingDate,
        estimatedHarvestDate: data.harvestDate, 
        schedule: data.schedule
    });

    res.json(newCrop);

  } catch (error: any) {
    console.error("Calendar AI Error:", error);
    res.status(500).json({ error: "Reja tuzishda xatolik yuz berdi." });
  }
};

// 2. Foydalanuvchi ekinlarini olish
export const getUserCrops = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).query;
    if (!userId) return res.status(400).json({ error: "User ID kerak" });
    
    const crops = await UserCrop.find({ userId }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (error) {
    res.status(500).json({ error: "Ma'lumot olishda xatolik" });
  }
};

// 3. Ekinni o'chirish (DELETE)
export const deleteCrop = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UserCrop.findByIdAndDelete(id);
    res.json({ message: "Ekin o'chirildi" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "O'chirishda xatolik" });
  }
};

// 4. Vazifa statusini o'zgartirish (CHECKBOX)
export const toggleTaskStatus = async (req: Request, res: Response) => {
  try {
    const { cropId, taskId } = req.params;
    const { completed } = req.body; // Frontenddan true yoki false keladi

    // MongoDB da ichki massiv (schedule) elementini yangilash
    await UserCrop.findOneAndUpdate(
      { "_id": cropId, "schedule._id": taskId },
      { 
        "$set": { "schedule.$.completed": completed }
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Task Update Error:", error);
    res.status(500).json({ error: "Status o'zgartirishda xatolik" });
  }
};