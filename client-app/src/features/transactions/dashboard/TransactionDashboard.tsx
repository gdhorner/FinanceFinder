import { Button, Grid, GridRow, Header, Icon } from "semantic-ui-react";
import TransactionList from "./TransactionList";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useNavigate, useParams } from "react-router-dom";
import { Transaction } from "../../../app/models/transaction";

export default observer(function TransactionDashboard() {
  const { transactionStore, accountStore } = useStore();
  const { accountId } = useParams();

  const { transactionRegistry, deleteTransaction } = transactionStore;
  const { accountRegistry, setCurrentAccount, deleteAccount, currentAccount } =
    accountStore;

  const navigate = useNavigate();

  let transactionsArr: Transaction[];

  useEffect(() => {
    transactionStore.loadTransactions();
    if (accountId) {
      let account = accountRegistry.get(accountId);
      transactionsArr = Array.from(transactionRegistry.values()).filter(
        (t: Transaction) => t.accountId === accountId
      );
      if (account) {
        setCurrentAccount(account);
      }
    } else {
      transactionsArr = Array.from(transactionRegistry.values());
    }
    
  }, [transactionStore]);

  function handleClick(): void {
    transactionsArr && transactionsArr.forEach((transaction) => {
      deleteTransaction(transaction.id);
    });
    deleteAccount(currentAccount.id).then(() => {
      setCurrentAccount({ id: "", name: "", type: "", balance: 0 });
      navigate("/transactions/allaccounts");
    });
  }

  if (transactionStore.loadingInitial)
    return <LoadingComponent content="Loading app." />;

  return (
    <Grid width="16">
      {accountId && (
        <>
          <GridRow className='ml-10 justify-self-center'>
            <Header as="h2">{currentAccount.name}</Header>
            <Icon  className='pl-4 pt-1' name="x" link onClick={handleClick} />
          </GridRow>
          <GridRow className='ml-10'>
            <Header as="h3">{currentAccount.balance}</Header>
          </GridRow>
        </>
      )}
      <GridRow>
        <TransactionList transactions={transactionsArr!} accountId={accountId} />
      </GridRow>
    </Grid>
  );
});
