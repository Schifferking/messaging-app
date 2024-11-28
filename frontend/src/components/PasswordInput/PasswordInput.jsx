import { useState } from "react";
import Input from "../Input/Input";
import styles from "./PasswordInput.module.css";
import Visibility from "../../assets/icons/visibility.svg?react";
import VisibilityOff from "../../assets/icons/visibility-off.svg?react";

function PasswordInput( props ) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // toggle password visibility
  const handleClick = () => {
    if (isPasswordVisible) {
      setIsPasswordVisible(false);
    } else {
      setIsPasswordVisible(true);
    }

    ref.current.focus();
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
        type="password"
        minLength={8}
        {...props}
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
}

export default PasswordInput;
