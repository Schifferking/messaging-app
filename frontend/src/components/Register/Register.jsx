import { createContext, useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import zxcvbn from "zxcvbn";
import Form from "../Form/Form";
import FormChild from "../FormChild/FormChild";
import EmailInput from "../EmailInput/EmailInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import { useFocusEmailInput } from "../../hooks/useFocusEmailInput";
import { usePasswordValidation } from "../../hooks/usePasswordValidation";
import { useEmailValidation } from "../../hooks/useEmailValidation";
import { useGoToPage } from "../../hooks/useGoToPage";
import { useUserAuthentication } from "../../hooks/useUserAuthentication";
import styles from "./Register.module.css";

export const RegisterContext = createContext({ register: "" });

function Register() {
  const stateVariables = useOutletContext();
  const [errorMessage, setErrorMessage] = stateVariables.errorMessage;
  const [userEmail, setUserEmail] = stateVariables.userEmail;
  const [formData, setformData] = useState({
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const userAuthentication = useUserAuthentication(
    setErrorMessage,
    setUserEmail,
    formData
  );

  const goToPage = useGoToPage();
  const emailInputRef = useFocusEmailInput();
  const passwordInputRef = useRef(null);
  const passwordRepeatInputRef = useRef(null);
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

  const validateForm = () => {
    const emailInputValidity = emailInputRef.current.validity;
    const passwordInputValidity = passwordInputRef.current.validity;
    const passwordRepeatInputValidity = passwordRepeatInputRef.current.validity;
    const actualPasswordLength = [...formData.password].length;
    const actualPasswordRepeatLength = [...formData.passwordRepeat].length;
    const passwordResult = zxcvbn(formData.password);
    const passwordRepeatResult = zxcvbn(formData.passwordRepeat);

    if (!emailInputValidity.valid) {
      return validateEmailInput(emailInputValidity);
    }

    if (!passwordInputValidity.valid || actualPasswordLength < 8) {
      return checkPasswordInput(passwordInputRef, actualPasswordLength);
    }

    // discard "easy" passwords (12345678, for example)
    if (passwordResult.score <= 2) {
      return checkPasswordScore(formData.password, setIsPasswordScoreLow);
    }

    if (!passwordRepeatInputValidity.valid || actualPasswordRepeatLength < 8) {
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

    if (formData.password !== formData.passwordRepeat) {
      return checkPasswordEquity(passwordInputRef);
    }

    userAuthentication.makeRegisterRequest();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  };

  // redirect to dashboard if user is logged in
  useEffect(() => {
    if (userEmail) {
      goToPage("/dashboard", true);
    }
  }, [userEmail, goToPage]);

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
