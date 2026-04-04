import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Transaction } from '../../data';
import { motion } from 'motion/react';
import { memo } from 'react';

const TransactionItem = memo(
    ({
        transaction,
        index,
        animationDelay,
    }: {
        transaction: Transaction;
        index: number;
        animationDelay: number;
    }) => {
        return (
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                    delay: animationDelay + 0.1 + index * 0.1,
                    duration: 0.3,
                }}
                className="border-b last:border-b-0 py-3 first:pt-0 last:pb-0"
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div
                            className={`rounded-full flex items-center justify-center w-10 h-10 ${
                                transaction.type === 'income'
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-red-50 text-red-600'
                            }`}
                        >
                            {transaction.type === 'income' ? (
                                <ArrowUpRight size={20} />
                            ) : (
                                <ArrowDownRight size={20} />
                            )}
                        </div>
                        <div>
                            <p className="mb-0 font-medium">{transaction.description}</p>
                            <small className="text-slate-600">{transaction.category}</small>
                        </div>
                    </div>
                    <div className="text-right">
                        <p
                            className={`mb-0 font-semibold ${
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            {transaction.type === 'income' ? '+' : ''}$
                            {Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <small className="text-slate-600">{transaction.date}</small>
                    </div>
                </div>
            </motion.div>
        );
    }
);

export default TransactionItem;
