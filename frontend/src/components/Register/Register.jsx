import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Form from "../Form/Form";
import EmailInput from "../EmailInput/EmailInput";
import { useFocusEmailInput } from "../../hooks/useFocusEmailInput";
import styles from "./Register.module.css";

function Register() {
  const emailInputRef = useFocusEmailInput();

  useEffect(() => {

  return (
    <div className={styles["form-container"]}>
      <Form>
        <div className={styles["form-child"]}>
          <h2>Create an account</h2>
        </div>
        <div className={styles["form-child"]}>
          <label htmlFor="email">Email *</label>
          <input type="email" name="email" id="email" ref={inputRef} />
        </div>
        <div className={styles["form-child"]}>
          <label htmlFor="password">Password *</label>
          <input type="password" name="password" id="password" />
        </div>
        <div className={styles["form-child"]}>
          <label htmlFor="repeat-password">Repeat password *</label>
          <input type="password" name="repeat-password" id="repeat-password" />
        </div>
        <div className={styles["form-child"]}>
          <button className={styles["form-button"]} type="submit">
            Continue
          </button>
        </div>
        <div className={styles["form-child"]}>
          <span>Already have an account? </span>
          <Link to="../login" className={styles["form-link"]}>
            Click here to log in
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Register;
