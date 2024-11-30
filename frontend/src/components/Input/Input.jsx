import { forwardRef } from "react";
import PropTypes from "prop-types";
import "./Input.module.css";

const Input = forwardRef(function Input(props, ref) {
  const { arePasswordsUnequal, isPasswordScoreLow, ...restProps } = props;
  return (
    <input
      className={arePasswordsUnequal || isPasswordScoreLow ? "invalid" : ""}
      type={props.type}
      name={props.name}
      id={props.name}
      placeholder=""
      ref={ref}
      required
      value={props.value}
      {...restProps}
    />
  );
});

Input.propTypes = {
  arePasswordsUnequal: PropTypes.bool,
  isPasswordScoreLow: PropTypes.bool,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

export default Input;
