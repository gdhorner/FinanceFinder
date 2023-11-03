import { Container,} from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/transactions/home/HomePage";
import { useStore } from "../stores/store";
import { useEffect } from "react";

function App() {
  const location = useLocation();
  const {accountStore} = useStore();

  useEffect(() => {
    accountStore.loadAccounts();
  }, [accountStore]);

  return (
    <>
    <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </>
      )}
    </>
  );
}

export default observer(App);
