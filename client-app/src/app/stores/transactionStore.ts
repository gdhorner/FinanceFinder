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

  createTransaction = async (transaction: Transaction) => {
    this.loading = true;
    transaction.id = uuid();
    try {
      await agent.Transactions.create(transaction);
      runInAction(() => {
        this.transactionRegistry.set(transaction.id, transaction);
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
        this.loading = false;
        console.log(this.transactionRegistry);
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

  // This might need to be extracted somewhere else.
  importStatement = async (file: File) => {
    const fileContent = await file.text();
    let fileArray = fileContent.split("\n");

    for (let index in fileArray) {
      let lineArray = fileArray[index].split(",");
      if (lineArray[6] === "") {
        let transaction = {
          id: "",
          name: lineArray[3],
          date: lineArray[0],
          note: "",
          amount: +lineArray[5],
          isDisabled: true,
        };
        this.createTransaction(transaction);
      }
    }
  };
}
