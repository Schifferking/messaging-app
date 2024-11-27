import Input from "../Input/Input";
import styles from "./PasswordInput.module.css";

function PasswordInput( props ) {
  const handleClick = () => {
    ref.current.focus();
  };

  return (
    <>
      <Input
        type="password"
        minLength={8}
        {...props}
      ></Input>
    </>
  );
}

export default PasswordInput;
