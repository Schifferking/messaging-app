import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState(() => {
    const storedUserEmail = sessionStorage.getItem("userEmail");
    return storedUserEmail || null;
  });

  const [userId, setUserId] = useState(() => {
    const storedUserId = sessionStorage.getItem("userId");
    return storedUserId || null;
  });

  const [userToken, setUserToken] = useState(() => {
    const storedUserToken = sessionStorage.getItem("userToken");
    return storedUserToken || null;
  });

  const [errorMessage, setErrorMessage] = useState("");

  // update user data
  useEffect(() => {
    sessionStorage.getItem("userEmail", userEmail);
  }, [userEmail]);

  useEffect(() => {
    sessionStorage.getItem("userId", userId);
  }, [userId]);

  useEffect(() => {
    sessionStorage.getItem("userToken", userToken);
  }, [userToken]);

  return (
    <>
      <Outlet
        context={{
          userEmail: [userEmail, setUserEmail],
          userId: [userId, setUserId],
          userToken: [userToken, setUserToken],
          errorMessage: [errorMessage, setErrorMessage],
        }}
      />
    </>
  );
}

export default App;
