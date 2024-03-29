import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { v4 as uuid } from "uuid";
import { Account } from "../models/account";

export default class AccountStore {
  accountRegistry = new Map<string, Account>();
  currentAccount = {
    id: "",
    name: "",
    type: "",
    balance: 0
  };

  constructor() {
    makeAutoObservable(this);
  }

  get accountArr() {
    return Array.from(this.accountRegistry.values());
  }

  loadAccounts = async () => {
    try {
      const accounts = await agent.Accounts.list();
      runInAction(() => {
        accounts.forEach((account) => {
          this.accountRegistry.set(account.id, account);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  createAccount = async (account: Account) => {
    account.id = uuid();
    try {
      await agent.Accounts.create(account);
      runInAction(() => {
        this.accountRegistry.set(account.id, account);
      })
    } catch (error) {
      console.log(error);
    }
  };

  updateAccount = async (account: Account) => {
    try {
      await agent.Accounts.update(account);
      runInAction(() => {
        this.accountRegistry.set(account.id, account);
      })
    } catch (error) {
      console.log(error);
    }
  };

  deleteAccount = async (id: string) => {
    try {
      await agent.Accounts.delete(id);
      runInAction(() => {
        this.accountRegistry.delete(id);
      });
    } catch (error) {
      console.log(error);
    }
  };

  setCurrentAccount = (account: Account) => {
    runInAction(() => {
      this.currentAccount = account;
    });
  };
}
