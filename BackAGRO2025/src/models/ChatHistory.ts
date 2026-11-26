import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userMessage: String,
  aiResponse: String,
  createdAt: { type: Date, default: Date.now }
});

export const ChatHistory = mongoose.model('ChatHistory', ChatSchema);