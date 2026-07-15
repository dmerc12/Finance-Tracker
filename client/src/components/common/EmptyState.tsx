import { type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { memo } from 'react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    iconColor?: string;
    iconBgColor?: string;
    actions?: {
        label: string;
        onClick: () => void;
        variant?: 'default' | 'outline';
    }[];
}

const EmptyState = memo(function EmptyState({
    icon: Icon,
    title,
    description,
    iconColor = 'text-blue-600',
    iconBgColor = 'bg-blue-100',
    actions,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center min-h-100"
        >
            <div className="text-center max-w-md">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mb-4"
                >
                    <div
                        className={`${iconBgColor} ${iconColor} rounded-full inline-flex items-center justify-center 
                            w-20 h-20`}
                        aria-hidden="true"
                    >
                        <Icon size={40} />
                    </div>
                </motion.div>

                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl font-semibold mb-2"
                >
                    {title}
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-slate-600 mb-6"
                >
                    {description}
                </motion.p>

                {actions && actions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex gap-3 justify-center"
                    >
                        {actions.map((action, index) => (
                            <Button
                                key={index}
                                variant={action.variant || 'default'}
                                onClick={action.onClick}
                                aria-label={action.label}
                            >
                                {action.label}
                            </Button>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
});

export default EmptyState;
