import PropTypes from "prop-types";
import styles from "./UserListElement.module.css";

// to-do
// make CSS keyframe animations work with both mouse and keyboard

function UserListElement({ handleClick, userEmail }) {
  return (
    <li
      className={styles["user-list-element"]}
      onClick={handleClick}
      tabIndex={0}
    >
      {userEmail}
    </li>
  );
}

export default UserListElement;

UserListElement.propTypes = {
  handleClick: PropTypes.func,
  userEmail: PropTypes.string,
};
