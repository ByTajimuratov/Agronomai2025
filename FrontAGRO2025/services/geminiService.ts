import { AppLanguage } from "../types";

const BACKEND_URL = "https://agronomai2025.onrender.com/api";

// Yordamchi funksiya: User ID ni xavfsiz olish
const getSafeUserId = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    // Agar user null bo'lsa yoki id si bo'lmasa, null qaytaradi
    return user?._id || user?.id || null;
  } catch (error) {
    console.warn("Local storage xatosi (User ID olinmadi):", error);
    return null;
  }
};

// ---------------------------------------------------------
// 1. ODDIY CHAT FUNKSIYASI (Text Chat)
// ---------------------------------------------------------
export const chatWithAgronomist = async (
    history: {role: string, parts: {text: string}[]}[], 
    message: string, 
    language: AppLanguage
): Promise<string> => {
  try {
    // ID ni xavfsiz olamiz
    const userId = getSafeUserId();

    // Serverga JSON yuboramiz
    const response = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        history,
        userId: userId 
      })
    });

    if (!response.ok) {
      throw new Error('Chat serverida xatolik');
    }

    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("Chat Error:", error);
    return "Server bilan bog'lanishda xatolik yuz berdi. Internetni tekshiring.";
  }
};

// ---------------------------------------------------------
// 2. RASM TAHLILI FUNKSIYASI (Image Analysis)
// ---------------------------------------------------------
export const analyzeLeafImage = async (base64Image: string, language: AppLanguage): Promise<string> => {
  try {
    // A) Base64 rasmni Blob (Fayl) ga aylantiramiz
    const res = await fetch(base64Image);
    const blob = await res.blob();

    // B) FormData yaratamiz (Fayl yuborish uchun)
    const formData = new FormData();
    formData.append('image', blob, 'leaf.jpg'); 
    
    // Agar kelajakda rasm tahlilini ham tarixga saqlamoqchi bo'lsangiz, ID ni shu yerga qo'shish mumkin:
    // const userId = getSafeUserId();
    // if (userId) formData.append('userId', userId);

    // C) Backendga yuboramiz
    const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        // DIQQAT: Rasm uchun 'Content-Type' yozilmaydi!
        body: formData 
    });

    if (!response.ok) {
        throw new Error(`Rasm yuklashda xato: ${response.status}`);
    }

    const data = await response.json();
    
    return data.diagnosis || "Tahlil natijasi bo'sh.";

  } catch (error) {
    console.error("Analyze Error:", error);
    return "Rasmni tahlil qilishda xatolik yuz berdi.";
  }
};

// ---------------------------------------------------------
// 3. BOSHQALAR (Vaqtinchalik funksiyalar)
// ---------------------------------------------------------
export const getPlantingAdvice = async () => [];
export const generateGrowthPlan = async () => null;