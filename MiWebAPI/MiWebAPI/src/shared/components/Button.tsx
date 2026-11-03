import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'dark';
    fullWidth?: boolean;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    fullWidth = false,
    children,
    className = '',
    style,
    ...props
}) => {
    const baseStyle: React.CSSProperties = {
        padding: '12px 24px',
        borderRadius: 'var(--radius-btn)',
        fontWeight: 600,
        fontSize: '0.95rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.2s ease-in-out',
        width: fullWidth ? '100%' : 'auto',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            backgroundColor: 'var(--brand-gold)',
            color: 'var(--text-dark)',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--text-primary)',
            border: '1px solid var(--brand-gold)',
        },
        dark: {
            backgroundColor: 'var(--bg-surface-dark)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
        },
    };

    return (
        <button
            style={{ ...baseStyle, ...variantStyles[variant], ...style }}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
};