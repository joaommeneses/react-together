// SignOutButton.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const SignOutButton: React.FC = () => {
    const { logout } = useAuth();

    const handleSignOut = async () => {
        try {
            await logout();
            window.location.href = '/auth'; // Redirect to the auth page after logging out
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <button
            onClick={handleSignOut}
            className="absolute top-4 right-4 bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
        >
            Sign Out
        </button>
    );
};

export default SignOutButton;
