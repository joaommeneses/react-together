import React, { createContext, useContext, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Assuming you are using Firestore (db) for role storage
import { doc, getDoc, setDoc } from 'firebase/firestore'; // For getting the user role from Firestore

interface User {
    uid: string;
    email: string;
    role: string; // Add role to the user object
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Check user authentication state when app loads or when the user is logged out
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (userCredential) => {
            if (userCredential) {
                const userDocRef = doc(db, 'users', userCredential.uid); // Assuming user data is in Firestore
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    setUser({
                        uid: userCredential.uid,
                        email: userCredential.email!,
                        role: userData.role || 'Student' // Default to 'Student' if role not found
                    });
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    // Firebase login method
    const login = async (email: string, password: string): Promise<void> => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                setUser({
                    uid: userCredential.user.uid,
                    email: userCredential.user.email!,
                    role: userData.role || 'Student' // Default to 'Student' if role not found
                });
            }
        } catch (error) {
            throw new Error('Login failed. Please check your credentials.');
        }
    };

    // Firebase register method
    const register = async (email: string, password: string): Promise<void> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(db, 'users', userCredential.user.uid);
            await setDoc(userDocRef, { role: 'Student' }); // Set default role to 'Student' on registration

            setUser({
                uid: userCredential.user.uid,
                email: userCredential.user.email!,
                role: 'Student' // Default to 'Student'
            });
        } catch (error) {
            throw new Error('Registration failed. Please try again.');
        }
    };

    // Firebase logout method
    const logout = async (): Promise<void> => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error('Error signing out:', error);
        }
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
