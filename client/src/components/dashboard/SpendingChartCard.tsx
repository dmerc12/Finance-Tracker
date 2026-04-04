import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { motion } from 'motion/react';
import { useCallback } from 'react';
import {
    PieChart,
    Pie,
    Sector,
    ResponsiveContainer,
    Legend,
    Tooltip,
    type PieSectorShapeProps,
} from 'recharts';

interface SpendingDataItem {
    name: string;
    value: number;
    color: string;
}

interface SpendingChartCardProps {
    data: SpendingDataItem[];
    animationDelay?: number;
}

export default function SpendingChartCard({ data, animationDelay = 0.5 }: SpendingChartCardProps) {
    const CustomSector = useCallback(
        (props: PieSectorShapeProps) => {
            const { index, ...rest } = props;
            const entry = data[index];
            return <Sector {...rest} fill={entry?.color ?? '#8884d8'} />;
        },
        [data]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay, duration: 0.5 }}
            className="lg:col-span-5"
        >
            <Card className="shadow-sm h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart id="dashboard-spending-pie">
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    dataKey="value"
                                    isAnimationActive={false}
                                    shape={CustomSector}
                                />
                                <Tooltip isAnimationActive={false} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
