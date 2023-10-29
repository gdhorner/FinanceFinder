import { createContext, useContext } from "react";
import TransactionStore from "./transactionStore";
import CommonStore from "./commonStore";
import AccountStore from "./accountStore";

interface Store{
    transactionStore: TransactionStore
    commonStore: CommonStore
    accountStore: AccountStore
}

export const store: Store = {
    transactionStore: new TransactionStore(),
    commonStore: new CommonStore(),
    accountStore: new AccountStore()
}

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}