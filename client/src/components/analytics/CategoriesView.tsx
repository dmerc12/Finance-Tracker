import { categoryExpenseData, categoryIncomeData } from '../../data';
import { Card, CardContent } from '../ui/card';
import { motion } from 'motion/react';
import { useCallback } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    type BarShapeProps,
    Rectangle,
} from 'recharts';

export default function CategoriesView() {
    const ExpenseBarShape = useCallback((props: BarShapeProps) => {
        const { index, ...rest } = props;
        const color = index !== undefined ? categoryExpenseData[index]?.color : '#8884d8';
        return <Rectangle {...rest} fill={color} radius={[0, 8, 8, 0]} />;
    }, []);

    const IncomeBarShape = useCallback((props: BarShapeProps) => {
        const { ...rest } = props;
        return <Rectangle {...rest} fill="#10b981" radius={[0, 8, 8, 0]} />;
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <div className="space-y-4">
                {/* Expense and Income Categories Bar Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6">
                                <h5 className="text-lg font-semibold mb-4">Expense Categories</h5>
                                <div style={{ height: '350px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={categoryExpenseData}
                                            layout="vertical"
                                            id="categories-expense-bar"
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={120} />
                                            <Tooltip isAnimationActive={false} />
                                            <Bar
                                                dataKey="value"
                                                name="Amount"
                                                isAnimationActive={false}
                                                shape={ExpenseBarShape}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-0 shadow-sm">
                            <CardContent className="pt-6">
                                <h5 className="text-lg font-semibold mb-4">Income Sources</h5>
                                <div style={{ height: '350px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={categoryIncomeData}
                                            layout="vertical"
                                            id="categories-income-bar"
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={100} />
                                            <Tooltip isAnimationActive={false} />
                                            <Bar
                                                dataKey="value"
                                                name="Amount"
                                                isAnimationActive={false}
                                                shape={IncomeBarShape}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
                {/* Expense Category Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-0 shadow-sm">
                        <CardContent className="pt-6">
                            <h5 className="text-lg font-semibold mb-4">Category Details</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {categoryExpenseData.map((category, index) => {
                                    const total = categoryExpenseData.reduce(
                                        (sum, c) => sum + c.value,
                                        0
                                    );
                                    const percentage = ((category.value / total) * 100).toFixed(1);
                                    return (
                                        <motion.div
                                            key={category.name}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.4 + index * 0.05 }}
                                            className="border rounded-lg p-3"
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <h6 className="text-sm font-medium mb-0">
                                                    {category.name}
                                                </h6>
                                                <div
                                                    className="rounded-full w-3 h-3"
                                                    style={{ backgroundColor: category.color }}
                                                ></div>
                                            </div>
                                            <h4 className="text-xl font-bold mb-2">
                                                ${category.value.toLocaleString()}
                                            </h4>
                                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                                                <div
                                                    className="h-1.5 rounded-full"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: category.color,
                                                    }}
                                                ></div>
                                            </div>
                                            <small className="text-gray-500 text-xs">
                                                {percentage}% of total expenses
                                            </small>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
