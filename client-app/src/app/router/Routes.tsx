import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import TransactionDashboard from "../../features/transactions/dashboard/TransactionDashboard";

export const routes: RouteObject[] = [
    {
      path: "/",
      element: <App />,
      children: [
        { path: "transactions", element: <TransactionDashboard/> },
          { path: "errors", element: <TestErrors /> },
          { path: "not-found", element: <NotFound /> },
          { path: "server-error", element: <ServerError /> },
          { path: "*", element: <Navigate replace to='/not-found' /> },
      ],
    },
  ];
  
  export const router = createBrowserRouter(routes);