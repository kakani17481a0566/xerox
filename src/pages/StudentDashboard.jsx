import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Upload, FileText, CheckCircle, Clock, CreditCard, LayoutTemplate, Layers } from 'lucide-react';
import FileDetailsModal from '../components/FileDetailsModal';
import PaymentModal from '../components/PaymentModal';

export default function StudentDashboard() {
    const { addOrder, orders, user } = useAppContext();
    const [file, setFile] = useState(null);
    const [type, setType] = useState('Black & White');
    const [copies, setCopies] = useState(1);
    const [sides, setSides] = useState('Single Sided');
    const [paperSize, setPaperSize] = useState('A4');
    const [submitted, setSubmitted] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // Pricing Constants
    const RATE_BW = 2;
    const RATE_COLOR = 10;

    // Paper Size Surcharges
    const SURCHARGE_A4 = 0;
    const SURCHARGE_A3 = 5;
    const SURCHARGE_LEGAL = 2;

    // Calculate Rate and Total
    const calculateTotal = () => {
        let baseRate = type === 'Black & White' ? RATE_BW : RATE_COLOR;
        let paperSurcharge = 0;

        if (paperSize === 'A3') paperSurcharge = SURCHARGE_A3;
        if (paperSize === 'Legal') paperSurcharge = SURCHARGE_LEGAL;

        const typeRate = type === 'Black & White' ? 2 : 10;
        let sizeSurcharge = 0;
        if (paperSize === 'A3') sizeSurcharge = 5;
        if (paperSize === 'Legal') sizeSurcharge = 2;

        return (typeRate + sizeSurcharge) * copies;
    };

    const totalCost = calculateTotal();

    // Filter orders for the current student
    const myOrders = orders.filter(o => o.studentName === user?.name || o.studentName === 'John Doe');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Check file size (limit to 2MB for localStorage safety)
            if (selectedFile.size > 2 * 1024 * 1024) {
                alert("File is too large! Please upload a file smaller than 2MB.");
                return;
            }

            setFile(selectedFile);

            // Read file as Base64 for storage/printing
            const reader = new FileReader();
            reader.onload = (event) => {
                setFileData(event.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const initiatePayment = (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload a file first.");
            return;
        }
        if (deliveryMode === 'delivery' && !address.trim()) {
            alert("Please enter a delivery address.");
            return;
        }
        setIsPaymentOpen(true);
    };

    const handlePaymentSuccess = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        const newOrder = {
            fileName: file.name,
            fileType: file.name.split('.').pop(), // simple extension extraction
            type,
            copies: parseInt(copies),
            sides,
            paperSize,
            fileData: fileData, // Store the actual file content
            cost: totalCost, // Store the calculated cost
            deliveryMode,
            address: deliveryMode === 'delivery' ? address : null
        };

        addOrder(newOrder);
        setLoading(false);
        setSubmitted(true);
        setFile(null);
        setFileData(null);
        setIsPaymentOpen(false);

        // Reset success message after 3 seconds
        setTimeout(() => setSubmitted(false), 3000);
    };

    return (
        <>
            <FileDetailsModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                order={selectedOrder}
            />

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                amount={totalCost}
                onSuccess={handlePaymentSuccess}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Upload className="mr-2 text-black" /> Upload Document
                    </h2>

                    {submitted && (
                        <div className="bg-green-100 text-green-700 p-3 rounded mb-4 flex items-center animate-in fade-in slide-in-from-top-2">
                            <CheckCircle className="h-5 w-5 mr-2" /> Order placed successfully!
                        </div>
                    )}

                    <form onSubmit={initiatePayment}>
                        <div className="mb-6">
                            <div className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${file ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'
                                }`}>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="file-upload"
                                    required
                                />
                                <label htmlFor="file-upload" className="cursor-pointer block w-full h-full">
                                    {file ? (
                                        <div className="flex flex-col items-center justify-center text-black">
                                            <FileText className="h-8 w-8 mb-2" />
                                            <span className="font-semibold">{file.name}</span>
                                            <span className="text-xs text-gray-500 mt-1">Click to change</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Upload className="h-8 w-8 mb-2 text-gray-400" />
                                            <span className="font-medium">Click to upload PDF or DOCX</span>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-sm">Print Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black focus:border-black bg-white shadow-sm"
                                    >
                                        <option>Black & White</option>
                                        <option>Color</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {type === 'Black & White' ? '₹2/page' : '₹10/page'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-sm">Paper Size</label>
                                    <select
                                        value={paperSize}
                                        onChange={(e) => setPaperSize(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black focus:border-black bg-white shadow-sm"
                                    >
                                        <option>A4</option>
                                        <option>A3</option>
                                        <option>Legal</option>
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {paperSize === 'A3' ? '+₹5' : paperSize === 'Legal' ? '+₹2' : 'Standard'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-sm">Sides</label>
                                    <select
                                        value={sides}
                                        onChange={(e) => setSides(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black focus:border-black bg-white shadow-sm"
                                    >
                                        <option>Single Sided</option>
                                        <option>Double Sided</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-1 text-sm">Copies</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={copies}
                                        onChange={(e) => setCopies(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-black focus:border-black shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="text-gray-600 font-medium">Estimated Cost</span>
                                <span className="text-2xl font-bold text-gray-900">₹{totalCost}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white font-bold py-3.5 rounded-lg hover:bg-gray-800 transition flex justify-center items-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={!file}
                        >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Pay & Print
                        </button>
                    </form>
                </div>

                {/* Orders List */}
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Clock className="mr-2 text-black" /> Recent Orders
                    </h2>

                    <div className="space-y-4">
                        {myOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No orders history found.</p>
                            </div>
                        ) : (
                            myOrders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className="border p-4 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-50 transition hover:border-black group"
                                >
                                    <div>
                                        <h4 className="font-bold flex items-center text-gray-800 group-hover:text-black transition-colors">
                                            <FileText className="h-4 w-4 mr-2" /> {order.fileName}
                                        </h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-1 space-x-2">
                                            <span>{order.type}</span>
                                            <span>•</span>
                                            <span>{order.paperSize || 'A4'}</span>
                                            <span>•</span>
                                            <span>{order.copies} Copies</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
