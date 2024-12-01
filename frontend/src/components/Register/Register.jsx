import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import zxcvbn from "zxcvbn";
import Form from "../Form/Form";
import FormChild from "../FormChild/FormChild";
import EmailInput from "../EmailInput/EmailInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import { useFocusEmailInput } from "../../hooks/useFocusEmailInput";
import { usePasswordValidation } from "../../hooks/usePasswordValidation";
import { useEmailValidation } from "../../hooks/useEmailValidation";
import styles from "./Register.module.css";

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

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm();
  };

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
