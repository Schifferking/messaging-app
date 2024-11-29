import PropTypes from "prop-types";
import styles from "./FormChild.module.css";
import Warning from "../../assets/icons/warning.svg?react";
import CheckCircle from "../../assets/icons/check-circle.svg?react";

function FormChild({ isInput = false, children }) {
  return (
    <div className={styles["form-child"]}>
      {children}
      {isInput && (
        <div className={styles["icons-container"]}>
          <Warning className={"warning"}></Warning>
          <CheckCircle
            className={"check-circle"}
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
