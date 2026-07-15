import { motion } from 'motion/react';

interface LoadingStateProps {
    message?: string;
    description?: string;
}

export default function LoadingState({ message = 'Loading...', description }: LoadingStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-100"
        >
            <div className="text-center">
                <div
                    className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin
                        mx-auto mb-4"
                />
                <h5 className="text-slate-700 text-lg font-medium mb-1">{message}</h5>
                {description && <p className="text-slate-500 text-sm">{description}</p>}
            </div>
        </motion.div>
    );
}
