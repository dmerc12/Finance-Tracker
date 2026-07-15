import { monthlyComparisonData, yearlyComparisonData } from '../../data';
import { Card, CardContent } from '../ui/card';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface ComparisonViewProps {
    reportType: 'monthly' | 'yearly';
    setReportType: (type: 'monthly' | 'yearly') => void;
}

export default function ComparisonView({ reportType, setReportType }: ComparisonViewProps) {
    const data = reportType === 'monthly' ? monthlyComparisonData : yearlyComparisonData;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Report Type Selector */}
            <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-semibold mb-0">Period Comparison</h5>
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <Button
                        size="sm"
                        variant={reportType === 'monthly' ? 'default' : 'outline'}
                        onClick={() => setReportType('monthly')}
                        className="rounded-r-none"
                    >
                        Monthly
                    </Button>
                    <Button
                        size="sm"
                        variant={reportType === 'yearly' ? 'default' : 'outline'}
                        onClick={() => setReportType('yearly')}
                        className="rounded-l-none border-l-0"
                    >
                        Yearly
                    </Button>
                </div>
            </div>
            {/* Comparison Chart */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-0 shadow-sm mb-4">
                    <CardContent className="pt-6">
                        <h5 className="text-lg font-semibold mb-4">
                            {reportType === 'monthly'
                                ? 'Last Month vs This Month'
                                : 'Year 2025 vs Year 2026'}
                        </h5>
                        {reportType === 'monthly' ? (
                            <div key="monthly-chart" style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={monthlyComparisonData}
                                        id="reports-monthly-comparison-bar"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip isAnimationActive={false} />
                                        <Legend />
                                        <Bar
                                            dataKey="lastMonth"
                                            fill="#94a3b8"
                                            name="Last Month"
                                            radius={[8, 8, 0, 0]}
                                            isAnimationActive={false}
                                        />
                                        <Bar
                                            dataKey="thisMonth"
                                            fill="#3b82f6"
                                            name="This Month"
                                            radius={[8, 8, 0, 0]}
                                            isAnimationActive={false}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div key="yearly-chart" style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={yearlyComparisonData}
                                        id="reports-yearly-comparison-bar"
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip isAnimationActive={false} />
                                        <Legend />
                                        <Bar
                                            dataKey="year2025"
                                            fill="#94a3b8"
                                            name="2025"
                                            radius={[8, 8, 0, 0]}
                                            isAnimationActive={false}
                                        />
                                        <Bar
                                            dataKey="year2026"
                                            fill="#3b82f6"
                                            name="2026 (YTD)"
                                            radius={[8, 8, 0, 0]}
                                            isAnimationActive={false}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
            {/* Comparison Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Card className="border-0 shadow-sm">
                    <CardContent className="pt-6">
                        <h5 className="text-lg font-semibold mb-4">Detailed Comparison</h5>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Category</th>
                                        <th className="text-right py-3 px-4">
                                            {reportType === 'monthly' ? 'Last Month' : '2025'}
                                        </th>
                                        <th className="text-right py-3 px-4">
                                            {reportType === 'monthly' ? 'This Month' : '2026 (YTD)'}
                                        </th>
                                        <th className="text-right py-3 px-4">Change</th>
                                        <th className="text-right py-3 px-4">% Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row, index) => {
                                        const prev =
                                            reportType === 'monthly'
                                                ? (row.lastMonth ?? 0)
                                                : (row.year2025 ?? 0);
                                        const curr =
                                            reportType === 'monthly'
                                                ? (row.thisMonth ?? 0)
                                                : (row.year2026 ?? 0);
                                        const change = curr - prev;
                                        const percentChange =
                                            prev !== 0
                                                ? ((change / prev) * 100).toFixed(1)
                                                : change === 0
                                                  ? '0.0'
                                                  : change > 0
                                                    ? '+∞'
                                                    : '-∞';
                                        const isIncrease = change > 0;
                                        return (
                                            <motion.tr
                                                key={row.category}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + index * 0.05 }}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">{row.category}</td>
                                                <td className="text-right py-3 px-4">
                                                    ${prev.toLocaleString()}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    ${curr.toLocaleString()}
                                                </td>
                                                <td
                                                    className={`text-right py-3 px-4 ${
                                                        isIncrease
                                                            ? 'text-red-600'
                                                            : 'text-green-600'
                                                    }`}
                                                >
                                                    {isIncrease ? '+' : ''}$
                                                    {change.toLocaleString()}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    <Badge
                                                        className={
                                                            isIncrease
                                                                ? 'bg-red-600 text-white'
                                                                : 'bg-green-600 text-white'
                                                        }
                                                    >
                                                        {isIncrease ? '+' : ''}
                                                        {percentChange}%
                                                    </Badge>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
