import { Link } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import Form from "../Form/Form";
import FormChild from "../FormChild/FormChild";
import EmailInput from "../EmailInput/EmailInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import { useFocusEmailInput } from "../../hooks/useFocusEmailInput";
import { useEmailValidation } from "../../hooks/useEmailValidation";
import { usePasswordValidation } from "../../hooks/usePasswordValidation";
import styles from "./Login.module.css";

function Login() {
  const emailInputRef = useFocusEmailInput();
  const passwordInputRef = useRef(null);
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  // consider using a reducer to remove the next 3 state variables
  const [isInputModified, setIsInputModified] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [lastInputModified, setLastInputModified] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const validateEmailInput = useEmailValidation(emailInputRef, setErrorMessage);
  const checkPasswordInput = usePasswordValidation(setErrorMessage);

  const validateInput = useCallback(
    (inputFieldName) => {
      if (inputFieldName === "email") {
        validateEmailInput(emailInputRef.current.validity);
      } else {
        checkPasswordInput(passwordInputRef);
      }
    },
    [checkPasswordInput, emailInputRef, validateEmailInput]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLastInputModified(name);
    setIsFormSubmitted(false);
    if (!isInputModified) {
      setIsInputModified(true);
    }

    setformData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    validateInput(name);
  };

  const handleSubmit = (e) => {
    setIsInputModified(false);
    setIsFormSubmitted(true);
    e.preventDefault();
  };

  // it updates errorMessage accordingly
  useEffect(() => {
    if (isInputModified) {
      validateInput(lastInputModified);
    }
    }
  }, [
    errorMessage,
    isInputModified,
    lastInputModified,
    validateInput,
  ]);

  useEffect(() => {

  return (
    <div className={styles["form-container"]}>
      <Form>
        <div className={styles["form-child"]}>
          <h2>Log in</h2>
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
          <button className={styles["form-button"]} type="submit">
            Log in
          </button>
        </div>
        <div className={styles["form-child"]}>
          <span>{"Don't"} have an account? </span>
          <Link to="../register" className={styles["form-link"]}>
            Click here to create one
          </Link>
        </div>
      </Form>
    </div>
  );
}

export default Login;
