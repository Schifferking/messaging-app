import PropTypes from "prop-types";

function Form({ children }) {
  return <form>{children}</form>;
}

Form.propTypes = {
  children: PropTypes.node,
};

export default Form;
