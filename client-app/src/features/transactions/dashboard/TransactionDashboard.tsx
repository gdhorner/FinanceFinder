import { Grid } from "semantic-ui-react";
import TransactionList from "./TransactionList";


export default function TransactionDashboard() {

  return (
    <Grid>
      <Grid.Column width="16">
        <TransactionList />
      </Grid.Column>
    </Grid>
  );
}
