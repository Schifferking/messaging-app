import PropTypes from "prop-types";
import zxcvbn from "zxcvbn";
import "./PasswordStrengthMeter.module.css";

function PasswordStrengthMeter({ password }) {
  const passwordResult = zxcvbn(password);

  const createPasswordLabel = (score) => {
    switch (score) {
      case 0:
        return "Weak";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "Weak";
    }
  };

  return (
    <div className="password-strength-meter">
      <progress
        className={`password-strength-meter-progress strength-${createPasswordLabel(
          passwordResult.score
        )}`}
        value={passwordResult.score}
        max={4}
      />
      <label className="password-strength-meter-label">
        <strong>Password strength: </strong>
        {password && <>{createPasswordLabel(passwordResult.score)}</>}
      </label>
    </div>
  );
}

PasswordStrengthMeter.propTypes = {
  password: PropTypes.string,
};

export default PasswordStrengthMeter;
