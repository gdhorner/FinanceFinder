import { useEffect} from "react";
import { Container,} from "semantic-ui-react";
import NavBar from "./NavBar";
import TransactionDashboard from "../../features/transactions/dashboard/TransactionDashboard";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
  const { transactionStore } = useStore();

  useEffect(() => {
    transactionStore.loadTransactions();
  }, [transactionStore]);

  return (
    <>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <TransactionDashboard />
      </Container>
    </>
  );
}

export default observer(App);
