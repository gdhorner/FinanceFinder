import { Grid } from "semantic-ui-react";
import TransactionList from "./TransactionList";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import { useEffect } from "react";
import LoadingComponent from "../../../app/layout/LoadingComponent";

export default observer(function TransactionDashboard() {
  const { transactionStore } = useStore();

  useEffect(() => {
    transactionStore.loadTransactions();
  }, [transactionStore]);

  if (transactionStore.loadingInitial)
    return <LoadingComponent content="Loading app." />;
  return (
    <Grid>
      <Grid.Column width="16">
        <TransactionList />
      </Grid.Column>
    </Grid>
  );
});
