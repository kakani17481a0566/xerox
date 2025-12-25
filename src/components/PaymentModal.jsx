import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, CreditCard, X, ShieldCheck } from 'lucide-react';

export default function PaymentModal({ isOpen, onClose, amount, onSuccess }) {
    const [status, setStatus] = useState('idle'); // idle, processing, success

    useEffect(() => {
        if (isOpen) {
            setStatus('idle');
        }
    }, [isOpen]);

    const handlePay = () => {
        setStatus('processing');
        // Simulate API call delay
        setTimeout(() => {
            setStatus('success');
            // Close modal and trigger success after showing success state briefly
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 1500);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-gray-50 border-b p-4 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                        <ShieldCheck className="mr-2 text-green-600 h-5 w-5" />
                        Secure Payment
                    </h3>
                    <button
                        onClick={onClose}
                        disabled={status !== 'idle'}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 text-center">
                    {status === 'idle' && (
                        <>
                            <div className="mb-6">
                                <p className="text-gray-500 mb-1">Total Amount</p>
                                <h2 className="text-4xl font-bold text-gray-900">₹{amount}</h2>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                                <div className="flex items-center mb-2">
                                    <CreditCard className="text-blue-600 h-5 w-5 mr-3" />
                                    <span className="font-semibold text-gray-700">Card ending in 4242</span>
                                </div>
                                <p className="text-xs text-blue-600 pl-8">Secure 256-bit SSL Encrypted</p>
                            </div>

                            <button
                                onClick={handlePay}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
                            >
                                Pay ₹{amount}
                            </button>
                        </>
                    )}

                    {status === 'processing' && (
                        <div className="py-8">
                            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800">Processing Payment...</h3>
                            <p className="text-gray-500 text-sm mt-2">Please do not close this window.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="py-8">
                            <div className="bg-green-100 p-3 rounded-full inline-block mb-4">
                                <CheckCircle className="h-12 w-12 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Payment Successful!</h3>
                            <p className="text-gray-500 text-sm mt-2">Redirecting...</p>
                        </div>
                    )}
                </div>

                {status === 'idle' && (
                    <div className="bg-gray-50 p-3 text-center border-t">
                        <p className="text-xs text-gray-400">Powered by Stripe (Mock)</p>
                    </div>
                )}
            </div>
        </div>
    );
}
