import App from "./App";
import Home from "./components/Home/Home";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import UserAuthentication from "./components/UserAuthentication/UserAuthentication";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: ":name", element: <UserAuthentication /> },
    ],
    errorElement: <ErrorPage />,
  },
];

export default routes;
