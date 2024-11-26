import PropTypes from "prop-types";
import "./Input.module.css";

 function Input(props) {
  return (
    <input
      type={props.type}
      name={props.name}
      id={props.name}
      placeholder=""
      required
      value={props.value}
    />
  );
}

Input.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
};

export default Input;
