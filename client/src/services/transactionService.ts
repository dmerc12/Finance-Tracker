import api from './api';

export const getTransactions = () => {
    // TODO: implement get all transactions
    return api.get('/transactions');
};

export const getTransaction = (id: number) => {
    // TODO: implement get single transaction
    return api.get(`/transactions/${id}`);
};

export const createTransaction = (transactionData: any) => {
    // TODO: implement create transaction
    return api.post('/transactions/', transactionData);
};

export const updateTransaction = (id: number, transactionData: any) => {
    // TODO: implement update transaction
    return api.put(`/transactions/${id}`, transactionData);
};

export const deleteTransaction = (id: number) => {
    // TODO: implement delete transaction
    return api.delete(`/transactions/${id}`);
};
