import { useContext } from "react";
import PropTypes from "prop-types";
import { LoginContext } from "../Login/Login";
import { RegisterContext } from "../Register/Register";
import styles from "./FormChild.module.css";
import Warning from "../../assets/icons/warning.svg?react";
import CheckCircle from "../../assets/icons/check-circle.svg?react";

function FormChild({ isInput = false, children }) {
  const { login } = useContext(LoginContext);
  const { register } = useContext(RegisterContext);
  const classNamePrefix = login || register;
  return (
    <div className={styles["form-child"]}>
      {children}
      {isInput && (
        <div className={styles["icons-container"]}>
          <Warning className={`${classNamePrefix}-warning`}></Warning>
          <CheckCircle
            className={`${classNamePrefix}-check-circle`}
          ></CheckCircle>
        </div>
      )}
    </div>
  );
}

FormChild.propTypes = {
  isInput: PropTypes.bool,
  children: PropTypes.node,
};

export default FormChild;
