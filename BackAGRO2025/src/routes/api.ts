import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// --- CONTROLLERS ---
import { register, login } from '../controllers/authController';
import { chatHandler, analyzeLeaf } from '../controllers/aiController';
import { 
    getProducts, 
    createProduct, 
    createOrder // Yangi qo'shilgan
} from '../controllers/marketController';
import { 
    getProfile, 
    updateProfile, 
    upgradeToPremium, 
    changePassword 
} from '../controllers/userController';
import { getStats } from '../controllers/adminController';
import { createTicket, getTickets } from '../controllers/supportController';
import { getWeather, getForecast } from '../controllers/weatherController'; 
import { getNews, createNews, forceGenerateNews } from '../controllers/newsController';
import { 
    generateCropPlan, 
    getUserCrops, 
    deleteCrop,       
    toggleTaskStatus  
} from '../controllers/calendarController';

// --- MIDDLEWARE ---
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// --- MULTER SOZLAMALARI ---
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// ================= ROUTELAR (YO'LLAR) =================

// --- 1. AUTH & USER ---
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', authMiddleware, getProfile);
router.put('/auth/profile', authMiddleware, updateProfile);
router.put('/auth/change-password', authMiddleware, changePassword); // Parol o'zgartirish
router.post('/auth/upgrade', authMiddleware, upgradeToPremium);      // Premium olish

// --- 2. AI (Chat va Rasm) ---
router.post('/chat', chatHandler);
router.post('/analyze', upload.single('image'), analyzeLeaf);

// --- 3. MARKET (Bozor) ---
router.get('/market', getProducts);
router.post('/market', authMiddleware, upload.single('image'), createProduct);
router.post('/market/order', authMiddleware, createOrder); // Buyurtma berish

// --- 4. ADMIN ---
router.get('/admin/stats', authMiddleware, getStats);

// --- 5. NEWS (Yangiliklar) ---
router.get('/news', getNews);
router.post('/news', authMiddleware, createNews);
router.get('/news/generate', forceGenerateNews); // Test uchun

// --- 6. SUPPORT ---
router.post('/support', authMiddleware, createTicket);
router.get('/support', authMiddleware, getTickets);

// --- 7. CALENDAR ---
router.post('/calendar/generate', authMiddleware, generateCropPlan);
router.get('/calendar/list', authMiddleware, getUserCrops);
router.delete('/calendar/:id', authMiddleware, deleteCrop);
router.put('/calendar/:cropId/task/:taskId', authMiddleware, toggleTaskStatus);

// --- 8. WEATHER ---
router.get('/weather', getWeather);
router.get('/weather/forecast', getForecast);

export default router;