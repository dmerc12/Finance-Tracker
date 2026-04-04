import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import AccountSummaryCard from './AccountSummaryCard';
import type { Account } from '../../data';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../ui/button';

interface AccountSummarySectionProps {
    accounts: Account[];
    animationDelay?: number;
}

export default function AccountSummarySection({
    accounts,
    animationDelay = 0.5,
}: AccountSummarySectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay, duration: 0.5 }}
            className="mb-4"
        >
            <Card className="shadow-sm">
                <CardHeader>
                    <div className="flex justify-between items-center w-full">
                        <CardTitle className="text-lg font-semibold">Account Summary</CardTitle>
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/accounts">Manage Accounts</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        {accounts.map((account, index) => (
                            <AccountSummaryCard
                                key={account.id}
                                accountName={account.name}
                                accountType={account.type}
                                balance={account.balance}
                                institution={account.institution}
                                accountNumber={account.accountNumber}
                                lastUpdated={account.lastUpdated}
                                animationDelay={animationDelay + 0.1 + index * 0.1}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
