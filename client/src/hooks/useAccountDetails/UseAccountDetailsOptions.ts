import type { Account, Transaction } from '../../data';

export default interface UseAccountDetailsOptions {
    account: Account | undefined;
    allTransactions: Transaction[];
    onAccountUpdate?: (account: Account) => void;
    onAccountDelete?: () => void;
}
