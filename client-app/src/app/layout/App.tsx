import { Container, Segment,} from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import { Outlet, useLocation } from "react-router-dom";
import HomePage from "../../features/transactions/home/HomePage";

function App() {
  const location = useLocation();

  return (
    <>
    <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      {location.pathname === "/" ? (
        <HomePage />
      ) : (
        <>
          <NavBar />
          <Segment className="appLayout" basic>
            <Outlet />
          </Segment>
        </>
      )}
    </>
  );
}

export default observer(App);
