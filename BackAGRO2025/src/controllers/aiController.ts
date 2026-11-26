import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatHistory } from '../models/ChatHistory';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);

/**
 * 1. CHAT (Matnli suhbat)
 */
export const chatHandler = async (req: Request, res: Response) => {
  try {
    const { message, history, userId } = req.body; 

  
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: "You are AgronomAI for Khorezm region. Answer in the requested language." 
    });

    // Tarixni tozalash
    let validHistory = Array.isArray(history) ? history.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.parts?.[0]?.text || msg.text || "" }] 
    })) : [];

    if (validHistory.length > 0 && validHistory[0].role === 'model') {
        validHistory = validHistory.slice(1);
    }

    const chat = model.startChat({ history: validHistory });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });

    // Bazaga saqlash
    if (userId) {
        ChatHistory.create({ userId, userMessage: message, aiResponse: text })
        .catch(err => console.error("❌ Tarixni saqlashda xato:", err));
    }
  } catch (error: any) {
    console.error("❌ AI CHAT XATOSI:", error);
    res.status(500).json({ error: "AI javob bera olmadi." });
  }
};

/**
 * 2. BARG DIAGNOSTIKASI (Rasm tahlili)
 */
export const analyzeLeaf = async (req: any, res: Response) => {
  try {
    // 1. Rasm kelganini tekshirish
    if (!req.file) {
      return res.status(400).json({ error: "Iltimos, barg rasmini yuklang." });
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", // <--- Model nomi
        systemInstruction: "Siz Xorazm viloyatida ishlaydigan tajribali agronom-olim va o'simliklar patologiyasiz."
    });

    // 2. Rasmni o'qish
    const imagePath = req.file.path; // Rasm joylashgan joy
    const imageBuffer = fs.readFileSync(imagePath);
    
    const imageData = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    const prompt = `Ushbu barg rasmini diqqat bilan tahlil qiling va quyidagi ma'lumotlarni O'zbek tilida taqdim eting:
    1. Kasallik yoki zararkunanda nomi.
    2. Kasallikning kelib chiqish sababi (Xorazm iqlimi nuqtai nazaridan).
    3. Davolash bo'yicha aniq tavsiyalar (O'zbekistonda mavjud bo'lgan preparatlar yoki biologik usullar).
    4. Kelgusida ushbu kasallikni oldini olish choralari.
    Javobni chiroyli va tushunarli formatda yozing.`;

    const result = await model.generateContent([prompt, imageData]);
    const response = await result.response;
    const text = response.text();

    // 3. --- MUHIM: Rasmni o'chirib tashlash ---
    // Javob olib bo'lingach, serverdan rasmni o'chiramiz, bo'lmasa joy to'lib qoladi.
    fs.unlink(imagePath, (err) => {
        if (err) console.error("Faylni o'chirishda xato:", err);
    });

    // 4. Javobni Frontendga yuborish
    res.json({ 
        success: true,
        diagnosis: text
    });

  } catch (error: any) {
    console.error("❌ AI DIAGNOSTIKA XATOSI:", error);
    res.status(500).json({ error: "AI rasmni tahlil qila olmadi." });
  }
};