// src/middleware/authMiddleware.ts
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Token topilmadi" });
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded: any = jwt.verify(token, secret);

    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(403).json({ error: "Token xatosi: " + error.message });
  }
};