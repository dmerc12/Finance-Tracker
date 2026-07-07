import type { Account, Transaction } from '../../types';

export default interface UseAccountDetailsOptions {
    account: Account | undefined;
    allTransactions: Transaction[];
    onAccountUpdate?: (account: Account) => void;
    onAccountDelete?: () => void;
}
