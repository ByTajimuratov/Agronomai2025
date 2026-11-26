import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Order } from '../models/Order'; 

// 1. Barcha mahsulotlarni olish
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate('sellerId', 'username phone') // DIQQAT: User modelida 'name' emas 'username' bor
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Tovarlarni yuklashda xatolik yuz berdi" });
  }
};

// 2. Yangi mahsulot qo'shish
export const createProduct = async (req: any, res: Response) => { 
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';
    
    // TUZATILDI: .id emas .userId
    const userId = req.user.userId; 

    const productData = {
      sellerId: userId, 
      title: req.body.title, // TUZATILDI: Modelda 'title', frontenddan ham 'title' keladi
      price: Number(req.body.price),
      category: req.body.category,
      description: req.body.description,
      image: imageUrl,
      // location: req.body.location, // Agar modelga location qo'shmagan bo'lsangiz, buni olib tashlang
      status: 'verified' 
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (error: any) {
    console.error("Product Create Error:", error);
    res.status(500).json({ error: "Mahsulot saqlashda xatolik" });
  }
};

// 3. SOTIB OLISH (Buyurtma berish)
export const createOrder = async (req: any, res: Response) => {
    try {
        const { productId, sellerId } = req.body;
        
        // TUZATILDI: .id emas .userId
        const buyerId = req.user.userId; 

        if (buyerId === sellerId) {
            return res.status(400).json({ error: "O'z mahsulotingizni sotib ololmaysiz" });
        }

        // Bazada buyurtma yaratish
        const newOrder = await Order.create({
            productId: productId, // TUZATILDI: Modelda productId
            buyerId: buyerId,     // TUZATILDI: Modelda buyerId
            sellerId: sellerId,   // TUZATILDI: Modelda sellerId
            status: 'new'         // TUZATILDI: Modelda 'new' (yoki 'pending' agar o'zgartirgan bo'lsangiz)
        });

        res.json({ 
            success: true, 
            message: "Buyurtma yuborildi! Sotuvchi tez orada bog'lanadi.", 
            order: newOrder 
        });
    } catch (error) {
        console.error("Order Error:", error);
        res.status(500).json({ error: "Buyurtma berishda xatolik" });
    }
};