import React from 'react';

export const AuthContainer = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'linear-gradient(to bottom right, #EEF2FF, #FAF5FF, #FDF2F8)'
    }}>
        {children}
    </div>
);

export const AuthCard = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        maxWidth: '28rem',
        width: '100%',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
    }}>
        {children}
    </div>
);

export const IconContainer = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        width: '3rem',
        height: '3rem',
        backgroundColor: '#EEF2FF',
        borderRadius: '9999px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto'
    }}>
        {children}
    </div>
);

export const Title = ({ children }: { children: React.ReactNode }) => (
    <h2 style={{
        marginTop: '1.5rem',
        fontSize: '1.875rem',
        fontWeight: '800',
        color: '#111827',
        textAlign: 'center'
    }}>
        {children}
    </h2>
);

export const Text = ({ children }: { children: React.ReactNode }) => (
    <p style={{
        marginTop: '0.5rem',
        fontSize: '0.875rem',
        color: '#4B5563',
        textAlign: 'center'
    }}>
        {children}
    </p>
);

export const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary'
}: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: 'primary' | 'link';
}) => {
    const baseStyles = {
        fontWeight: '500',
        transition: 'all 0.2s',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
    };

    const styles = variant === 'primary' ? {
        ...baseStyles,
        width: '100%',
        padding: '0.5rem 1rem',
        backgroundColor: '#4F46E5',
        color: 'white',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        ':hover': {
            backgroundColor: '#4338CA'
        }
    } : {
        ...baseStyles,
        backgroundColor: 'transparent',
        color: '#4F46E5',
        padding: 0,
        fontSize: '0.875rem',
        ':hover': {
            color: '#4338CA'
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            style={styles}
        >
            {children}
        </button>
    );
};