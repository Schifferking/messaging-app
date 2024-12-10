import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState(() => {
    const storedUserEmail = sessionStorage.getItem("userEmail");
    return storedUserEmail || null;
  });

  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    sessionStorage.getItem("userEmail", userEmail);
  }, [userEmail]);

  return (
    <>
      <Outlet
        context={{
          userEmail: [userEmail, setUserEmail],
          errorMessage: [errorMessage, setErrorMessage],
        }}
      />
    </>
  );
}

export default App;
