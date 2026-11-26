import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  dayOffset: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false }
});

const UserCropSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropName: { type: String, required: true },
  plantingDate: { type: Date, required: true },
  // --- YANGI QATOR ---
  estimatedHarvestDate: { type: Date }, 
  // -------------------
  schedule: [TaskSchema],
  createdAt: { type: Date, default: Date.now }
});

export const UserCrop = mongoose.model('UserCrop', UserCropSchema);