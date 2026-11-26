import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  sellerPhone: String,
  
  // YANGI QO'SHILGAN MAYDON:
  location: { type: String, default: "Xorazm" }, 
  
  status: { type: String, enum: ['pending', 'verified'], default: 'pending' }, 
  image: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

export const Product = mongoose.model('Product', ProductSchema);