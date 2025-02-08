import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useGoToPage } from "../../hooks/useGoToPage";
import { useUserAuthentication } from "../../hooks/useUserAuthentication";
import axios_api_instance from "../../axios_api_instance";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const goToPage = useGoToPage();
  const stateVariables = useOutletContext();
  const [errorMessage, setErrorMessage] = stateVariables.errorMessage;
  const [userEmail, setUserEmail] = stateVariables.userEmail;
  const [userToken, setUserToken] = stateVariables.userToken;
  const [usersEmails, setUsersEmails] = useState([]);
  const userAuthentication = useUserAuthentication(
    setErrorMessage,
    setUserEmail,
    setUserToken
  );

  // redirect anonymous user to home page
  useEffect(() => {
    if (!userToken) {
      goToPage("/login", true);
    }
  }, [userToken, goToPage]);

  useEffect(() => {
    axios_api_instance.get("users").then((response) => {
      if (response.status === 200) {
        // filter current user email and generate id for rendering
        const unfilteredUsersEmails = response.data.data.users;
        const filteredUsersEmails = unfilteredUsersEmails
          .filter((email) => email !== userEmail)
          .map((email) => {
            return { userEmail: email, id: crypto.randomUUID() };
          });

        setUsersEmails(filteredUsersEmails);
      }
    });
  }, [userEmail]);

  return (
    <div className={styles["dashboard-container"]}>
      <header className={styles["header"]}>
        <nav className={styles["navbar"]}>
          <strong>Just another messaging app</strong>
          <div className={styles["user-dropdown"]}>
            <span>{userEmail}</span>
            <button
              className={styles["nav-button"]}
              onClick={userAuthentication.makeLogOutRequest}
            >
              log out
            </button>
          </div>
        </nav>
      </header>
      <nav className={styles["vertical-navbar"]}>
        <h1 className={styles["users-header"]}>Users</h1>
        <ul className={styles["users-list"]}>
          {usersEmails.map((userEmail) => (
            <li key={userEmail.id}>{userEmail.userEmail}</li>
          ))}
        </ul>
      </nav>
      <main className={styles["main"]}>
        <div className={styles["content-container"]}>
          When a chat is opened, messages should be rendered here
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
