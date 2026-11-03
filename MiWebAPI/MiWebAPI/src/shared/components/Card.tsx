import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'dark' | 'gold';
    className?: string;
    style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
    children,
    variant = 'dark',
    className = '',
    style,
}) => {
    const baseStyle: React.CSSProperties = {
        borderRadius: 'var(--radius-card)',
        padding: '20px',
        border: '1px solid var(--border-color)',
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        dark: {
            backgroundColor: 'var(--bg-surface-dark)',
            color: 'var(--text-primary)',
        },
        gold: {
            backgroundColor: 'var(--bg-surface-gold)',
            color: 'var(--text-dark)',
            borderColor: 'transparent',
        },
    };

    return (
        <div style={{ ...baseStyle, ...variantStyles[variant], ...style }} className={className}>
            {children}
        </div>
    );
};