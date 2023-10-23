import { makeAutoObservable, runInAction } from "mobx";
import { Transaction } from "../models/transaction";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

export default class TransactionStore {
  transactionRegistry = new Map<string, Transaction>();
  editMode = false;
  loading = false;
  loadingInitial = true;

  constructor() {
    makeAutoObservable(this);
  }

  get transactionsByDate() {
    return Array.from(this.transactionRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  loadTransactions = async () => {
    try {
      const transactions = await agent.Transactions.list();
      runInAction(() => {
        transactions.forEach((transaction) => {
            transaction.date = transaction.date.split("T")[0];
          this.transactionRegistry.set(transaction.id, transaction);
        });
      });
      this.setLoadingInitial(false);
    } catch (error) {
      console.log(error);
      this.setLoadingInitial(false);
    }
  };

  setLoadingInitial = (state: boolean) => {
    this.loadingInitial = state;
  };
  
  setEditMode = (state: boolean) => {
    this.editMode = state;
  }


  createTransaction = async (transaction: Transaction) => {
    this.loading = true;
    transaction.id = uuid();
    try {
      await agent.Transactions.create(transaction);
      runInAction(() => {
        this.transactionRegistry.set(transaction.id, transaction);
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  updateTransaction = async (transaction: Transaction) => {
    this.loading = true;
    try {
      await agent.Transactions.update(transaction);
      runInAction(() => {
        this.transactionRegistry.set(transaction.id, transaction);
        this.editMode = false;
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  deleteTransaction = async (id: string) => {
    this.loading = true;
    try {
      await agent.Transactions.delete(id);
      runInAction(() => {
        this.transactionRegistry.delete(id);
        this.loading = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loading = false;
      });
    }
  };
}
