import axios, { AxiosResponse } from 'axios';
import { Transaction } from '../models/transaction';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        return await Promise.reject(error);
    }
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Transactions = {
    list: () => requests.get<Transaction[]>('/transactions'),
    details: (id: string) => requests.get<Transaction>(`/transactions/${id}`),
    create: (transaction: Transaction) => requests.post('/transactions', transaction),
    update: (transaction: Transaction) => requests.put(`/transactions/${transaction.id}`, transaction),
    delete: (id: string) => requests.del(`/transactions/${id}`)
}

const agent = {
    Transactions
}

export default agent;