import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null); // { role: 'student' | 'xerox', email: '' }
    const [orders, setOrders] = useState([
        {
            id: 1,
            fileName: 'Physics_Notes.pdf',
            fileType: 'pdf',
            status: 'Pending',
            type: 'Black & White',
            copies: 1,
            studentName: 'John Doe',
            timestamp: new Date().toISOString(),
        },
        {
            id: 2,
            fileName: 'Chemistry_Lab.docx',
            fileType: 'docx',
            status: 'Completed',
            type: 'Color',
            copies: 2,
            studentName: 'Jane Smith',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
        }
    ]);

    const login = (email, password, role) => {
        // Dummy validation
        if (role === 'student' && email === 'student@example.com' && password === 'student123') {
            setUser({ email, role: 'student', name: 'Student User' });
            return true;
        }
        if (role === 'xerox' && email === 'admin@xerox.com' && password === 'admin123') {
            setUser({ email, role: 'xerox', name: 'Xerox Admin' });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    const addOrder = (order) => {
        const newOrder = {
            ...order,
            id: orders.length + 1,
            status: 'Pending',
            timestamp: new Date().toISOString(),
            studentName: user?.name || 'Unknown Student',
        };
        setOrders([newOrder, ...orders]);
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setOrders(orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        ));
    };

    const deleteOrder = (orderId) => {
        setOrders(orders.filter(order => order.id !== orderId));
    };

    return (
        <AppContext.Provider value={{
            user,
            login,
            logout,
            orders,
            addOrder,
            updateOrderStatus,
            deleteOrder
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
