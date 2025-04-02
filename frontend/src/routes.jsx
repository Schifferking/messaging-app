import App from "./App";
import Home from "./components/Home/Home";
import ErrorPage from "./components/ErrorPage/ErrorPage";
import UserAuthentication from "./components/UserAuthentication/UserAuthentication";
import Dashboard from "./components/Dashboard/Dashboard";
import UserProfile from "./components/UserProfile/UserProfile";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: ":name", element: <UserAuthentication /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "user/:id", element: <UserProfile /> },
    ],
    errorElement: <ErrorPage />,
  },
];

export default routes;
