import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Check, Trash2, Printer, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import FileDetailsModal from '../components/FileDetailsModal';

export default function XeroxDashboard() {
    const { orders, updateOrderStatus, deleteOrder } = useAppContext();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    // Stats Calculations
    const pendingCount = orders.filter(o => o.status === 'Pending').length;
    const completedCount = orders.filter(o => o.status === 'Completed').length;
    // Mock Revenue: ₹5 per page (assuming copies * 1 page for demo simplicity or just copies count * 5)
    const totalRevenue = orders
        .filter(o => o.status === 'Completed')
        .reduce((acc, curr) => acc + (curr.copies * 5), 0);

    return (
        <div className="space-y-8">
            <FileDetailsModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder ? { ...selectedOrder, onPrint: () => window.print() } : null}
            />

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-full mr-4">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Pending Orders</p>
                        <h3 className="text-2xl font-bold text-gray-800">{pendingCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-4 bg-green-50 text-green-600 rounded-full mr-4">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Completed</p>
                        <h3 className="text-2xl font-bold text-gray-800">{completedCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-4 bg-purple-50 text-purple-600 rounded-full mr-4">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Total Revenue (Est.)</p>
                        <h3 className="text-2xl font-bold text-gray-800">₹{totalRevenue}</h3>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold flex items-center text-gray-800">
                        <Printer className="mr-2 text-blue-600 h-5 w-5" /> Print Queue
                    </h2>
                    <span className="text-sm text-gray-500">
                        {orders.length} total requests
                    </span>
                </div>

                <div className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-300 mb-4">
                                <Printer className="h-full w-full" />
                            </div>
                            <p className="text-lg text-gray-500">No print orders available.</p>
                        </div>
                    ) : (
                        orders.map(order => (
                            <div
                                key={order.id}
                                className="p-6 hover:bg-gray-50 transition duration-150 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between group"
                                onClick={() => handleOrderClick(order)}
                            >
                                <div className="flex items-center flex-1 min-w-0 mb-4 sm:mb-0">
                                    <div className={`p-3 rounded-lg mr-4 flex-shrink-0 ${order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'
                                        }`}>
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 truncate pr-4">{order.fileName}</h3>
                                        <div className="flex items-center text-sm text-gray-500 space-x-4 mt-1">
                                            <span className="flex items-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                                                {order.studentName}
                                            </span>
                                            <span className="flex items-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                                                {order.type}
                                            </span>
                                            <span className="flex items-center">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></span>
                                                {order.copies} Copies
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end" onClick={(e) => e.stopPropagation()}>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mr-2 ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {order.status}
                                    </span>

                                    {order.status === 'Pending' && (
                                        <button
                                            onClick={() => updateOrderStatus(order.id, 'Completed')}
                                            className="text-green-600 hover:bg-green-100 p-2 rounded-full transition"
                                            title="Mark as Done"
                                        >
                                            <Check className="h-5 w-5" />
                                        </button>
                                    )}

                                    <button
                                        onClick={() => deleteOrder(order.id)}
                                        className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"
                                        title="Delete Order"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
