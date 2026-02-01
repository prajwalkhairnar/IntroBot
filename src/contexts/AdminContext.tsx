import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
    isAuthenticated: boolean;
    serviceName: string;
    login: (serviceName: string) => void;
    logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [serviceName, setServiceName] = useState('');

    const login = (name: string) => {
        setIsAuthenticated(true);
        setServiceName(name);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setServiceName('');
    };

    return (
        <AdminContext.Provider value={{ isAuthenticated, serviceName, login, logout }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
}
