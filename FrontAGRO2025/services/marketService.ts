const API_URL = "http://localhost:5000/api/market";

// 1. Barcha tovarlarni bazadan olish (Marketplace sahifasi uchun)
export const fetchProducts = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error("Tovarlarni yuklashda xato");
  return response.json();
};

// 2. Yangi tovar qo'shish (FormData - rasm fayli bilan birga)
export const createProduct = async (formData: FormData, token: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      // MUHIM: FormData ishlatganda "Content-Type" yozilmaydi!
      "Authorization": `Bearer ${token}`
    },
    body: formData 
  });
  
  if (!response.ok) throw new Error("Mahsulot qo'shishda xatolik");
  return response.json();
};