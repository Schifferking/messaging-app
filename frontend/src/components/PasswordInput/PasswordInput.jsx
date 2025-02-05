import { forwardRef, useContext, useState } from "react";
import PropTypes from "prop-types";
import Input from "../Input/Input";
import PasswordStrengthMeter from "../PasswordStrengthMeter/PasswordStrengthMeter";
import { LoginContext } from "../../contexts/LoginContext";
import { RegisterContext } from "../../contexts/RegisterContext";
import styles from "./PasswordInput.module.css";
import Visibility from "../../assets/icons/visibility.svg?react";
import VisibilityOff from "../../assets/icons/visibility-off.svg?react";

const PasswordInput = forwardRef(function PasswordInput(
  { isPasswordScoreLow = false, ...restProps },
  ref
) {
  const { login } = useContext(LoginContext);
  const { register } = useContext(RegisterContext);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const classNamePrefix = login || register;
  // toggle password visibility
  const handleClick = () => {
    if (isPasswordVisible) {
      setIsPasswordVisible(false);
      ref.current.type = "password";
    } else {
      setIsPasswordVisible(true);
      ref.current.type = "text";
    }

    ref.current.focus();
    // move text cursor at end of input when password is selected
    const passwordLength = ref.current.value.length;
    ref.current.setSelectionRange(passwordLength, passwordLength);
  };

  // make password visibility icons work with "enter" and "space" keys
  const handleKeyDown = (e) => {
    if (e.code === "Enter" || e.code === "Space") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <Input
        arePasswordsUnequal={restProps.arePasswordsUnequal}
        isPasswordScoreLow={isPasswordScoreLow}
        type="password"
        minLength={8}
        ref={ref}
        {...restProps}
      ></Input>

      {isPasswordVisible ? (
        <Visibility
          className={styles[`${classNamePrefix}-visibility`]}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex="0"
        ></Visibility>
      ) : (
        <VisibilityOff
          className={styles[`${classNamePrefix}-visibility-off`]}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex="0"
        ></VisibilityOff>
      )}

      {register !== "" ? (
        <PasswordStrengthMeter password={restProps.value} />
      ) : null}
    </>
  );
});

PasswordInput.propTypes = {
  arePasswordsUnequal: PropTypes.bool,
  isPasswordScoreLow: PropTypes.bool,
  value: PropTypes.string,
};

export default PasswordInput;
