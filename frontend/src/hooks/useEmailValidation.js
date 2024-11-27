export function useEmailValidation(emailRef, setErrorMessage) {
  const showEmailError = (emailInputValidity) => {
    emailRef.current.focus();
    if (emailInputValidity.valueMissing) {
      setErrorMessage("You need to enter an email address.");
    } else if (emailInputValidity.typeMismatch) {
      setErrorMessage("The value you entered is not a valid email address.");
    }
  };

  const validateEmailInput = (emailInputValidity) => {
    if (emailInputValidity.valid) {
      setErrorMessage("");
    } else {
      showEmailError(emailInputValidity);
    }
  };

  return validateEmailInput;
}
