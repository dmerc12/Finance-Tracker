import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useState } from 'react';

export interface AccountFormData {
    name: string;
    type: 'Checking' | 'Savings' | 'Credit' | 'Investment';
    balance: number;
    institution: string;
    accountNumber: string;
}

interface AccountFormProps {
    initialData?: Partial<AccountFormData>;
    onChange: (data: AccountFormData) => void;
    errors?: Record<string, string>;
}

export default function AccountForm({ initialData, onChange, errors = {} }: AccountFormProps) {
    const [formData, setFormData] = useState<AccountFormData>({
        name: initialData?.name || '',
        type: initialData?.type || 'Checking',
        balance: initialData?.balance || 0,
        institution: initialData?.institution || '',
        accountNumber: initialData?.accountNumber || '',
    });

    const handleChange = (field: keyof AccountFormData, value: string | number) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        onChange(newData);
    };

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="accountName">
                    Account Name <span className="text-red-600">*</span>
                </Label>
                <Input
                    id="accountName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g., Main Checking"
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
                <Label htmlFor="accountType">
                    Account Type <span className="text-red-600">*</span>
                </Label>
                <Select
                    value={formData.type}
                    onValueChange={(value) =>
                        handleChange('type', value as AccountFormData['type'])
                    }
                >
                    <SelectTrigger id="accountType">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Checking">Checking</SelectItem>
                        <SelectItem value="Savings">Savings</SelectItem>
                        <SelectItem value="Credit">Credit Card</SelectItem>
                        <SelectItem value="Investment">Investment</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label htmlFor="balance">
                    Initial Balance <span className="text-red-600">*</span>
                </Label>
                <Input
                    id="balance"
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => {
                        const value = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        handleChange('balance', value);
                    }}
                    placeholder="0.00"
                    className={errors.balance ? 'border-red-500' : ''}
                />
                {errors.balance && <p className="text-sm text-red-600 mt-1">{errors.balance}</p>}
            </div>
            <div>
                <Label htmlFor="institution">Institution (Optional)</Label>
                <Input
                    id="institution"
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleChange('institution', e.target.value)}
                    placeholder="e.g., Chase Bank"
                />
            </div>
            <div>
                <Label htmlFor="accountNumber">Account Number (Optional)</Label>
                <Input
                    id="accountNumber"
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange('accountNumber', e.target.value)}
                    placeholder="e.g., ****1234"
                />
            </div>
        </div>
    );
}
