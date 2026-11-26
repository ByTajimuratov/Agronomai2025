import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Foydalanuvchi roli (Admin yoki Oddiy)
  role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  
  // --- YANGI: PREMIUM STATUSI ---
  tier:     { type: String, enum: ['Free', 'Premium'], default: 'Free' }, 
  // -----------------------------

  // Profil ma'lumotlari
  phone:    { type: String },
  district: { type: String },
  avatar:   { type: String },
  
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', UserSchema);