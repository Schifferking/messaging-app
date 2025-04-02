import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { useGoToPage } from "../../hooks/useGoToPage";
import { useUserAuthentication } from "../../hooks/useUserAuthentication";
import axios_api_instance from "../../axios_api_instance";
import styles from "./UserProfile.module.css";

function UserProfile() {
  const stateVariables = useOutletContext();
  const { id } = useParams();
  const goToPage = useGoToPage();
  const [errorMessage, setErrorMessage] = stateVariables.errorMessage;
  const [userId, setUserId] = stateVariables.userId;
  const [userToken, setUserToken] = stateVariables.userToken;
  const [userEmail, setUserEmail] = stateVariables.userEmail;
  const [userProfileData, setUserProfileData] = useState({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const userAuthentication = useUserAuthentication(
    setErrorMessage,
    setUserEmail,
    setUserToken
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", avatar);
    axios_api_instance.patch(`user/${id}`, formData, {
      headers: { "Content-Type": false },
    });
  };

  const handleChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  useEffect(() => {
    if (!userToken) {
      goToPage("/login", true);
    }
  }, [goToPage, userToken]);

  useEffect(() => {
    axios_api_instance.get(`user/${id}`).then((response) => {
      setUserProfileData(response.data.data["user_data"]);
      setIsDataLoaded(true);
    });
  }, [id]);

  if (!isDataLoaded) {
    return <p className={styles["spinner"]}>Loading...</p>;
  }

  return (
    <div className={styles["profile-page-container"]}>
      <header className={styles["header"]}>
        <nav className={styles["navbar"]}>
          <Link className={styles["navbar-home-link"]} to="/">
            Just another messaging app
          </Link>
          <div className={styles["user-dropdown"]}>
            {userProfileData.avatar_path && userId === id && (
              <img
                className={styles["user-avatar"]}
                src={userProfileData["avatar_path"]}
                alt="user avatar"
              />
            )}
            <Link to={`/user/${userId}`}>{userEmail}</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button
              className={styles["nav-button"]}
              onClick={userAuthentication.makeLogOutRequest}
            >
              log out
            </button>
          </div>
        </nav>
      </header>
      <main className={styles["content-container"]}>
        {id === userId ? (
          <form className={styles["edit-profile-form"]} onSubmit={handleSubmit}>
            <h1 className={styles["edit-profile-form-child"]}>
              Edit your profile
            </h1>
            <label htmlFor="avatar">Avatar *</label>
            <input
              accept="image/*"
              name="avatar"
              onChange={handleChange}
              required
              type="file"
            />
            <button
              className={`${styles["edit-profile-form-child"]} ${styles["edit-profile-submit-button"]}`}
              type="submit"
            >
              Edit
            </button>
          </form>
        ) : (
          <div className={styles["user-profile-container"]}>
            <h1 className={styles["user-profile-header"]}>User Profile</h1>
            <div className={styles["user-profile-row"]}>
              {userProfileData["avatar_path"] && (
                <img
                  className={styles["user-avatar"]}
                  src={userProfileData["avatar_path"]}
                />
              )}
              <p className={styles["user-profile-email"]}>
                {userProfileData.email}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default UserProfile;
