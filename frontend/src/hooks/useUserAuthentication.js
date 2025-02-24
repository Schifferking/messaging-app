import { useCallback, useEffect } from "react";
import axios_api_instance from "../axios_api_instance";
import { useGoToPage } from "./useGoToPage";

export function useUserAuthentication(
  setErrorMessage,
  setUserEmail,
  setUserId,
  setUserToken,
  formData = {}
) {
  const goToPage = useGoToPage();
  const LogIn = useCallback(
    (response) => {
      const userEmail = response.data.data.email;
      const userId = response.data.data.id;
      const userToken = response.headers.authorization;
      setUserEmail(userEmail);
      setUserId(userId);
      setUserToken(userToken);
      sessionStorage.setItem("userEmail", userEmail);
      sessionStorage.setItem("userToken", userToken);
      sessionStorage.setItem("userId", userId);
      goToPage("/dashboard", true);
    },
    [goToPage, setUserEmail, setUserId, setUserToken]
  );

  const LogOut = useCallback(() => {
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userToken");
    setUserEmail("");
    setUserId("");
    setUserToken("");
    goToPage("/login", true);
  }, [goToPage, setUserEmail, setUserId, setUserToken]);

  // add Authorization header before requests
  axios_api_instance.interceptors.request.use(function (config) {
    const userToken = sessionStorage.getItem("userToken");
    config.headers.Authorization = userToken ? userToken : "";
    return config;
  });

  const makeLoginRequest = useCallback(
    (formData = {}) => {
      axios_api_instance
        .post("login", {
          user: {
            email: formData.email,
            password: formData.password,
          },
        })
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
    [LogIn, setErrorMessage]
  );

  const makeLogOutRequest = () => {
    axios_api_instance
      .delete("logout")
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
    axios_api_instance
      .post("signup", {
        user: {
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.passwordRepeat,
        },
      })
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
    axios_api_instance.interceptors.response.use(
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

  return {
    makeLoginRequest,
    makeLogOutRequest,
    makeRegisterRequest,
  };
}
