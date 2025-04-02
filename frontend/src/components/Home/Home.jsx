import { Link, useOutletContext } from "react-router-dom";
import { useGoToPage } from "../../hooks/useGoToPage";
import { useUserAuthentication } from "../../hooks/useUserAuthentication";
import styles from "./Home.module.css";

function Home() {
  const stateVariables = useOutletContext();
  const [errorMessage, setErrorMessage] = stateVariables.errorMessage;
  const [userEmail, setUserEmail] = stateVariables.userEmail;
  const [userId, setUserId] = stateVariables.userId;
  const [userToken, setUserToken] = stateVariables.userToken;
  const userAuthentication = useUserAuthentication(
    setErrorMessage,
    setUserEmail,
    setUserId,
    setUserToken
  );

  const goToPage = useGoToPage();

  return (
    <>
      <header>
        <nav className={styles["navbar"]}>
          <strong>Just another messaging app</strong>
          {userEmail === null ? (
            <>
              <button
                className={styles["nav-button"] + " " + styles["login"]}
                onClick={() => goToPage("login")}
              >
                log in
              </button>
              <button
                className={styles["nav-button"] + " " + styles["register"]}
                onClick={() => goToPage("register")}
              >
                sign up
              </button>
            </>
          ) : (
            <div className={styles["user-container"]}>
              <Link to={`/user/${userId}`}>{userEmail}</Link>
              <Link to="/dashboard">Dashboard</Link>
              <button
                className={styles["nav-button"] + " " + styles["logout"]}
                onClick={() => userAuthentication.makeLogOutRequest()}
              >
                log out
              </button>
            </div>
          )}
        </nav>
      </header>
      <div className={styles["content"]}>
        <p>
          You can send text messages to other people, and receive them too.
          Also, you can customize your profile.
        </p>
      </div>
      <div className={styles["footer-container"]}>
        <footer className={styles["footer"]}>
          <div>© 2024 Schifferking</div>
          <div>Just another messaging app</div>
        </footer>
      </div>
    </>
  );
}

export default Home;
