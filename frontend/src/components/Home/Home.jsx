import axios from "axios";
import { useGoToPage } from "../../hooks/useGoToPage";
import styles from "./Home.module.css";

function Home() {
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
          goToPage("login");
        }
      });
  };

  return (
    <>
      <header>
        <nav className={styles["navbar"]}>
          <strong>Just another messaging app</strong>
          <button
            className={styles["nav-button"] + " " + styles["login"]}
            onClick={() => goTo("login")}
          >
            log in
          </button>
          <button
            className={styles["nav-button"] + " " + styles["register"]}
            onClick={() => goTo("register")}
          >
            sign up
          </button>
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
