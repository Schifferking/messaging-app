import zxcvbn from "zxcvbn";
import { useEmailValidation } from "./useEmailValidation";
import { usePasswordValidation } from "./usePasswordValidation";

export function useFormValidation(inputRefs, setErrorMessage) {
  const { emailInputRef, passwordInputRef, passwordRepeatInputRef } = inputRefs;
  const passwordValidation = usePasswordValidation(setErrorMessage);
  const validateEmailInput = useEmailValidation(emailInputRef, setErrorMessage);

  const validateForm = (
    formData,
    makeRegisterRequest,
    setPasswordStateFunctions
  ) => {
    const emailInputValidity = emailInputRef.current.validity;
    const passwordInputValidity = passwordInputRef.current.validity;
    const passwordRepeatInputValidity = passwordRepeatInputRef.current.validity;
    const actualPasswordLength = [...formData.password].length;
    const actualPasswordRepeatLength = [...formData.passwordRepeat].length;
    const passwordResult = zxcvbn(formData.password);
    const passwordRepeatResult = zxcvbn(formData.passwordRepeat);
    const { setIsPasswordScoreLow, setIsPasswordRepeatScoreLow } =
      setPasswordStateFunctions;

    if (!emailInputValidity.valid) {
      return validateEmailInput(emailInputValidity);
    }

    if (!passwordInputValidity.valid || actualPasswordLength < 8) {
      return passwordValidation.checkPasswordInput(
        passwordInputRef,
        actualPasswordLength
      );
    }

    // discard "easy" passwords (12345678, for example)
    if (passwordResult.score <= 2) {
      return passwordValidation.checkPasswordScore(
        formData.password,
        setIsPasswordScoreLow
      );
    }

    if (!passwordRepeatInputValidity.valid || actualPasswordRepeatLength < 8) {
      return passwordValidation.checkPasswordInput(
        passwordRepeatInputRef,
        actualPasswordRepeatLength
      );
    }

    if (passwordRepeatResult.score <= 2) {
      return passwordValidation.checkPasswordScore(
        formData.passwordRepeat,
        setIsPasswordRepeatScoreLow
      );
    }

    if (formData.password !== formData.passwordRepeat) {
      return passwordValidation.checkPasswordEquity(formData, passwordInputRef);
    }

    makeRegisterRequest();
  };

  return validateForm;
}
