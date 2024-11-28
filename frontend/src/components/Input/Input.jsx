import { forwardRef } from "react";
import PropTypes from "prop-types";
import "./Input.module.css";

const Input = forwardRef(function Input(props, ref) {
  return (
    <input
      type={props.type}
      name={props.name}
      id={props.name}
      placeholder=""
      ref={ref}
      required
      value={props.value}
    />
  );
});

Input.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

export default Input;
