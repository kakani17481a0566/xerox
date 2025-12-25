import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { LogOut, Printer, User } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAppContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Printer className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="font-bold text-xl text-gray-800">Online Xerox</span>
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center text-gray-700">
                                    <User className="h-5 w-5 mr-1" />
                                    <span className="font-medium">{user.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-red-600 hover:text-red-800 transition-colors"
                                >
                                    <LogOut className="h-5 w-5 mr-1" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="space-x-4">
                                <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">Student Login</Link>
                                <Link to="/xerox" className="text-gray-600 hover:text-blue-600 font-medium">Xerox Login</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
