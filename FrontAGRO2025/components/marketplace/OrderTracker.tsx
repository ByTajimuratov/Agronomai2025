
import React, { useState } from 'react';
import { useGlobal } from '../../store/GlobalStore';
import { Order, OrderStatus } from '../../types';
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronDown, ChevronUp, Box } from 'lucide-react';

export const OrderTracker: React.FC = () => {
    const { user, orders, updateOrderStatus, formatMoney } = useGlobal();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Filter relevant orders
    const myOrders = orders.filter(o => o.buyerId === user?.id || o.sellerId === user?.id)
                           .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    if (!user || myOrders.length === 0) return null;

    const steps = [
        { status: OrderStatus.CREATED, label: 'Buyurtma', icon: Clock },
        { status: OrderStatus.PAID_ESCROW, label: 'To\'lov', icon: CheckCircle },
        { status: OrderStatus.IN_TRANSIT, label: 'Yo\'lda', icon: Truck },
        { status: OrderStatus.DELIVERED, label: 'Yetkazildi', icon: MapPin },
        { status: OrderStatus.COMPLETED, label: 'Yakunlandi', icon: Package },
    ];

    const getStepIndex = (status: OrderStatus) => {
        // Handle Cash logic (skip paid_escrow visual if needed, but for simplicity linear)
        // If status is CREATED and method is CARD, step 1 is active.
        return steps.findIndex(s => s.status === status);
    };

    const handleAction = (order: Order) => {
        const isBuyer = user.id === order.buyerId;

        if (!isBuyer) { // Seller Logic
            if (order.status === OrderStatus.PAID_ESCROW || order.status === OrderStatus.CREATED) {
                updateOrderStatus(order.id, OrderStatus.IN_TRANSIT);
            } else if (order.status === OrderStatus.IN_TRANSIT) {
                updateOrderStatus(order.id, OrderStatus.DELIVERED);
            }
        } 
        else { // Buyer Logic
            if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.IN_TRANSIT) {
                if (confirm("Mahsulotni qabul qildingizmi? Pulingiz sotuvchiga o'tkaziladi.")) {
                    updateOrderStatus(order.id, OrderStatus.COMPLETED);
                }
            }
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            <div className="p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Box className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-gray-800 text-sm">My Orders</h3>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{myOrders.length} active</span>
            </div>

            <div className="divide-y divide-gray-100">
                {myOrders.map(order => {
                    const isBuyer = user.id === order.buyerId;
                    const isExpanded = expandedId === order.id;
                    const currentIndex = getStepIndex(order.status);
                    
                    // Correct index for Cash orders which stay at CREATED longer
                    const visualIndex = (order.paymentMethod === 'cash' && order.status === OrderStatus.CREATED) ? 0 : currentIndex;

                    return (
                        <div key={order.id} className="bg-white group">
                            <div 
                                onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <img src={order.itemImage} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[9px] text-white font-bold shadow-sm ${
                                            order.status === OrderStatus.COMPLETED ? 'bg-green-500' : 'bg-blue-500'
                                        }`}>
                                            {currentIndex + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{order.itemTitle}</h4>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            {isBuyer ? 'Seller:' : 'Buyer:'}
                                            <span className="font-medium text-gray-700 bg-gray-100 px-1 rounded">
                                                {isBuyer ? 'AgroMarket Seller' : 'Local Buyer'}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-emerald-600 text-sm">{formatMoney(order.itemPrice)}</p>
                                    <div className="flex items-center justify-end text-gray-400 mt-1">
                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </div>
                            </div>

                            {/* Detailed Stepper View */}
                            {isExpanded && (
                                <div className="p-5 bg-gray-50 border-t border-gray-100 animate-in slide-in-from-top-2">
                                    {/* Stepper UI */}
                                    <div className="flex justify-between items-center relative mb-8 px-2">
                                        <div className="absolute top-[14px] left-0 right-0 h-1 bg-gray-200 -z-0 rounded-full"></div>
                                        <div 
                                            className="absolute top-[14px] left-0 h-1 bg-emerald-500 -z-0 transition-all duration-700 rounded-full"
                                            style={{ width: `${(visualIndex / (steps.length - 1)) * 100}%` }}
                                        ></div>
                                        
                                        {steps.map((step, idx) => {
                                            const Icon = step.icon;
                                            const isCompleted = idx <= visualIndex;
                                            const isCurrent = idx === visualIndex;

                                            return (
                                                <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                        isCompleted 
                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-110' 
                                                        : 'bg-white border-2 border-gray-200 text-gray-300'
                                                    }`}>
                                                        <Icon className="w-4 h-4" />
                                                    </div>
                                                    <span className={`text-[8px] font-bold uppercase tracking-wider absolute -bottom-6 w-max ${
                                                        isCurrent ? 'text-emerald-700' : 'text-gray-400'
                                                    }`}>
                                                        {step.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Action Buttons */}
                                    {order.status !== OrderStatus.COMPLETED && order.status !== OrderStatus.CANCELLED && (
                                        <div className="flex justify-end pt-2 border-t border-gray-200 mt-4">
                                            {!isBuyer && (order.status === OrderStatus.PAID_ESCROW || order.status === OrderStatus.CREATED) && (
                                                <button onClick={() => handleAction(order)} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 flex items-center gap-2 transition-all">
                                                    <Truck className="w-4 h-4" /> Mark as Shipped
                                                </button>
                                            )}
                                            {!isBuyer && order.status === OrderStatus.IN_TRANSIT && (
                                                <button onClick={() => handleAction(order)} className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-purple-700 flex items-center gap-2 transition-all">
                                                    <MapPin className="w-4 h-4" /> Mark as Delivered
                                                </button>
                                            )}
                                            {isBuyer && (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.IN_TRANSIT) && (
                                                 <button onClick={() => handleAction(order)} className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700 flex items-center gap-2 transition-all">
                                                    <CheckCircle className="w-4 h-4" /> Confirm Receipt & Release Funds
                                                </button>
                                            )}
                                            {isBuyer && order.status === OrderStatus.CREATED && order.paymentMethod === 'card' && (
                                                <p className="text-xs text-gray-500 italic flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Waiting for seller to ship...
                                                </p>
                                            )}
                                             {isBuyer && order.status === OrderStatus.CREATED && order.paymentMethod === 'cash' && (
                                                <p className="text-xs text-gray-500 italic flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> Order placed. Waiting for delivery.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    {order.status === OrderStatus.COMPLETED && (
                                        <div className="text-center pt-2">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                                                <CheckCircle className="w-3 h-3" /> Transaction Completed
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
