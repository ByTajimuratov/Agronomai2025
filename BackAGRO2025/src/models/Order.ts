import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    // Controllerda "productId" deb yozilgan, shuning uchun bu yerda ham shunday bo'lishi kerak
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    
    // "buyerId"
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // "sellerId"
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    // Statuslar Controllerga mos bo'lishi kerak ('new' qo'shildi)
    status: { type: String, enum: ['new', 'pending', 'completed', 'cancelled'], default: 'new' },
    
    createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model('Order', OrderSchema);