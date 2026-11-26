// src/middleware/authMiddleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log("--- DEBUG START ---");
  console.log("1. Authorization Header:", authHeader);

  const token = authHeader && authHeader.split(' ')[1];
  console.log("2. Ajratib olingan Token:", token ? "BOR" : "YO'Q");

  if (!token) {
    console.log("❌ XATO: Token topilmadi!");
    return res.status(401).json({ error: "Token topilmadi" });
  }

  try {
    // VAQTINCHA: .env ni chetga surib, to'g'ridan-to'g'ri 'secret' so'zini yozamiz
    // authController.ts da ham shunday ekanligiga 100% ishonch hosil qiling!
    const secret = 'secret'; 
    const decoded: any = jwt.verify(token, secret);

    console.log("✅ 3. Token muvaffaqiyatli tasdiqlandi. UserID:", decoded.userId);
    
    req.user = decoded; 
    console.log("--- DEBUG END ---");
    next();
  } catch (error: any) {
    console.log("❌ 4. JWT TASDIQLASHDA XATO:", error.message);
    console.log("--- DEBUG END ---");
    return res.status(403).json({ error: "Token xatosi: " + error.message });
  }
};