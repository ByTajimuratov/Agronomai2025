
import React, { useState } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { Trash2, Check, Search, Filter, AlertCircle, MoreHorizontal, Eye } from 'lucide-react';
import { MarketCategory } from '../../types';

export const MarketModeration: React.FC = () => {
  const { marketItems, deleteMarketItem } = useGlobal();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const filteredItems = marketItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = filterCategory === 'All' || item.category === filterCategory;
      return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Marketplace Control</h1>
            <p className="text-slate-500">Monitor, approve, or remove user listings.</p>
        </div>
        <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-gray-200 text-red-600 rounded-lg text-sm font-bold shadow-sm hover:bg-red-50 transition-colors flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Reported (0)
             </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search by product or seller..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                   <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                   <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer w-full"
                   >
                       <option value="All">All Categories</option>
                       {Object.values(MarketCategory).map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
                       ))}
                   </select>
              </div>
          </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                          <th className="px-6 py-4">Product</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Seller</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredItems.map(item => (
                          <tr key={item.id} className="group hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                      <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100 bg-gray-100" />
                                      <div>
                                          <p className="font-bold text-slate-900">{item.title}</p>
                                          <p className="text-xs text-slate-500">{item.location}</p>
                                      </div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium border border-gray-200">
                                      {item.category}
                                  </span>
                              </td>
                              <td className="px-6 py-4 font-mono font-medium text-slate-700">
                                  {item.price.toLocaleString()} <span className="text-slate-400 text-xs">{item.currency}</span>
                              </td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">
                                          {item.sellerName[0]}
                                      </div>
                                      <span className="font-medium text-slate-700">{item.sellerName}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  {item.verified ? (
                                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                          <Check className="w-3 h-3" /> Verified
                                      </span>
                                  ) : (
                                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                          Pending
                                      </span>
                                  )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                                          <Eye className="w-4 h-4" />
                                      </button>
                                      <button 
                                        onClick={() => deleteMarketItem(item.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                                        title="Remove Listing"
                                      >
                                          <Trash2 className="w-4 h-4" />
                                      </button>
                                  </div>
                              </td>
                          </tr>
                      ))}
                      {filteredItems.length === 0 && (
                          <tr>
                              <td colSpan={6} className="px-6 py-16 text-center">
                                  <div className="flex flex-col items-center justify-center text-gray-400">
                                      <Search className="w-12 h-12 mb-3 opacity-20" />
                                      <p className="font-medium">No listings match your search.</p>
                                  </div>
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};
