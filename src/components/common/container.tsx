import { cn } from '@/src/lib/utils';
import { HTMLAttributes } from 'react';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
    return (
        <div className={cn('container max-w-7xl mx-auto px-1 md:px-4 py-8', className)} {...props}>
            {children}
        </div>
    );
} 