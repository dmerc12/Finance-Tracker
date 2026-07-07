import type { MonthlyTrendData } from '../../types';
import { Card, CardContent } from '../ui/card';
import { monthlyTrendData } from '../../data';
import { motion } from 'motion/react';
import { Badge } from '../ui/badge';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface TrendsViewProps {
    data: MonthlyTrendData[];
}

export default function TrendsView({ data }: TrendsViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="space-y-4">
                {/* Spending Trends Line Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-0 shadow-sm">
                        <CardContent className="pt-6">
                            <h5 className="text-lg font-semibold mb-4">
                                Spending Trends Over Time
                            </h5>
                            <div style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data} id="trends-spending-line">
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip isAnimationActive={false} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="income"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            name="Income"
                                            dot={{ r: 5 }}
                                            isAnimationActive={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expenses"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            name="Expenses"
                                            dot={{ r: 5 }}
                                            isAnimationActive={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="savings"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            name="Savings"
                                            dot={{ r: 5 }}
                                            isAnimationActive={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                {/* Trend Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6 pb-2">
                                <h6 className="text-gray-500 text-sm mb-3">
                                    Average Monthly Income
                                </h6>
                                <h3 className="text-2xl font-bold mb-2">$4,800</h3>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-green-600 h-2 rounded-full"
                                        style={{ width: '75%' }}
                                    ></div>
                                </div>
                                <small className="text-gray-500 text-xs">
                                    75% of target ($6,400)
                                </small>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6 pb-2">
                                <h6 className="text-gray-500 text-sm mb-3">
                                    Average Monthly Expenses
                                </h6>
                                <h3 className="text-2xl font-bold mb-2">$3,338</h3>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-red-600 h-2 rounded-full"
                                        style={{ width: '67%' }}
                                    ></div>
                                </div>
                                <small className="text-gray-500 text-xs">
                                    67% of budget ($5,000)
                                </small>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6 pb-2">
                                <h6 className="text-gray-500 text-sm mb-3">
                                    Average Monthly Savings
                                </h6>
                                <h3 className="text-2xl font-bold mb-2">$1,463</h3>
                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: '97%' }}
                                    ></div>
                                </div>
                                <small className="text-gray-500 text-xs">
                                    97% of goal ($1,500)
                                </small>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                {/* Monthly Breakdown Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="border-0 shadow-sm">
                        <CardContent className="pt-6">
                            <h5 className="text-lg font-semibold mb-4">Monthly Breakdown</h5>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-3 px-4">Month</th>
                                            <th className="text-right py-3 px-4">Income</th>
                                            <th className="text-right py-3 px-4">Expenses</th>
                                            <th className="text-right py-3 px-4">Savings</th>
                                            <th className="text-right py-3 px-4">Savings Rate</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlyTrendData.map((row, index) => (
                                            <motion.tr
                                                key={row.month}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 + index * 0.05 }}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="py-3 px-4">{row.month}</td>
                                                <td className="text-right py-3 px-4 text-green-600">
                                                    ${row.income.toLocaleString()}
                                                </td>
                                                <td className="text-right py-3 px-4 text-red-600">
                                                    ${row.expenses.toLocaleString()}
                                                </td>
                                                <td className="text-right py-3 px-4 text-blue-600">
                                                    ${row.savings.toLocaleString()}
                                                </td>
                                                <td className="text-right py-3 px-4">
                                                    <Badge className="bg-green-600 text-white">
                                                        {((row.savings / row.income) * 100).toFixed(
                                                            1
                                                        )}
                                                        %
                                                    </Badge>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
