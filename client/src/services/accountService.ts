import api from './api';

export const getAccounts = () => {
    // TODO: implement get all accounts
    return api.get('/accounts');
};

export const getAccount = (id: number) => {
    // TODO: implement get single account
    return api.get(`/accounts/${id}`);
};

export const createAccount = (accountData: any) => {
    // TODO: implement create account
    return api.post('/accounts/', accountData);
};

export const updateAccount = (id: number, accountData: any) => {
    // TODO: implement update account
    return api.put(`/accounts/${id}`, accountData);
};

export const deleteAccount = (id: number) => {
    // TODO: implement delete account
    return api.delete(`/accounts/${id}`);
};
