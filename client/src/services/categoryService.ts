import api from './api';

export const getCategories = () => {
    // TODO: implement get categories
    return api.get(`/categories`);
};

export const getCategory = (id: number) => {
    // TODO: implement get single category
    return api.get(`/categories/${id}`);
};
