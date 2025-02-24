import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import UserListElement from "../UserListElement/UserListElement";
import { useGoToPage } from "../../hooks/useGoToPage";
import { useUserAuthentication } from "../../hooks/useUserAuthentication";
import axios_api_instance from "../../axios_api_instance";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const goToPage = useGoToPage();
  const stateVariables = useOutletContext();
  const [errorMessage, setErrorMessage] = stateVariables.errorMessage;
  const [userEmail, setUserEmail] = stateVariables.userEmail;
  const [userId, setUserId] = stateVariables.userId;
  const [userToken, setUserToken] = stateVariables.userToken;
  const [usersData, setUsersData] = useState([]);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const messageInputRef = useRef(null);
  const userAuthentication = useUserAuthentication(
    setErrorMessage,
    setUserEmail,
    setUserId,
    setUserToken
  );

  // fetch messages
  const handleClick = (receiverId) => {
    setReceiverEmail(receiverId);
    axios_api_instance
      .get(`messages?senderId=${userId}&receiverId=${receiverId}`)
      .then((response) => {
        const fetchedMessages = response.data.data.messages;
        setChatMessages(fetchedMessages);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userMessage !== "") {
      axios_api_instance
        .post("messages", {
          message: {
            content: userMessage,
            receiver_id: receiverEmail,
            sender_id: userId,
          },
        })
        .then((response) => {
          // consider adding something in case of error
        });

      setUserMessage("");
    }
  };

  const handleChange = (e) => {
    setUserMessage(e.target.value);
  };

  // redirect anonymous user to home page
  useEffect(() => {
    if (!userToken) {
      goToPage("/login", true);
    }
  }, [userToken, goToPage]);

  useEffect(() => {
    if (userEmail) {
      axios_api_instance.get("users").then((response) => {
        if (response.status === 200) {
          const fetchedUsersData = response.data.data.users;
          setUsersData(fetchedUsersData);
        }
      });
    }
  }, [userEmail]);

  useEffect(() => {
    if (receiverEmail !== "") {
      messageInputRef.current.focus();
    }
  }, [receiverEmail]);

  return (
    <div className={styles["dashboard-container"]}>
      <header className={styles["header"]}>
        <nav className={styles["navbar"]}>
          <strong>Just another messaging app</strong>
          <div className={styles["user-dropdown"]}>
            <span>{userEmail}</span>
            <button
              className={styles["nav-button"]}
              onClick={userAuthentication.makeLogOutRequest}
            >
              log out
            </button>
          </div>
        </nav>
      </header>
      <nav className={styles["vertical-navbar"]}>
        <h1 className={styles["users-header"]}>Users</h1>
        <ul className={styles["users-list"]}>
          {usersData.map((userData) => (
            <UserListElement
              key={userData.id}
              handleClick={() => handleClick(userData.id)}
              userEmail={userData.email}
            />
          ))}
        </ul>
      </nav>
      <main className={styles["main"]}>
        <div className={styles["content-container"]}>
          {chatMessages.length >= 1 && (
            <div className={styles["chat-container"]}>
              {chatMessages.map((chatMessage) => (
                <div
                  className={styles["chat-message"]}
                  key={crypto.randomUUID()}
                >
                  <p>{chatMessage.content}</p>
                  <p className={styles["italic-text"]}>{chatMessage.email}</p>
                </div>
              ))}
            </div>
          )}
          {receiverEmail === "" ? (
            <p>Select a user to chat</p>
          ) : (
            /* using autocomplete "one-time-code" to disable autocomplete (may)
               stop working in the future */
            <form
              autoComplete={"one-time-code"}
              className={styles["message-form"]}
              noValidate
              onSubmit={handleSubmit}
            >
              <label className={styles["message-label"]} htmlFor="message">
                * Message
              </label>
              <input
                autoComplete={"one-time-code"}
                className={styles["message-input"]}
                id="message"
                name="message"
                onChange={handleChange}
                placeholder={""}
                ref={messageInputRef}
                required
                type="text"
                value={userMessage}
              />
              <button className={styles["message-submit-button"]} type="submit">
                Send
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
