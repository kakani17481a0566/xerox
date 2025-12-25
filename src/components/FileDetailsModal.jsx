import React from 'react';
import { X, FileText, Calendar, User, Printer, Layers, HardDrive, LayoutTemplate, BookOpen } from 'lucide-react';

export default function FileDetailsModal({ isOpen, onClose, order }) {
    if (!isOpen || !order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                        <FileText className="mr-2 text-blue-600" />
                        File Properties
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                            <FileText className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Filename</p>
                            <p className="font-bold text-gray-800 text-lg break-all">{order.fileName}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center text-gray-500 mb-1">
                                <User className="h-4 w-4 mr-1" />
                                <span className="text-xs font-semibold uppercase">Uploaded By</span>
                            </div>
                            <p className="font-medium text-gray-800">{order.studentName}</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center text-gray-500 mb-1">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span className="text-xs font-semibold uppercase">Date</span>
                            </div>
                            <p className="font-medium text-gray-800">
                                {new Date(order.timestamp).toLocaleDateString()}
                            </p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center text-gray-500 mb-1">
                                <Printer className="h-4 w-4 mr-1" />
                                <span className="text-xs font-semibold uppercase">Print Type</span>
                            </div>
                            <p className="font-medium text-gray-800">{order.type}</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center text-gray-500 mb-1">
                                <BookOpen className="h-4 w-4 mr-1" />
                                <span className="text-xs font-semibold uppercase">Sides</span>
                            </div>
                            <p className="font-medium text-gray-800">{order.sides || 'Single Sided'}</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center text-gray-500 mb-1">
                                <LayoutTemplate className="h-4 w-4 mr-1" />
                                <span className="text-xs font-semibold uppercase">Paper Size</span>
                            </div>
                            <p className="font-medium text-gray-800">{order.paperSize || 'A4'}</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center text-gray-500 mb-1">
                                <Layers className="h-4 w-4 mr-1" />
                                <span className="text-xs font-semibold uppercase">Copies</span>
                            </div>
                            <p className="font-medium text-gray-800">{order.copies}</p>
                        </div>

                        <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center text-gray-500 mb-1">
                                <HardDrive className="h-4 w-4 mr-1" />
                                <span className="text-xs font-semibold uppercase">Format</span>
                            </div>
                            <p className="font-medium text-gray-800 uppercase">{order.fileType}</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 border-t text-right flex justify-end space-x-3">
                    {order.onPrint && (
                        <button
                            onClick={order.onPrint}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition flex items-center"
                        >
                            <Printer className="mr-2 h-4 w-4" /> Print Document
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
