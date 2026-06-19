import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Input, Label } from '../ui';
import type { Account } from '../../types';
import { FormDialog } from '../common';
import { useState } from 'react';

interface TransferModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    accounts: Account[];
    onConfirm: (fromId: number, toId: number, amount: number, description: string) => void;
}

export default function TransferModal({
    open,
    onOpenChange,
    accounts,
    onConfirm,
}: TransferModalProps) {
    const [fromAccountId, setFromAccountId] = useState('');
    const [toAccountId, setToAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const activeAccounts = accounts.filter((acc) => !acc.archived);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!fromAccountId) {
            newErrors.fromAccountId = 'Please select a source account';
        }
        if (!toAccountId) {
            newErrors.toAccountId = 'Please select a destination account';
        }
        if (fromAccountId === toAccountId) {
            newErrors.toAccountId = 'Source and destination accounts must be different';
        }
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }
        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        onConfirm(parseInt(fromAccountId), parseInt(toAccountId), parseFloat(amount), description);
        handleClose();
    };

    const handleClose = () => {
        setFromAccountId('');
        setToAccountId('');
        setAmount('');
        setDescription('');
        setErrors({});
        onOpenChange(false);
    };

    return (
        <FormDialog
            open={open}
            onOpenChange={handleClose}
            title="Transfer Between Accounts"
            description="Move funds from one account to another."
            onSubmit={handleSubmit}
            submitLabel="Transfer Funds"
        >
            <div>
                <Label htmlFor="fromAccount">
                    From Account <span className="text-red-600">*</span>
                </Label>
                <Select value={fromAccountId} onValueChange={setFromAccountId}>
                    <SelectTrigger
                        id="fromAccount"
                        className={errors.fromAccountId ? 'border-red-500' : ''}
                    >
                        <SelectValue placeholder="Select source account" />
                    </SelectTrigger>
                    <SelectContent>
                        {activeAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                                {account.name} ({account.type}) - ${account.balance.toFixed(2)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.fromAccountId && (
                    <p className="text-sm text-red-600 mt-1">{errors.fromAccountId}</p>
                )}
            </div>
            <div>
                <Label htmlFor="toAccount">
                    To Account <span className="text-red-600">*</span>
                </Label>
                <Select value={toAccountId} onValueChange={setToAccountId}>
                    <SelectTrigger
                        id="toAccount"
                        className={errors.toAccountId ? 'border-red-500' : ''}
                    >
                        <SelectValue placeholder="Select destination account" />
                    </SelectTrigger>
                    <SelectContent>
                        {activeAccounts
                            .filter((acc) => acc.id.toString() !== fromAccountId)
                            .map((account) => (
                                <SelectItem key={account.id} value={account.id.toString()}>
                                    {account.name} ({account.type}) - ${account.balance.toFixed(2)}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
                {errors.toAccountId && (
                    <p className="text-sm text-red-600 mt-1">{errors.toAccountId}</p>
                )}
            </div>
            <div>
                <Label htmlFor="amount">
                    Amount <span className="text-red-600">*</span>
                </Label>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={errors.amount ? 'border-red-500' : ''}
                />
                {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount}</p>}
            </div>
            <div>
                <Label htmlFor="description">
                    Description <span className="text-red-600">*</span>
                </Label>
                <Input
                    id="description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., Monthly savings transfer"
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                    <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                )}
            </div>
        </FormDialog>
    );
}
