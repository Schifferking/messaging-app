import { Link } from "react-router-dom";
import styles from "./ErrorPage.module.css";

function ErrorPage() {
  return (
    <div className={styles["page-container"]}>
      <h1>Error 404</h1>
      <div id={styles["page-content"]}>
        <p>This page does not exists.</p>
        <Link to="/">Click here to go home</Link>
      </div>
    </div>
  );
}

export default ErrorPage;
