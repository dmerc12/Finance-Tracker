import { motion } from 'motion/react';
import type { ReactNode } from 'react';

interface ActionBarProps {
    children: ReactNode;
    className?: string;
    animationDelay?: number;
}

export default function ActionBar({
    children,
    className = '',
    animationDelay = 0,
}: ActionBarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay, duration: 0.3 }}
            className={`bg-white rounded-lg border p-4 mb-4 flex items-center gap-3 flex-wrap ${className}`}
        >
            {children}
        </motion.div>
    );
}
