import { forwardRef, useState } from "react";
import PropTypes from "prop-types";
import Input from "../Input/Input";
import styles from "./PasswordInput.module.css";
import Visibility from "../../assets/icons/visibility.svg?react";
import VisibilityOff from "../../assets/icons/visibility-off.svg?react";

const PasswordInput = forwardRef(function PasswordInput(
  { arePasswordsUnequal, ...restProps } = props,
  ref
) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
        type="password"
        minLength={8}
        ref={ref}
        {...restProps}
      ></Input>

      {isPasswordVisible ? (
        <Visibility
          className={styles["visibility"]}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex="0"
        ></Visibility>
      ) : (
        <VisibilityOff
          className={styles["visibility-off"]}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex="0"
        ></VisibilityOff>
      )}
    </>
  );
});

PasswordInput.propTypes = {
  arePasswordsUnequal: PropTypes.bool,
};

export default PasswordInput;
