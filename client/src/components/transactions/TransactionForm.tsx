import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft } from 'lucide-react';
import { getCategoriesForType } from '../../data';
import { type Account } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../ui';

export interface TransactionFormData {
    description: string;
    amount: number;
    type: 'income' | 'expense' | 'transfer';
    category: string;
    accountId: number;
    date: string;
    notes: string;
    toAccountId: number;
}

interface TransactionFormProps {
    formData: TransactionFormData;
    onChange: (data: TransactionFormData) => void;
    errors?: Record<string, string>;
    accounts: Account[];
    disableAccount?: boolean;
}

// Use centralized category function
const getCategories = getCategoriesForType;

export default function TransactionForm({
    formData,
    onChange,
    errors = {},
    accounts,
    disableAccount = false,
}: TransactionFormProps) {
    const updateFormData = (updates: Partial<TransactionFormData>) => {
        onChange({ ...formData, ...updates });
    };

    const activeAccounts = accounts.filter((account) => !account.archived);

    return (
        <div className="grid gap-4 py-4">
            {/* Transaction Type */}
            <div className="space-y-2">
                <Label>
                    Transaction Type <span className="text-red-600">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-2">
                    <Button
                        type="button"
                        variant={formData.type === 'expense' ? 'destructive' : 'outline'}
                        className="justify-center"
                        onClick={() => updateFormData({ type: 'expense', category: '' })}
                    >
                        <ArrowUpRight size={18} className="mr-2" />
                        Expense
                    </Button>
                    <Button
                        type="button"
                        variant={formData.type === 'income' ? 'default' : 'outline'}
                        className={cn(
                            formData.type === 'income' && 'bg-green-600 hover:bg-green-700'
                        )}
                        onClick={() => updateFormData({ type: 'income', category: '' })}
                    >
                        <ArrowDownRight size={18} className="mr-2" />
                        Income
                    </Button>
                    <Button
                        type="button"
                        variant={formData.type === 'transfer' ? 'default' : 'outline'}
                        className={cn(
                            formData.type === 'transfer' && 'bg-blue-600 hover:bg-blue-700'
                        )}
                        onClick={() => updateFormData({ type: 'transfer', category: 'Transfer' })}
                    >
                        <ArrowRightLeft size={18} className="mr-2" />
                        Transfer
                    </Button>
                </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label>
                    Description <span className="text-red-600">*</span>
                </Label>
                <Input
                    type="text"
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Amount <span className="text-red-600">*</span>
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-600">
                            $
                        </span>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={(e) => updateFormData({ amount: parseFloat(e.target.value) })}
                            className={cn('pl-7', errors.amount ? 'border-red-500' : '')}
                        />
                    </div>
                    {errors.amount && <p className="text-sm text-red-600">{errors.amount}</p>}
                </div>

                <div className="space-y-2">
                    <Label>
                        Date <span className="text-red-600">*</span>
                    </Label>
                    <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateFormData({ date: e.target.value })}
                        className={errors.date ? 'border-red-500' : ''}
                    />
                    {errors.date && <p className="text-sm text-red-600">{errors.date}</p>}
                </div>
            </div>

            {/* Category and Account */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Category <span className="text-red-600">*</span>
                    </Label>
                    <Select
                        value={formData.category}
                        onValueChange={(value) => updateFormData({ category: value })}
                        disabled={formData.type === 'transfer'}
                    >
                        <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {getCategories(formData.type).map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                    {cat}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                </div>

                <div className="space-y-2">
                    <Label>
                        {formData.type === 'transfer' ? 'From Account' : 'Account'}{' '}
                        <span className="text-red-600">*</span>
                    </Label>
                    <Select
                        value={formData.accountId.toString()}
                        onValueChange={(value) => updateFormData({ accountId: parseInt(value) })}
                        disabled={disableAccount}
                    >
                        <SelectTrigger className={errors.accountId ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            {activeAccounts.map((acc) => (
                                <SelectItem key={acc.id} value={acc.id.toString()}>
                                    {acc.name} - {acc.type} (${acc.balance.toFixed(2)})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.accountId && <p className="text-sm text-red-600">{errors.accountId}</p>}
                </div>
            </div>

            {/* To Account (for transfers) */}
            {formData.type === 'transfer' && (
                <div className="space-y-2">
                    <Label>
                        To Account <span className="text-red-600">*</span>
                    </Label>
                    <Select
                        value={formData.toAccountId.toString()}
                        onValueChange={(value) => updateFormData({ toAccountId: parseInt(value) })}
                    >
                        <SelectTrigger className={errors.toAccountId ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Select destination account" />
                        </SelectTrigger>
                        <SelectContent>
                            {activeAccounts
                                .filter((acc) => acc.id !== formData.accountId)
                                .map((acc) => (
                                    <SelectItem key={acc.id} value={acc.id.toString()}>
                                        {acc.name} - {acc.type} (${acc.balance.toFixed(2)})
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    {errors.toAccountId && (
                        <p className="text-sm text-red-600">{errors.toAccountId}</p>
                    )}
                </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <textarea
                    className="flex min-h-20 w-full rounded-md border border-input bg-input-background px-3 py-2
                    text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none
                    focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                    disabled:cursor-not-allowed disabled:opacity-50"
                    rows={3}
                    placeholder="Add any additional notes..."
                    value={formData.notes}
                    onChange={(e) => updateFormData({ notes: e.target.value })}
                />
            </div>
        </div>
    );
}
