import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  const [userEmail, setUserEmail] = useState(() => {
    const storedUserEmail = sessionStorage.getItem("userEmail");
    return storedUserEmail || null;
  });

  useEffect(() => {
    sessionStorage.getItem("userEmail", userEmail);
  }, [userEmail]);

  return (
    <>
      <Outlet context={[userEmail, setUserEmail]} />
    </>
  );
}

export default App;
