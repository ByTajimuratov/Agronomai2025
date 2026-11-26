
import React, { useState } from 'react';
import { useAdCampaigns } from '../../hooks/useAdCampaigns';
import { Trash2, Image, DollarSign, Clock } from 'lucide-react';

export const AdsManager: React.FC = () => {
    const { ads, addAd, deleteAd } = useAdCampaigns();
    const [title, setTitle] = useState('');
    const [sponsor, setSponsor] = useState('');
    const [reward, setReward] = useState(50);
    const [duration, setDuration] = useState(5);
    const [image, setImage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addAd({
            title,
            sponsor,
            reward: Number(reward),
            duration: Number(duration),
            imageUrl: image || 'https://picsum.photos/800/1200?random=' + Date.now()
        });
        setTitle('');
        setSponsor('');
        setImage('');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Ads Manager</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
                    <h3 className="font-bold text-slate-700 mb-4">Create Campaign</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                            <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Ad Title" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Sponsor</label>
                            <input required value={sponsor} onChange={e => setSponsor(e.target.value)} className="w-full p-2 border rounded-lg" placeholder="Company Name" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reward</label>
                                <div className="flex items-center gap-2 border rounded-lg p-2">
                                    <DollarSign className="w-4 h-4 text-amber-500" />
                                    <input type="number" value={reward} onChange={e => setReward(Number(e.target.value))} className="w-full outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration (s)</label>
                                <div className="flex items-center gap-2 border rounded-lg p-2">
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full outline-none" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image URL</label>
                            <div className="flex items-center gap-2 border rounded-lg p-2">
                                <Image className="w-4 h-4 text-slate-400" />
                                <input value={image} onChange={e => setImage(e.target.value)} className="w-full outline-none" placeholder="https://..." />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700">Launch Campaign</button>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ads.map(ad => (
                        <div key={ad.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex gap-4 relative group">
                            <img src={ad.imageUrl} className="w-20 h-20 object-cover rounded-lg bg-gray-100" alt="Ad" />
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 line-clamp-1">{ad.title}</h4>
                                <p className="text-xs text-slate-500">{ad.sponsor}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">+{ad.reward} Coins</span>
                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{ad.duration}s</span>
                                </div>
                            </div>
                            <button onClick={() => deleteAd(ad.id)} className="absolute top-2 right-2 p-2 bg-white text-red-500 hover:bg-red-50 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
