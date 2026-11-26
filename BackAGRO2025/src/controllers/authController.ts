import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// 1. Ro'yxatdan o'tish
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    
    // User borligini tekshirish
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Bu email band." });

    // Parolni shifrlash
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Yangi user yaratish
    const user = await User.create({ 
        username, 
        email, 
        password: hashedPassword 
    });

    res.status(201).json({ message: "Foydalanuvchi muvaffaqiyatli yaratildi!" });
  } catch (error) {
    console.error("Register xatoligi:", error);
    res.status(500).json({ error: "Register xatoligi" });
  }
};

// 2. Kirish (Login) - TUZATILDI ✅
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Email orqali qidirish
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Foydalanuvchi topilmadi" });

    // Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Parol noto'g'ri" });

    // Token yaratish
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    // ✅ MUHIM: Login qilganda barcha profil ma'lumotlarini qaytaramiz
    // Shunda frontenddagi ma'lumotlar (telefon, tuman) o'chib ketmaydi
    res.json({ 
        token, 
        user: { 
            _id: user._id,
            username: user.username, 
            email: user.email,
            role: user.role,
            tier: user.tier || "Free",     // Premium statusi
            phone: user.phone || "",       // Telefon raqami
            district: user.district || "", // Tuman
            avatar: user.avatar || ""      // Profil rasmi
        } 
    });
  } catch (error) {
    console.error("Login xatoligi:", error);
    res.status(500).json({ error: "Login xatoligi" });
  }
};