import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../ui/card';

interface ChartWrapperProps {
    title: string;
    description?: string;
    children: ReactNode;
    height?: number | string;
    animationDelay?: number;
    actions?: ReactNode;
}

export default function ChartWrapper({
    title,
    description,
    children,
    height = 350,
    animationDelay = 0,
    actions,
}: ChartWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay, duration: 0.3 }}
        >
            <Card className="shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <h5 className="text-lg font-semibold mb-1">{title}</h5>
                            {description && <p className="text-sm text-slate-600">{description}</p>}
                        </div>
                        {actions && <div className="flex items-center gap-2">{actions}</div>}
                    </div>
                    <div style={{ height: typeof height === 'number' ? `${height}px` : height }}>
                        {children}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
