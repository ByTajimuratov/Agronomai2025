// --- ENUMS ---
export enum AppLanguage {
  EN = 'en',
  UZ = 'uz',
  RU = 'ru'
}

export enum SubscriptionTier {
  FREE = 'Free',
  PREMIUM = 'Premium'
}

export enum KhorezmDistrict {
  URGENCH_CITY = 'Urgench City',
  URGENCH_DISTRICT = 'Urgench District',
  KHIVA = 'Khiva',
  SHAVAT = 'Shavat',
  GURLEN = 'Gurlen',
  YANGIBOZOR = 'Yangibozor',
  HAZORASP = 'Hazorasp',
  KUSHKUPIR = 'Kushkupir',
  YANGIARYK = 'Yangiaryk',
  BAGAT = 'Bagat',
  KHONQA = 'Khonqa'
}

export enum MarketCategory {
  MACHINERY = 'machinery',
  FERTILIZER = 'fertilizer',
  SEEDS = 'seeds',
  TOOLS = 'tools',
  LIVESTOCK = 'livestock'
}

export enum OrderStatus {
  CREATED = 'created',
  PAID_ESCROW = 'paid_escrow',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum CropType {
  COTTON_KHOREZM_12 = 'Cotton (Khorezm-12)',
  WHEAT_KUMA = 'Wheat (Kuma)',
  RICE_LAZERNIY = 'Rice (Lazerniy)',
  MELON_GURLAN = 'Melon (Gurlan)',
  TOMATO_YUSUP = 'Tomato (Yusup)'
}

export enum TicketCategory {
  TECHNICAL = 'technical',
  SUGGESTION = 'suggestion',
  COMPLAINT = 'complaint',
  PARTNERSHIP = 'partnership'
}

export enum TicketStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved'
}

// --- INTERFACES ---

export interface User {
  _id?: string; // MongoDB ID
  id: string;   // Frontend ID compatibility
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  tier: SubscriptionTier | string;
  analysisCount: number; 
  district?: KhorezmDistrict | string;
  isAdmin?: boolean;
  password?: string;
}

export interface SellerContact {
  phone: string;
  telegram?: string;
}

export interface MarketItem {
  _id?: string;
  id: string;
  title: string;
  price: number;
  currency: string;
  category: MarketCategory | string;
  imageUrl: string;
  image?: string; // Backend compatibility
  images?: string[]; 
  location: KhorezmDistrict | string;
  coordinates?: { lat: number; lng: number };
  sellerName?: string;
  sellerId?: string;
  sellerContact?: SellerContact;
  verified?: boolean;
  status?: string;
  description?: string;
  datePosted?: string;
}

export interface Order {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemPrice: number;
  buyerId: string;
  sellerId: string;
  status: OrderStatus;
  paymentMethod: 'cash' | 'card';
  createdAt: string;
  updatedAt: string;
}

export interface NewsArticle {
  id?: string;
  _id?: string;
  title: string;
  image: string;
  content: string;
  date: string;
  author?: string;
  category?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

// --- CROP DATA & FARMING ---

export interface LocalizedText {
  uz: string;
  ru: string;
  en: string;
  [key: string]: string;
}

export interface CropTask {
  _id?: string;
  id?: string;
  dayOffset?: number; // Backend format
  type?: 'water' | 'fertilizer' | 'pest' | 'check' | 'analysis';
  title: string | LocalizedText; // String for backend, LocalizedText for static
  description?: string | LocalizedText;
  completed?: boolean;
}

export interface GrowthStage {
  stageName: LocalizedText;
  dayStart: number;
  dayEnd: number;
  tasks: CropTask[];
}

export interface CropData {
  id: string;
  category: string;
  label: LocalizedText;
  avgDays: number;
  baseTemp: number;
  allowedMonths: number[];
  growthSchedule: GrowthStage[];
}

// *** YANGI QO'SHILGAN (MUHIM) ***
export interface SavedCrop {
  _id: string;
  id?: string; // Frontend compatibility
  userId?: string;
  cropName: string;
  plantingDate: string;
  estimatedHarvestDate?: string;
  schedule: CropTask[];
  createdAt?: string;
  cropData?: CropData; // Optional, agar statik ma'lumot kerak bo'lsa
}

// --- SUPPORT & NOTIFICATIONS ---

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  category: TicketCategory;
  message: string;
  status: TicketStatus;
  createdAt: string;
  attachmentUrl?: string;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface PlantingAdvice {
  crop: string;
  bestPlantingDate: string;
  estimatedHarvest: string;
  notes: string;
}