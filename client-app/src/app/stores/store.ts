import { createContext, useContext } from "react";
import TransactionStore from "./transactionStore";
import CommonStore from "./commonStore";

interface Store{
    transactionStore: TransactionStore
    commonStore: CommonStore
}

export const store: Store = {
    transactionStore: new TransactionStore(),
    commonStore: new CommonStore()
}

export const StoreContext = createContext(store);

export function useStore(){
    return useContext(StoreContext);
}