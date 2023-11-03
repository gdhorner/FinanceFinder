export interface Transaction {
    id: string
    accountId: string
    date: Date | null;
    name: string
    note: string
    category: string
    amount: number
    isDisabled: boolean
  }
  