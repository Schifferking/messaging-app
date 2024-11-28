import { forwardRef } from "react";
import Input from "../Input/Input";
import "./EmailInput.module.css";

const EmailInput = forwardRef(function EmailInput(props, ref) {
  return <Input type="email" ref={ref} {...props} />;
});

export default EmailInput;
