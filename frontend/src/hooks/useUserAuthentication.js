import { useCallback, useMemo } from "react";
import axios from "axios";
import { useGoToPage } from "./useGoToPage";

export function useUserAuthentication(
  setErrorMessage,
  setUserEmail,
  formData = {}
) {
  const goToPage = useGoToPage();
  const frontEndUrl = "http://localhost:5173";
  const backEndUrl = "http://localhost:3000/";
  const headers = useMemo(() => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": frontEndUrl,
      Vary: "Origin",
    };
  }, []);

  const makeLoginRequest = useCallback(() => {
    axios
      .post(
        `${backEndUrl}login`,
        {
          formData,
        },
        { headers: headers }
      )
      .then((response) => {
        if (response.data.error) {
          return setErrorMessage(response.data.error);
        }

        // user logs in
        if (response.status === 200) {
          setUserEmail(response.data.email);
          sessionStorage.setItem("userEmail", response.data.email);
          goToPage("/dashboard", true);
        }
      });
  }, [formData, goToPage, headers, setErrorMessage, setUserEmail]);

  const makeLogOutRequest = () => {
    axios
      .delete(`${backEndUrl}logout`, { headers: headers })
      .then((response) => {
        if (response.status === 204) {
          setUserEmail("");
          sessionStorage.removeItem("userEmail");
          goToPage("login");
        }
      });
  };

  const makeRegisterRequest = () => {
    axios
      .post(
        `${backEndUrl}signup`,
        {
          formData,
        },
        { headers: headers }
      )
      .then((response) => {
        if (response.data.error) {
          return setErrorMessage(response.data.error.email[1]);
        }

        // user registered successfully
        if (response.status === 200) {
          setUserEmail(response.data.email);
          sessionStorage.setItem("userEmail", response.data.email);
          goToPage("/dashboard", true);
        }
      });
  };

  return { makeLoginRequest, makeLogOutRequest, makeRegisterRequest };
}
