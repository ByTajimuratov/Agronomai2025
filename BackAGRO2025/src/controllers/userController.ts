import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

// 1. Profil ma'lumotini olish
export const getProfile = async (req: Request, res: Response) => {
  try {
    // Auth middleware orqali kelgan userId ni olamiz
    const userId = (req as any).user.userId; 
    
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

    res.json(user);
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ error: "Profilni olishda xatolik" });
  }
};

// 2. Profilni yangilash
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    
    // Frontenddan kelishi mumkin bo'lgan barcha maydonlarni ajratib olamiz
    // 'avatar' ham qo'shildi, chunki modelingizda u bor
    const { username, name, phone, district, avatar } = req.body;

    // Yangilanadigan ma'lumotlar obyektini tayyorlaymiz
    const updateData: any = {
      phone,
      district,
      avatar // Rasm (base64 yoki URL)
    };

    // Agar frontenddan 'name' yoki 'username' kelsa, uni bazadagi 'username'ga saqlaymiz
    if (username || name) {
      updateData.username = username || name;
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        updateData, 
        { new: true, runValidators: true } // Yangilangan ma'lumotni qaytarish va validatorlarni ishlatish
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }
    
    res.json(updatedUser);
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    if (error.code === 11000) {
        return res.status(400).json({ error: "Bu email yoki foydalanuvchi nomi band" });
    }
    res.status(500).json({ error: "Profilni yangilashda xatolik" });
  }
};

// 3. PAROLNI O'ZGARTIRISH
export const changePassword = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ error: "Eski va yangi parolni kiriting" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

        // Eski parolni tekshirish
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Eski parol noto'g'ri!" });
        }

        // Yangi parolni hash qilish
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        await user.save();
        res.json({ message: "Parol muvaffaqiyatli yangilandi!" });
    } catch (error) {
        console.error("Change Password Error:", error);
        res.status(500).json({ error: "Parolni o'zgartirishda xatolik" });
    }
};

// 4. Premiumga o'tkazish
export const upgradeToPremium = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;

    const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { tier: 'Premium' }, 
        { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ error: "Foydalanuvchi topilmadi" });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Premium Error:", error);
    res.status(500).json({ error: "Premiumga o'tishda xatolik" });
  }
};