import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState(() => {
    const storedUserEmail = sessionStorage.getItem("userEmail");
    return storedUserEmail || null;
  });

  const [userToken, setUserToken] = useState(() => {
    const storedUserToken = sessionStorage.getItem("userToken");
    return storedUserToken || null;
  });

  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    sessionStorage.getItem("userEmail", userEmail);
  }, [userEmail]);

  useEffect(() => {
    sessionStorage.getItem("userToken", userToken);
  }, [userToken]);

  return (
    <>
      <Outlet
        context={{
          userEmail: [userEmail, setUserEmail],
          userToken: [userToken, setUserToken],
          errorMessage: [errorMessage, setErrorMessage],
        }}
      />
    </>
  );
}

export default App;
