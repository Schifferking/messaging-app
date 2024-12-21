import { useState } from "react";
import zxcvbn from "zxcvbn";

export function usePasswordValidation(setErrorMessage) {
  const [arePasswordsUnequal, setArePasswordsUnequal] = useState(false);
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

  const checkPasswordEquity = (passwordValues, passwordRef) => {
    if (passwordValues.password === passwordValues.passwordRepeat) {
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

  const showPasswordError = (passwordRef, passwordLength) => {
    passwordRef.current.focus();
    if (passwordRef.current.validity.valueMissing) {
      setErrorMessage(() => "You need to enter a password.");
    } else if (passwordLength < 8) {
      setErrorMessage(() => "Password length should be at least 8 characters.");
    }
  };

  const checkPasswordInput = (passwordRef, passwordLength) => {
    if (passwordRef.current.validity.valid && passwordLength >= 8) {
      setErrorMessage(() => "");
    } else {
      showPasswordError(passwordRef, passwordLength);
    }
  };

  const validateRegisterPasswordInput = (passwordInputData) => {
    const { passwordRef, setStateFunction } = passwordInputData;

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

  const passwordValidation = {
    arePasswordsUnequal,
    checkPasswordInput,
    checkPasswordEquity,
    checkPasswordScore,
    validateRegisterPasswordInput,
  };

  return passwordValidation;
}
