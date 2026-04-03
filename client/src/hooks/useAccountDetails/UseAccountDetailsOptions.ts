import type { Account, SimpleTransaction } from '../../data';

export default interface UseAccountDetailsOptions {
    account: Account | undefined;
    transactions: SimpleTransaction[];
    onAccountUpdate?: (account: Account) => void;
    onAccountDelete?: () => void;
}
