import { Link } from "react-router-dom";
import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import zxcvbn from "zxcvbn";
import Form from "../Form/Form";
import FormChild from "../FormChild/FormChild";
import EmailInput from "../EmailInput/EmailInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import { useFocusEmailInput } from "../../hooks/useFocusEmailInput";
import { usePasswordValidation } from "../../hooks/usePasswordValidation";
import { useEmailValidation } from "../../hooks/useEmailValidation";
import styles from "./Register.module.css";

export const RegisterContext = createContext({ register: "" });

function Register() {
  const emailInputRef = useFocusEmailInput();
  const passwordInputRef = useRef(null);
  const passwordRepeatInputRef = useRef(null);
  const [formData, setformData] = useState({
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [arePasswordsUnequal, setArePasswordsUnequal] = useState(false);
  const [isPasswordScoreLow, setIsPasswordScoreLow] = useState(false);
  const [isPasswordRepeatScoreLow, setIsPasswordRepeatScoreLow] =
    useState(false);
  const checkPasswordInput = usePasswordValidation(setErrorMessage);
  const validateEmailInput = useEmailValidation(emailInputRef, setErrorMessage);

  const checkPasswordEquity = (passwordRef) => {
    if (formData.password === formData.passwordRepeat) {
      setArePasswordsUnequal(false);
      setErrorMessage("");
    } else {
      passwordRef.current.focus();
      setArePasswordsUnequal(true);
      setErrorMessage(
        "Passwords are not equal. Ensure that both are identical."
      );
    }
  };

  const getPasswordData = (passwordInputFieldName) => {
    let passwordData = null;
    if (passwordInputFieldName === "password") {
      passwordData = {
        passwordRef: passwordInputRef,
        setStateFunction: setIsPasswordScoreLow,
      };
    } else {
      passwordData = {
        passwordRef: passwordRepeatInputRef,
        setStateFunction: setIsPasswordRepeatScoreLow,
      };
    }

    return passwordData;
  };

  const checkPasswordScore = (password, setStateFunction) => {
    const passwordResult = zxcvbn(password);
    if (passwordResult.score <= 2) {
      setStateFunction(true);
      setErrorMessage(passwordResult.feedback.warning);
    } else {
      setStateFunction(false);
      setErrorMessage("");
    }
  };

  const validateRegisterPasswordInput = (passwordInputField) => {
    const { passwordRef, setStateFunction } =
      getPasswordData(passwordInputField);

    /* treating each unicode character as one, since some are composed of
       two code points and the "length" property counts code points instead
       of characters and some unicode characters have two code points */

    const passwordActualLength = [...passwordRef.current.value].length;
    checkPasswordInput(passwordRef, passwordActualLength);
    checkPasswordScore(passwordRef.current.value, setStateFunction);

    if (passwordRef.current.validity.valid && passwordActualLength >= 8) {
      checkPasswordEquity(passwordRef);
    }
  };

  const validateInput = (inputFieldName) => {
    if (inputFieldName === "email") {
      validateEmailInput(emailInputRef.current.validity);
    } else {
      validateRegisterPasswordInput(inputFieldName);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    validateInput(name);
  };

  const makePostRequest = () => {
    const frontEndUrl = "http://localhost:5173";
    const backEndBaseUrl = "http://localhost:3000/";
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": frontEndUrl,
      Vary: "Origin",
    };

    axios
      .post(
        `${backEndBaseUrl}/signup`,
        {
          formData,
        },
        { headers: headers }
      )
      .then((response) => {
        if (response.data.error) {
          return setErrorMessage(response.data.error.email[1]);
        }});
  };

  const validateForm = () => {
    const emailInputValidity = emailInputRef.current.validity;
    const actualPasswordLength = [...passwordInputRef.current.value].length;
    const actualPasswordRepeatLength = [...passwordRepeatInputRef.current.value]
      .length;
    const passwordResult = zxcvbn(passwordInputRef.current.value);
    const passwordRepeatResult = zxcvbn(passwordRepeatInputRef.current.value);

    if (!emailInputValidity.valid) {
      return validateEmailInput(emailInputValidity);
    }

    if (!passwordInputRef.current.validity.valid || actualPasswordLength < 8) {
      return checkPasswordInput(passwordInputRef, actualPasswordLength);
    }

    if (passwordResult.score <= 2) {
      return checkPasswordScore(formData.password, setIsPasswordScoreLow);
    }

    if (
      !passwordRepeatInputRef.current.validity.valid ||
      actualPasswordRepeatLength < 8
    ) {
      return checkPasswordInput(
        passwordRepeatInputRef,
        actualPasswordRepeatLength
      );
    }

    if (passwordRepeatResult.score <= 2) {
      return checkPasswordScore(
        formData.passwordRepeat,
        setIsPasswordRepeatScoreLow
      );
    }

    checkPasswordEquity(passwordInputRef);

    makePostRequest();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  };

  useEffect(() => {

  return (
    <div className={styles["register-form-container"]}>
      <RegisterContext.Provider value={{ register: "register" }}>
        <Form handleSubmit={handleSubmit}>
          <FormChild>
            <h1>Create an account</h1>
          </FormChild>
          <FormChild isInput={true}>
            <label className={styles["input-label"]} htmlFor="email">
              <strong>Email *</strong>
            </label>
            <EmailInput
              name="email"
              onChange={handleChange}
              ref={emailInputRef}
              value={formData.email}
            />
          </FormChild>
          <FormChild isInput={true}>
            <label className={styles["input-label"]} htmlFor="password">
              <strong>Password *</strong>
            </label>
            <PasswordInput
              arePasswordsUnequal={arePasswordsUnequal}
              isPasswordScoreLow={isPasswordScoreLow}
              name="password"
              onChange={handleChange}
              ref={passwordInputRef}
              value={formData.password}
            ></PasswordInput>
          </FormChild>
          <FormChild isInput={true}>
            <label className={styles["input-label"]} htmlFor="passwordRepeat">
              <strong>Repeat password *</strong>
            </label>
            <PasswordInput
              arePasswordsUnequal={arePasswordsUnequal}
              isPasswordScoreLow={isPasswordRepeatScoreLow}
              name="passwordRepeat"
              onChange={handleChange}
              ref={passwordRepeatInputRef}
              value={formData.passwordRepeat}
            ></PasswordInput>
          </FormChild>
          <FormChild>
            <span className={styles["error-message"]}>{errorMessage}</span>
          </FormChild>
          <FormChild>
            <button className={styles["form-button"]} type="submit">
              Continue
            </button>
          </FormChild>
          <FormChild>
            <span>Already have an account? </span>
            <Link to="../login" className={styles["form-link"]}>
              Click here to log in
            </Link>
          </FormChild>
        </Form>
      </RegisterContext.Provider>
    </div>
  );
}

export default Register;
