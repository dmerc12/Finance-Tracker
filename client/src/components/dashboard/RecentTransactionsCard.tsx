import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import TransactionItem from './TransactionItem';
import type { Transaction } from '../../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

interface RecentTransactionsCardProps {
    transactions: Transaction[];
    animationDelay?: number;
}

export default function RecentTransactionsCard({
    transactions,
    animationDelay = 0.6,
}: RecentTransactionsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay, duration: 0.5 }}
            className="lg:col-span-7"
        >
            <Card className="shadow-sm h-full">
                <CardHeader>
                    <div className="flex justify-between items-center w-full">
                        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/transactions">View All</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col mb-4">
                        {transactions.map((transaction, index) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                index={index}
                                animationDelay={animationDelay}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
