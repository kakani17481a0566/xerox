import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // Initialize state from localStorage if available
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('xerox_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [orders, setOrders] = useState(() => {
        const savedOrders = localStorage.getItem('xerox_orders');
        return savedOrders ? JSON.parse(savedOrders) : [
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
        ];
    });

    // Save to localStorage whenever user or orders change
    useEffect(() => {
        if (user) {
            localStorage.setItem('xerox_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('xerox_user');
        }
    }, [user]);

    useEffect(() => {
        localStorage.setItem('xerox_orders', JSON.stringify(orders));
    }, [orders]);

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
        localStorage.removeItem('xerox_user');
    };

    const addOrder = (order) => {
        const newOrder = {
            ...order,
            id: Date.now(), // Use timestamp for unique ID instead of length + 1
            status: 'Pending',
            timestamp: new Date().toISOString(),
            studentName: user?.name || 'Unknown Student',
        };
        const updatedOrders = [newOrder, ...orders];
        setOrders(updatedOrders);
    };

    const updateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
    };

    const deleteOrder = (orderId) => {
        const updatedOrders = orders.filter(order => order.id !== orderId);
        setOrders(updatedOrders);
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
