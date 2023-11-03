import { Grid } from "semantic-ui-react";
import TransactionList from "./TransactionList";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useParams } from "react-router-dom";

export default observer(function TransactionDashboard() {
  const { transactionStore } = useStore();
  const { accountId } = useParams();
  
  useEffect(() => {
      transactionStore.loadTransactions();
  }, [transactionStore]);

  if (transactionStore.loadingInitial)
    return <LoadingComponent content="Loading app." />;
  return (
    <Grid>
      <TransactionList AccountId={accountId} />
    </Grid>
  );
});
