import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, default: 'General' },
  image: String, // Rasm URL yoki Base64
  date: { type: Date, default: Date.now }
});

export const News = mongoose.model('News', NewsSchema);