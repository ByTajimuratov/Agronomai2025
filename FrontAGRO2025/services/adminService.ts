const API_URL = "https://agronomai2025.onrender.com/api/admin";

export const fetchAdminStats = async (token: string) => {
  const response = await fetch(`${API_URL}/stats`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Admin ekanligini tekshirish uchun
    }
  });
  return response.json();
};