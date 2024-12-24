import { createContext, useCallback, useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Form from "../Form/Form";
import FormChild from "../FormChild/FormChild";
import EmailInput from "../EmailInput/EmailInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import { useFocusEmailInput } from "../../hooks/useFocusEmailInput";
import { useEmailValidation } from "../../hooks/useEmailValidation";
import { usePasswordValidation } from "../../hooks/usePasswordValidation";
import { useGoToPage } from "../../hooks/useGoToPage";
import { useUserAuthentication } from "../../hooks/useUserAuthentication";
import styles from "./Login.module.css";

export const LoginContext = createContext({ login: "" });

function Login() {
  const stateVariables = useOutletContext();
  const [errorMessage, setErrorMessage] = stateVariables.errorMessage;
  const [userEmail, setUserEmail] = stateVariables.userEmail;
  const goToPage = useGoToPage();
  const emailInputRef = useFocusEmailInput();
  const passwordInputRef = useRef(null);
  const [formData, setformData] = useState({
    email: "",
    password: "",
  });

  const userAuthentication = useUserAuthentication(
    setErrorMessage,
    setUserEmail,
    formData
  );

  // consider using a reducer to remove the next 3 state variables
  const [isInputModified, setIsInputModified] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [lastInputModified, setLastInputModified] = useState("");
  const validateEmailInput = useEmailValidation(emailInputRef, setErrorMessage);
  const { checkPasswordInput } = usePasswordValidation(setErrorMessage);

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

  const validateForm = useCallback(() => {
    userAuthentication.makeLoginRequest();
  }, [userAuthentication]);

  const handleSubmit = (e) => {
    setIsInputModified(false);
    setIsFormSubmitted(true);
    e.preventDefault();
    validateForm();
  };

  // it updates errorMessage accordingly
  useEffect(() => {
    if (isInputModified) {
      validateInput(lastInputModified);
    } else if (isFormSubmitted) {
      validateForm();
    }
  }, [
    errorMessage,
    isFormSubmitted,
    isInputModified,
    lastInputModified,
    validateForm,
    validateInput,
  ]);

  // redirect if user is logged in
  useEffect(() => {
    if (userEmail) {
      goToPage("/dashboard", true);
    }
  }, [userEmail, goToPage]);

  return (
    <div className={styles["login-form-container"]}>
      <LoginContext.Provider value={{ login: "login" }}>
        <Form handleSubmit={handleSubmit}>
          <FormChild>
            <h1>Log in</h1>
          </FormChild>
          <FormChild isInput={true}>
            <label htmlFor="email">Email *</label>
            <EmailInput
              name="email"
              onChange={handleChange}
              ref={emailInputRef}
              value={formData.email}
            />
          </FormChild>
          <FormChild isInput={true}>
            <label htmlFor="password">Password *</label>
            <PasswordInput
              name="password"
              onChange={handleChange}
              ref={passwordInputRef}
              value={formData.password}
            />
          </FormChild>
          <FormChild>
            <span className={styles["error-message"]}>{errorMessage}</span>
          </FormChild>
          <FormChild>
            <button className={styles["form-button"]} type="submit">
              Log in
            </button>
          </FormChild>
          <FormChild>
            <span>{"Don't"} have an account? </span>
            <Link to="../register" className={styles["form-link"]}>
              Click here to create one
            </Link>
          </FormChild>
        </Form>
      </LoginContext.Provider>
    </div>
  );
}

export default Login;
