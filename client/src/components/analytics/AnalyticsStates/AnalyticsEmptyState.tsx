import { BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../ui';

export default function AnalyticsEmptyState() {
    return (
        <div className="h-screen bg-gray-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mb-4"
                >
                    <div
                        className="bg-blue-100 text-blue-600 rounded-full inline-flex items-center justify-center
                            w-24 h-24"
                    >
                        <BarChart3 size={48} />
                    </div>
                </motion.div>
                <motion.h3
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-xl font-semibold mb-3"
                >
                    Not Enough Data
                </motion.h3>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-gray-500 mb-4"
                >
                    We need more transaction data to generate meaningful analytics and insights. Add
                    at least 10 transactions to see your financial trends and patterns.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex gap-3 justify-center"
                >
                    <Button asChild>
                        <a href="/transactions">Add Transactions</a>
                    </Button>
                    <Button variant="outline" asChild>
                        <a href="/dashboard">Go to Dashboard</a>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
