import React, { createContext, useContext, useState } from 'react';

interface User {
    username: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => void;
    register: (username: string, password: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<{ username: string; password: string }[]>([]);

    const login = (username: string, password: string) => {
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            setUser({ username: user.username });
            alert('Successfully logged in!');
        } else {
            alert('Invalid credentials');
        }
    };

    const register = (username: string, password: string) => {
        if (users.some(u => u.username === username)) {
            alert('Username already exists');
            return;
        }

        setUsers(prev => [...prev, { username, password }]);
        setUser({ username });
        alert('Successfully registered!');
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};