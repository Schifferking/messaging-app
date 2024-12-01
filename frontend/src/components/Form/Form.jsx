import PropTypes from "prop-types";

function Form({ handleSubmit, children }) {
  return (
    <form onSubmit={handleSubmit} noValidate>
      {children}
    </form>
  );
}

Form.propTypes = {
  handleSubmit: PropTypes.func,
  children: PropTypes.node,
};

export default Form;
