import { categoryExpenseData, categoryIncomeData } from '../../data';
import { Card, CardContent } from '../ui/card';
import { motion } from 'motion/react';
import { useCallback } from 'react';
import {
    AreaChart,
    Area,
    PieChart,
    Pie,
    Sector,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    type PieSectorShapeProps,
} from 'recharts';
import {
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    PieChart as PieChartIcon,
} from 'lucide-react';

interface OverviewDataItem {
    month: string;
    income: number;
    expenses: number;
}

interface OverviewViewProps {
    data: OverviewDataItem[];
    totals: {
        totalIncome: number;
        totalExpenses: number;
        totalSavings: number;
        savingsRate: number;
    };
}

export default function OverviewView({ data, totals }: OverviewViewProps) {
    const ExpensePieShape = useCallback((props: PieSectorShapeProps) => {
        const { index, ...rest } = props;
        const color = index !== undefined ? categoryExpenseData[index]?.color : '#8884d8';
        return <Sector {...rest} fill={color} />;
    }, []);

    const IncomePieShape = useCallback((props: PieSectorShapeProps) => {
        const { index, ...rest } = props;
        const color = index !== undefined ? categoryIncomeData[index]?.color : '#8884d8';
        return <Sector {...rest} fill={color} />;
    }, []);

    const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-0 shadow-sm h-full">
                        <CardContent className="pt-6 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h6 className="text-gray-500 text-sm mb-0">Total Income</h6>
                                <div className="bg-green-100 text-green-600 rounded p-2">
                                    <ArrowUpRight size={20} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">
                                {formatCurrency(totals.totalIncome)}
                            </h3>
                            <small className="text-green-600 flex items-center gap-1 text-xs">
                                <TrendingUp size={14} />
                                +12.5% vs last period
                            </small>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-0 shadow-sm h-full">
                        <CardContent className="pt-6 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h6 className="text-gray-500 text-sm mb-0">Total Expenses</h6>
                                <div className="bg-red-100 text-red-600 rounded p-2">
                                    <ArrowDownRight size={20} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">
                                {formatCurrency(totals.totalExpenses)}
                            </h3>
                            <small className="text-red-600 flex items-center gap-1 text-xs">
                                <TrendingUp size={14} />
                                +5.3% vs last period
                            </small>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="border-0 shadow-sm h-full">
                        <CardContent className="pt-6 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h6 className="text-gray-500 text-sm mb-0">Net Savings</h6>
                                <div className="bg-blue-100 text-blue-600 rounded p-2">
                                    <DollarSign size={20} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">
                                {formatCurrency(totals.totalSavings)}
                            </h3>
                            <small className="text-green-600 flex items-center gap-1 text-xs">
                                <TrendingUp size={14} />
                                +24.1% vs last period
                            </small>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Card className="border-0 shadow-sm h-full">
                        <CardContent className="pt-6 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h6 className="text-gray-500 text-sm mb-0">Savings Rate</h6>
                                <div className="bg-cyan-100 text-cyan-600 rounded p-2">
                                    <PieChartIcon size={20} />
                                </div>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{totals.savingsRate}</h3>
                            <small className="text-green-600 flex items-center gap-1 text-xs">
                                <TrendingUp size={14} />
                                +3.2% vs last period
                            </small>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
            {/* Income vs Expense Trend */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <Card className="border-0 shadow-sm mb-4">
                    <CardContent className="pt-6">
                        <h5 className="text-lg font-semibold mb-4">Income vs Expenses Over Time</h5>
                        <div style={{ height: '350px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data} id="overview-income-expenses-area">
                                    <defs>
                                        <linearGradient
                                            id="overviewColorIncome"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#10b981"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#10b981"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                        <linearGradient
                                            id="overviewColorExpenses"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="#ef4444"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="#ef4444"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip isAnimationActive={false} />
                                    <Legend />
                                    <Area
                                        key="area-income"
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#10b981"
                                        fillOpacity={1}
                                        fill="url(#overviewColorIncome)"
                                        name="Income"
                                        isAnimationActive={false}
                                    />
                                    <Area
                                        key="area-expenses"
                                        type="monotone"
                                        dataKey="expenses"
                                        stroke="#ef4444"
                                        fillOpacity={1}
                                        fill="url(#overviewColorExpenses)"
                                        name="Expenses"
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            {/* Category Breakdown Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="border-0 shadow-sm h-full">
                        <CardContent className="pt-6">
                            <h5 className="text-lg font-semibold mb-4">Expense Breakdown</h5>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart id="overview-expense-breakdown-pie">
                                        <Pie
                                            data={categoryExpenseData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => {
                                                const percentage =
                                                    percent !== undefined
                                                        ? (percent * 100).toFixed(0)
                                                        : '0';
                                                return `${name} ${percentage}%`;
                                            }}
                                            outerRadius={90}
                                            dataKey="value"
                                            isAnimationActive={false}
                                            shape={ExpensePieShape}
                                        />
                                        <Tooltip isAnimationActive={false} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Card className="border-0 shadow-sm h-full">
                        <CardContent className="pt-6">
                            <h5 className="text-lg font-semibold mb-4">Income Sources</h5>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart id="overview-income-sources-pie">
                                        <Pie
                                            data={categoryIncomeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => {
                                                const percentage =
                                                    percent !== undefined
                                                        ? (percent * 100).toFixed(0)
                                                        : '0';
                                                return `${name} ${percentage}%`;
                                            }}
                                            outerRadius={90}
                                            dataKey="value"
                                            isAnimationActive={false}
                                            shape={IncomePieShape}
                                        />
                                        <Tooltip isAnimationActive={false} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
