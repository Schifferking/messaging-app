import PropTypes from "prop-types";
import styles from "./FormChild.module.css";

function FormChild({ children }) {
  return (
    <div className={styles["form-child"]}>
      {children}
    </div>
  );
}

FormChild.propTypes = {
  children: PropTypes.node,
};

export default FormChild;
