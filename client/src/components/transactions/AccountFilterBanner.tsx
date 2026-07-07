import { Filter } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { mockAccountsSimple } from '../../data';

interface AccountFilterBannerProps {
    filterAccount: number | 'All';
    onClearFilter: () => void;
}

export default function AccountFilterBanner({
    filterAccount,
    onClearFilter,
}: AccountFilterBannerProps) {
    if (filterAccount === 'All') return null;

    return (
        <Alert className="mb-4 bg-blue-50 border-blue-200">
            <Filter size={18} className="text-blue-600" />
            <AlertDescription className="flex items-center justify-between">
                <span className="text-blue-900">
                    Showing transactions for:{' '}
                    <strong>
                        {mockAccountsSimple.find((a) => a.id === filterAccount)?.name ||
                            'Unknown Account'}
                    </strong>
                </span>
                <Button
                    onClick={onClearFilter}
                    variant="outline"
                    size="sm"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                    Clear Filter
                </Button>
            </AlertDescription>
        </Alert>
    );
}
