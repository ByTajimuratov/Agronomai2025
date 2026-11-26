import { Request, Response } from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Ticket } from '../models/Ticket';

export const getStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: 'open' });
    
    // Soxta daromad hisobi (haqiqiy to'lov bo'lmagani uchun)
    const revenue = totalProducts * 15000; 

    res.json({
      users: totalUsers,
      products: totalProducts,
      tickets: openTickets,
      revenue: revenue
    });
  } catch (error) {
    res.status(500).json({ error: "Statistika xatosi" });
  }
};