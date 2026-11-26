
import React, { useState } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { TicketCategory, TicketStatus } from '../../types';
import { MessageSquare, Plus, Clock, CheckCircle, Loader2, Paperclip } from 'lucide-react';

export const SupportCenter: React.FC = () => {
    const { t, tickets, createTicket, user } = useGlobal();
    const [view, setView] = useState<'list' | 'form'>('list');

    // Form State
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState<TicketCategory>(TicketCategory.TECHNICAL);
    const [message, setMessage] = useState('');

    const myTickets = tickets.filter(t => t.userId === user?.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        createTicket({
            userId: user.id,
            subject,
            category,
            message
        });

        setSubject('');
        setMessage('');
        setView('list');
    };

    return (
        <div className="p-4 pb-24 max-w-3xl mx-auto">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-agrogreen-600" /> {t('support')}
                </h2>
                {view === 'list' && (
                    <button 
                        onClick={() => setView('form')}
                        className="bg-agrogreen-600 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-1 shadow-md hover:bg-agrogreen-700"
                    >
                        <Plus className="w-4 h-4" /> {t('createTicket')}
                    </button>
                )}
            </div>

            {view === 'form' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in slide-in-from-right-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('subject')}</label>
                            <input 
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agrogreen-500 outline-none"
                                placeholder="Briefly describe the issue"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('category')}</label>
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value as TicketCategory)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agrogreen-500 outline-none bg-white"
                            >
                                <option value={TicketCategory.TECHNICAL}>{t('technical')}</option>
                                <option value={TicketCategory.SUGGESTION}>{t('suggestion')}</option>
                                <option value={TicketCategory.COMPLAINT}>{t('complaint')}</option>
                                <option value={TicketCategory.PARTNERSHIP}>{t('partnership')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">{t('message')}</label>
                            <textarea 
                                required
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-agrogreen-500 outline-none"
                                placeholder="Provide details..."
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button 
                                type="button" 
                                onClick={() => setView('list')}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="flex-1 py-3 rounded-xl font-bold text-white bg-agrogreen-600 hover:bg-agrogreen-700 shadow-md"
                            >
                                {t('submitTicket')}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="space-y-4">
                    {myTickets.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <MessageSquare className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500">No tickets found. Have a question?</p>
                        </div>
                    ) : (
                        myTickets.map(ticket => (
                            <div key={ticket.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`w-2 h-2 rounded-full ${
                                            ticket.status === TicketStatus.RESOLVED ? 'bg-green-500' :
                                            ticket.status === TicketStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-amber-500'
                                        }`}></span>
                                        <h3 className="font-bold text-gray-800">{ticket.subject}</h3>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-1">{ticket.message}</p>
                                    <span className="text-[10px] text-gray-400 mt-1 block">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                                    ticket.status === TicketStatus.RESOLVED ? 'bg-green-50 text-green-700 border-green-100' :
                                    ticket.status === TicketStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    'bg-amber-50 text-amber-700 border-amber-100'
                                }`}>
                                    {t(ticket.status as any)}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
