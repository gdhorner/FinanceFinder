import { Grid } from "semantic-ui-react";
import TransactionList from "./TransactionList";
import { observer } from "mobx-react-lite";


export default observer(function TransactionDashboard() {

  return (
    <Grid>
      <Grid.Column width="16">
        <TransactionList />
      </Grid.Column>
    </Grid>
  );
})
