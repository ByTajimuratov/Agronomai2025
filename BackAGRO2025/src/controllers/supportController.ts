import { Request, Response } from 'express';
import { Ticket } from '../models/Ticket';

export const createTicket = async (req: Request, res: Response) => {
  try {
    const { userId, subject, message } = req.body;
    const ticket = await Ticket.create({ userId, subject, message });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: "Xatolik" });
  }
};

export const getTickets = async (req: Request, res: Response) => {
  const tickets = await Ticket.find().populate('userId', 'username email');
  res.json(tickets);
};