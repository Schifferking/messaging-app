import { useParams } from "react-router-dom";
import Login from "../Login/Login";
import Register from "../Register/Register";

function UserAuthentication() {
  const { name } = useParams();

  return (
    <>
      {name === "login" ? <Login /> : name === "register" ? <Register /> : null}
    </>
  );
}

export default UserAuthentication;
