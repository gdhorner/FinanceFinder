import { createContext, useContext } from "react";
import TransactionStore from "./transactionStore";

interface Store{
    transactionStore: TransactionStore
}

export const store: Store = {
    transactionStore: new TransactionStore()
}

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}