import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/transactions';

export const getAllTransactions = () => useActionState.get(API_BASE);
export const getTransactionById = (id) => axios.get(`${API_BASE}/${id}`);
export const createTransaction = (data) => axios.post(API_BASE, data);
export const updateTransaction = (id, data) => axios.put(`${API_BASE}/${id}`);
