// Backend manzili
const API_URL = "http://localhost:5000/api/auth";

// 1. Ro'yxatdan o'tish
export const registerUser = async (userData: any) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// 2. Kirish (Login)
export const loginUser = async (userData: any) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

// 3. Profilni olish (TUZATILDI: POST -> GET) ✅
export const getUserProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/profile`, {
    method: "GET", // <--- GET bo'lishi shart
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    }
    // GET so'rovda 'body' bo'lmaydi!
  });
  return response.json();
};

// 4. Profilni yangilash
export const updateUserProfile = async (userData: any) => {
  const token = localStorage.getItem('token'); // Tokenni avtomatik olamiz

  if (!token) {
      throw new Error("Tizimga kirilmagan (Token yo'q)");
  }

  const response = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(userData)
  });
  
  return response.json();
};