import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { useGoToPage } from "../../hooks/useGoToPage";
import styles from "./Home.module.css";

function Home() {
  const [userEmail, setUserEmail] = useOutletContext();
  const goToPage = useGoToPage();
  /* logs out user */
  const makeDeleteRequest = () => {
    const frontEndUrl = "http://localhost:5173";
    const backEndBaseUrl = "http://localhost:3000/";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": frontEndUrl,
      Vary: "Origin",
    };

    axios
      .delete(`${backEndBaseUrl}logout`, { headers: headers })
      .then((response) => {
        if (response.status === 204) {
          setUserEmail("");
          sessionStorage.removeItem("userEmail");
          goToPage("login");
        }
      });
  };

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
              <span>{userEmail}</span>
              <button
                className={styles["nav-button"] + " " + styles["logout"]}
                onClick={makeDeleteRequest}
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
