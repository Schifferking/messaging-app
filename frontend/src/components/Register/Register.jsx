import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Form from "../Form/Form";
import FormChild from "../FormChild/FormChild";
import EmailInput from "../EmailInput/EmailInput";
import PasswordInput from "../PasswordInput/PasswordInput";
import { RegisterContext } from "../../contexts/RegisterContext";
import { useFocusEmailInput } from "../../hooks/useFocusEmailInput";
import { usePasswordValidation } from "../../hooks/usePasswordValidation";
import { useEmailValidation } from "../../hooks/useEmailValidation";
import { useGoToPage } from "../../hooks/useGoToPage";
import { useUserAuthentication } from "../../hooks/useUserAuthentication";
import { useFormValidation } from "../../hooks/useFormValidation";
import styles from "./Register.module.css";

function Register() {
  const stateVariables = useOutletContext();
  const [errorMessage, setErrorMessage] = stateVariables.errorMessage;
  const [userEmail, setUserEmail] = stateVariables.userEmail;
  const [userToken, setUserToken] = stateVariables.userToken;
  const [formData, setformData] = useState({
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const userAuthentication = useUserAuthentication(
    setErrorMessage,
    setUserEmail,
    setUserToken,
    formData
  );

  const goToPage = useGoToPage();
  const emailInputRef = useFocusEmailInput();
  const passwordInputRef = useRef(null);
  const passwordRepeatInputRef = useRef(null);
  const inputRefs = { emailInputRef, passwordInputRef, passwordRepeatInputRef };
  const validateForm = useFormValidation(inputRefs, setErrorMessage);
  const [isPasswordScoreLow, setIsPasswordScoreLow] = useState(false);
  const [isPasswordRepeatScoreLow, setIsPasswordRepeatScoreLow] =
    useState(false);

  const setPasswordStateFunctions = {
    setIsPasswordScoreLow,
    setIsPasswordRepeatScoreLow,
  };

  const validateEmailInput = useEmailValidation(emailInputRef, setErrorMessage);
  const { arePasswordsUnequal, validateRegisterPasswordInput } =
    usePasswordValidation(setErrorMessage);

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

  const validateInput = (inputFieldName) => {
    if (inputFieldName === "email") {
      validateEmailInput(emailInputRef.current.validity);
    } else {
      const passwordInputData = getPasswordData(inputFieldName);
      validateRegisterPasswordInput(passwordInputData);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    validateForm(
      formData,
      userAuthentication.makeRegisterRequest,
      setPasswordStateFunctions
    );
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
