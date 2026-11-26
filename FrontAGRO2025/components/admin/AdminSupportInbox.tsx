
import React from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { TicketStatus } from '../../types';
import { MailOpen, Check, Clock, User } from 'lucide-react';

export const AdminSupportInbox: React.FC = () => {
    const { tickets, updateTicketStatus } = useGlobal();

    return (
        <div>
             <h2 className="text-2xl font-bold text-slate-800 mb-6">Support Inbox</h2>

             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                 {tickets.length === 0 ? (
                     <div className="p-12 text-center text-slate-400">
                         All caught up! No pending tickets.
                     </div>
                 ) : (
                     <div className="overflow-x-auto">
                         <table className="w-full text-left text-sm">
                             <thead className="bg-slate-50 text-slate-600 uppercase text-xs font-bold">
                                 <tr>
                                     <th className="px-6 py-4">Subject</th>
                                     <th className="px-6 py-4">User</th>
                                     <th className="px-6 py-4">Date</th>
                                     <th className="px-6 py-4">Status</th>
                                     <th className="px-6 py-4 text-right">Action</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                 {tickets.map(ticket => (
                                     <tr key={ticket.id} className="hover:bg-slate-50">
                                         <td className="px-6 py-4 max-w-xs">
                                             <div className="font-bold text-slate-800">{ticket.subject}</div>
                                             <div className="text-xs text-slate-500 truncate">{ticket.message}</div>
                                             <div className="mt-1 text-[10px] uppercase tracking-wide text-slate-400 bg-slate-100 inline-block px-1 rounded">
                                                 {ticket.category}
                                             </div>
                                         </td>
                                         <td className="px-6 py-4">
                                             <div className="flex items-center gap-2">
                                                 <User className="w-4 h-4 text-slate-400" />
                                                 <span className="font-medium text-slate-700">{ticket.userName}</span>
                                             </div>
                                         </td>
                                         <td className="px-6 py-4 text-slate-500">
                                             {new Date(ticket.createdAt).toLocaleDateString()}
                                         </td>
                                         <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                                ticket.status === TicketStatus.RESOLVED ? 'bg-green-100 text-green-700' :
                                                ticket.status === TicketStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                                {ticket.status}
                                            </span>
                                         </td>
                                         <td className="px-6 py-4 text-right">
                                             {ticket.status !== TicketStatus.RESOLVED && (
                                                 <button 
                                                    onClick={() => updateTicketStatus(ticket.id, TicketStatus.RESOLVED)}
                                                    className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ml-auto"
                                                 >
                                                     <Check className="w-4 h-4" /> Resolve
                                                 </button>
                                             )}
                                             {ticket.status === TicketStatus.PENDING && (
                                                  <button 
                                                    onClick={() => updateTicketStatus(ticket.id, TicketStatus.IN_PROGRESS)}
                                                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ml-auto mt-1"
                                                  >
                                                    <Clock className="w-4 h-4" /> Process
                                                  </button>
                                             )}
                                         </td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 )}
             </div>
        </div>
    );
};
