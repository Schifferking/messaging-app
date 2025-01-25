import { useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import { useGoToPage } from "./useGoToPage";

export function useUserAuthentication(
  setErrorMessage,
  setUserEmail,
  setUserToken,
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

  const LogIn = useCallback(
    (response) => {
      const userEmail = response.data.data.email;
      const userToken = response.headers.authorization;
      setUserEmail(userEmail);
      setUserToken(userToken);
      sessionStorage.setItem("userEmail", userEmail);
      sessionStorage.setItem("userToken", userToken);
      goToPage("/", true);
    },
    [goToPage, setUserEmail, setUserToken]
  );

  const LogOut = useCallback(() => {
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userToken");
    setUserEmail("");
    setUserToken("");
    goToPage("/login", true);
  }, [goToPage, setUserEmail, setUserToken]);

  // add Authorization header before requests
  axios.interceptors.request.use(function (config) {
    const userToken = sessionStorage.getItem("userToken");
    config.headers.Authorization = userToken ? userToken : "";
    return config;
  });

  const makeLoginRequest = useCallback(
    (formData = {}) => {
      axios
        .post(
          `${backEndUrl}login`,
          {
            user: {
              email: formData.email,
              password: formData.password,
            },
          },
          { headers: headers }
        )
        .then((response) => {
          if (response.data.error) {
            return setErrorMessage(response.data.error);
          }

          // user logs in
          if (response.status === 200) {
            LogIn(response);
          }
        });
    },
    [headers, LogIn, setErrorMessage]
  );

  const makeLogOutRequest = () => {
    axios
      .delete(`${backEndUrl}logout`, { headers: headers })
      .then((response) => {
        if (response.status === 200) {
          LogOut();
        }
      })
      .catch((error) => {
        // note: replace this comment with code when handling some error
      });
  };

  const makeRegisterRequest = () => {
    axios
      .post(
        `${backEndUrl}signup`,
        {
          user: {
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.passwordRepeat,
          },
        },
        { headers: headers }
      )
      .then((response) => {
        if (response.data.error) {
          return setErrorMessage(response.data.error.email[1]);
        }

        // user registered successfully
        if (response.status === 200) {
          LogIn(response);
        }
      });
  };

  // prevent not redirecting when component first renders warning
  useEffect(() => {
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error.status === 401) {
          LogOut();
        }

        return Promise.reject(error);
      }
    );
  }, [LogOut]);

  return { makeLoginRequest, makeLogOutRequest, makeRegisterRequest };
}
