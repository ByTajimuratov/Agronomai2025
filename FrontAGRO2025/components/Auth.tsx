import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../store/GlobalStore';
import { Mail, ArrowRight, Fingerprint, Lock, Leaf, Facebook, Chrome, User as UserIcon, CheckSquare, Square, Loader2, AlertCircle } from 'lucide-react';
import { User, SubscriptionTier, KhorezmDistrict } from '../types';
import { ImageUpload } from './shared/ImageUpload';
import { ForgotPasswordModal } from './modals/ForgotPasswordModal';
// 1. Servisni import qilamiz
import { loginUser, registerUser } from '../services/authService';

interface AuthProps {
  onLogin: (user: User) => void;
}

// --- Input Component ---
const FloatingInput = ({ 
    id, 
    type, 
    value, 
    onChange, 
    label, 
    icon: Icon 
}: { 
    id: string, 
    type: string, 
    value: string, 
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, 
    label: string, 
    icon: React.ElementType 
}) => (
    <div className="relative mb-5 group">
        <div className="absolute top-3.5 left-4 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
            <Icon className="w-5 h-5" />
        </div>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="block px-4 pb-2.5 pt-5 w-full pl-12 text-sm text-gray-900 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 peer transition-all"
            placeholder=" "
            required
        />
        <label
            htmlFor={id}
            className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-12 peer-focus:text-emerald-600 peer-focus:dark:text-emerald-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
            {label}
        </label>
    </div>
);

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const { t } = useGlobal();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  
  // 2. Yangi state-lar (Yuklash va Xatolik)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  // Secret Admin Access Logic
  const tapTimeout = useRef<any>(null);
  const [tapCount, setTapCount] = useState(0);

  const handleSecretTap = () => {
      setTapCount(prev => {
          const newCount = prev + 1;
          if (newCount >= 5) {
              if (tapTimeout.current) clearTimeout(tapTimeout.current);
              navigate('/admin');
              return 0;
          }
          if (tapTimeout.current) clearTimeout(tapTimeout.current);
          tapTimeout.current = setTimeout(() => setTapCount(0), 2000);
          return newCount;
      });
  };

  // 3. Backendga ulanish logikasi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && !isTermsAccepted) return;

    setError(null); // Xatolikni tozalash
    setLoading(true); // Yuklashni boshlash

    try {
        if (isRegister) {
            // --- REGISTRATSIYA ---
            const res = await registerUser({
                username: fullName,
                email: email,
                password: password,
                // avatar: avatar (Hozircha rasm backendga ketmaydi, keyin qo'shamiz)
            });

            if (res.message) {
                alert("Muvaffaqiyatli ro'yxatdan o'tdingiz! Iltimos, tizimga kiring.");
                setIsRegister(false); // Login oynasiga o'tkazish
                setPassword(''); // Parolni tozalash xavfsizlik uchun
            } else {
                setError("Ro'yxatdan o'tishda xatolik.");
            }

        } else {
            // --- LOGIN (KIRISH) ---
            const data = await loginUser({ email, password });

            if (data.token) {
                // Tokenni saqlash
                localStorage.setItem('token', data.token);
                // User ma'lumotlarini saqlash (oddiyroq qilib)
                localStorage.setItem('user', JSON.stringify(data.user));

                // Frontend User tipiga moslashtirish
                const realUser: User = {
                    id: data.user._id || Date.now().toString(),
                    name: data.user.username,
                    email: data.user.email,
                    phone: data.user.phone || "",
                    tier: data.user.role === 'admin' ? SubscriptionTier.PREMIUM : SubscriptionTier.FREE,
                    analysisCount: 0,
                    photoUrl: avatar, // Backenddan kelsa o'shani qo'yamiz
                    district: KhorezmDistrict.URGENCH_DISTRICT // Default
                };
                
                onLogin(realUser);
                navigate('/');
            } else {
                setError(data.message || "Email yoki parol noto'g'ri");
            }
        }
    } catch (err: any) {
        console.error("Auth Error:", err);
        setError("Server bilan bog'lanishda xatolik. Internetni tekshiring.");
    } finally {
        setLoading(false); // Yuklashni to'xtatish
    }
  };

  const handleTermsClick = (e: React.MouseEvent) => {
      e.preventDefault();
      alert("Foydalanish shartlari (Terms of Service)");
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-emerald-900 z-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8 text-white">
            <div 
                onClick={handleSecretTap}
                className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-xl shadow-emerald-900/50 cursor-default select-none active:scale-95 transition-transform"
            >
                <Leaf className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">AgronomAI</h1>
            <p className="text-emerald-100 text-sm font-medium opacity-80 max-w-xs mx-auto">
                Xorazm dehqonlari uchun eng yaxshi yordamchi platforma
            </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl shadow-emerald-900/50 border border-white/50">
            
            {/* Toggle Slider */}
            <div className="relative bg-gray-100 rounded-xl p-1 flex mb-8">
                <div 
                    className={`absolute top-1 bottom-1 w-[48%] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${isRegister ? 'left-[51%]' : 'left-1'}`}
                ></div>
                <button 
                    onClick={() => { setIsRegister(false); setError(null); }}
                    className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors ${!isRegister ? 'text-emerald-700' : 'text-gray-500'}`}
                >
                    {t('login')}
                </button>
                <button 
                    onClick={() => { setIsRegister(true); setError(null); }}
                    className={`flex-1 relative z-10 py-2.5 text-sm font-bold transition-colors ${isRegister ? 'text-emerald-700' : 'text-gray-500'}`}
                >
                    {t('register')}
                </button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <div className="mb-6 flex justify-center animate-in fade-in zoom-in duration-300">
                        <ImageUpload 
                            currentImage={avatar} 
                            onImageSelected={setAvatar} 
                        />
                    </div>
                )}

                {isRegister && (
                    <div className="animate-in slide-in-from-right-4 duration-300">
                        <FloatingInput 
                            id="fullname" 
                            type="text" 
                            label="Ism-Familiya" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            icon={UserIcon}
                        />
                    </div>
                )}

                <FloatingInput 
                    id="email" 
                    type="email" 
                    label={t('email')} 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    icon={Mail}
                />
                
                <FloatingInput 
                    id="password" 
                    type="password" 
                    label={t('password')} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    icon={Lock}
                />

                {!isRegister && (
                    <div className="flex justify-end mb-6 -mt-2">
                        <button 
                            type="button" 
                            onClick={() => setIsForgotModalOpen(true)}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
                        >
                            Parolni unutdingizmi?
                        </button>
                    </div>
                )}

                {isRegister && (
                    <div className="flex items-start gap-3 mb-6 animate-in fade-in duration-500">
                        <button 
                            type="button" 
                            onClick={() => setIsTermsAccepted(!isTermsAccepted)}
                            className={`mt-0.5 shrink-0 transition-colors ${isTermsAccepted ? 'text-emerald-600' : 'text-gray-300 hover:text-gray-400'}`}
                        >
                            {isTermsAccepted ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                        </button>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Men <button onClick={handleTermsClick} className="text-emerald-600 font-bold hover:underline">Foydalanish shartlari</button> bilan tanishib chiqdim va roziman.
                        </p>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading || (isRegister && (!isTermsAccepted || !fullName))}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/30 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" /> Kutib turing...
                        </>
                    ) : (
                        <>
                            {isRegister ? t('register') : t('login')} <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8">
                <div className="relative flex items-center justify-center mb-6">
                    <div className="border-t border-gray-200 w-full absolute"></div>
                    <span className="bg-white px-3 text-xs text-gray-400 font-medium relative z-10">{t('or')}</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700">
                         <Chrome className="w-5 h-5 text-blue-500" /> Google
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-bold text-gray-700">
                         <Facebook className="w-5 h-5 text-blue-600" /> Facebook
                    </button>
                </div>
            </div>
        </div>

        <div className="mt-6 text-center">
            <button className="inline-flex items-center gap-2 text-emerald-100/60 text-sm hover:text-white transition-colors">
                <Fingerprint className="w-4 h-4" /> Biometric Access
            </button>
        </div>
      </div>

      <ForgotPasswordModal 
        isOpen={isForgotModalOpen} 
        onClose={() => setIsForgotModalOpen(false)} 
      />
    </div>
  );
};