export function usePasswordValidation(setErrorMessage) {
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

  return checkPasswordInput;
}
