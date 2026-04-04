import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { motion } from 'motion/react';
import { memo } from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    iconColor?: string;
    valueColor?: string;
    trend?: {
        value: string;
        isPositive: boolean;
        label?: string;
    };
    description?: string;
    animationDelay?: number;
}

const StatCard = memo(function StatCard({
    label,
    value,
    icon: Icon,
    iconColor = 'text-blue-600',
    valueColor,
    trend,
    description,
    animationDelay = 0,
}: StatCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: animationDelay, duration: 0.3 }}
        >
            <Card className="shadow-sm h-full">
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-3">
                        <h6 className="text-sm text-slate-600 mb-0">{label}</h6>
                        {Icon && (
                            <div
                                className={`${iconColor
                                    .replace('text-', 'bg-')
                                    .replace('600', '100')} ${iconColor} rounded-full p-2`}
                                aria-hidden="true"
                            >
                                <Icon size={20} />
                            </div>
                        )}
                    </div>

                    <h3 className={`text-2xl font-bold mb-2 ${valueColor || ''}`}>{value}</h3>

                    {trend && (
                        <div className="flex items-center gap-1">
                            {trend.isPositive ? (
                                <TrendingUp
                                    size={14}
                                    className="text-green-600"
                                    aria-hidden="true"
                                />
                            ) : (
                                <TrendingDown
                                    size={14}
                                    className="text-red-600"
                                    aria-hidden="true"
                                />
                            )}
                            <small
                                className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}
                            >
                                {trend.value} {trend.label || 'vs last period'}
                            </small>
                        </div>
                    )}

                    {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
                </CardContent>
            </Card>
        </motion.div>
    );
});

export default StatCard;
