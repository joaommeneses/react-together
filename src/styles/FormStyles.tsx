import React from 'react';

export const FormContainer = ({ children, onSubmit }: {
    children: React.ReactNode;
    onSubmit: (e: React.FormEvent) => void;
}) => (
    <form onSubmit={onSubmit} style={{
        marginTop: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    }}>
        {children}
    </form>
);

export const SelectWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        marginBottom: '1rem',
        position: 'relative'
    }}>
        {children}
    </div>
);

export const InputGroup = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    }}>
        {children}
    </div>
);

export const InputWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        position: 'relative',
        width: '100%'
    }}>
        {children}
    </div>
);

export const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: '0.75rem',
        pointerEvents: 'none',
        color: '#9CA3AF'
    }}>
        {children}
    </div>
);

export const Input = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => (
    <input
        {...props}
        ref={ref}
        style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            paddingLeft: '2.5rem',
            borderRadius: '0.375rem',
            border: '1px solid #D1D5DB',
            fontSize: '0.875rem',
            outline: 'none',
            transition: 'all 0.2s'
        }}
    />
));

export const ErrorText = ({ children }: { children: React.ReactNode }) => (
    <p style={{
        fontSize: '0.75rem',
        color: '#EF4444',
        marginTop: '0.25rem'
    }}>
        {children}
    </p>
);