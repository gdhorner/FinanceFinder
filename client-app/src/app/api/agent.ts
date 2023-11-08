import axios, { AxiosError, AxiosResponse } from 'axios';
import { Transaction } from '../models/transaction';
import { toast } from 'react-toastify';
import { store } from '../stores/store';
import { router } from '../router/Routes';
import { Account } from '../models/account';


const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.response.use(async (response) => {
    await sleep(1000);
    return response;
  }, (error: AxiosError) => {
      const {data, status, config} = error.response as AxiosResponse;
      switch (status) {
          case 400:
            if (config.method === 'get' && Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
              router.navigate('/not-found')
            }
              if (data.errors) {
                  const modalStateErrors = [];
                  for (const key in data.errors) {
                      if(data.errors[key]) {
                          modalStateErrors.push(data.errors[key]);
                      }
                  }
                  throw modalStateErrors.flat();
              } else {
                  toast.error(data);
              }
              break;
          case 401:
              toast.error('unauthorized')
              break;
          case 403:
              toast.error('forbidden')
              break;
          case 404: 
              router.navigate('/not-found')
              break;
          case 500:
              store.commonStore.setServerError(data);
              router.navigate('/server-error')
              break;
      }
      return Promise.reject(error);
  });

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

const Accounts = {
    list: () => requests.get<Account[]>('/accounts'),
    details: (id: string) => requests.get<Account>(`/accounts/${id}`),
    create: (account: Account) => requests.post('/accounts', account),
    update: (account: Account) => requests.put(`/accounts/${account.id}`, account),
    delete: (id: string) => requests.del(`/accounts/${id}`)
}

const agent = {
    Transactions,
    Accounts
}

export default agent;