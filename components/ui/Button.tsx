import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-(--color-primary) text-(--color-text-primary) hover:bg-(--color-primary-hover) shadow-md hover:shadow-lg hover:shadow-(--color-primary)/20',
      secondary: 'bg-(--color-surface-elevated) text-(--color-text-primary) hover:bg-(--color-border-light) border border-(--color-border)',
      outline: 'border-2 border-(--color-primary) text-(--color-primary) hover:bg-(--color-primary) hover:text-(--color-text-primary)',
      ghost: 'text-(--color-text-secondary) hover:text-(--color-text-primary) hover:bg-(--color-surface)',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
