import { makeAutoObservable, runInAction } from "mobx";
import { Transaction } from "../models/transaction";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";

interface Category{
  key: string,
  text: string,
  value: string
}

export default class TransactionStore {
  transactionRegistry = new Map<string, Transaction>();
  editMode = false;
  loading = false;
  loadingInitial = true;
  transactionCategories : Category[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  loadTransactions = async () => {
    try {
      const transactions = await agent.Transactions.list();
      runInAction(() => {
        transactions.forEach((transaction) => {
          this.transactionRegistry.set(transaction.id, transaction);
          this.loadCategories()
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
  importStatement = async (file: File, accountId: string) => {
    const fileContent = await file.text();
    let fileArray = fileContent.split("\n");

    for (let index in fileArray) {
      let lineArray = fileArray[index].split(",");
      if (lineArray[6] === "") {
        let date: Date = new Date(lineArray[0].split("T")[0]);
        let transaction: Transaction = {
          id: "",
          accountId: accountId,
          date: date,
          name: lineArray[3],
          note: "",
          category: "",
          amount: +lineArray[5],
          isDisabled: true,
        };
        this.createTransaction(transaction);
      }
    }
  };

  loadCategories = () => {
    let category: Category;
    runInAction(() => {
      this.transactionRegistry.forEach((transaction) => {
        const found = this.transactionCategories.find(
          (category) => category.key === transaction.category
        );
        if(!found){
          category = {
            key: transaction.category,
            text: transaction.category,
            value: transaction.category,
          }
          this.transactionCategories.push(category);
        }
      });
    });
  };
}
