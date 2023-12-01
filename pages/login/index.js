import { useEffect, useState } from "react";
import styles from "./login.module.css";
import axios from "axios";
import { useRouter } from "next/router";

const Index = () => {
  const router = useRouter();

  // state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    // Check if the user is already logged in
    const username = localStorage.getItem("username");
    if (username) {
      // Redirect to the main dashboard if already logged in
      router.push("/");
    }
  }, []);

  // state for error messages
  const [error, setError] = useState("");

  // handle input value when it is change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // save data
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      username: loginData.username,
      password: loginData.password,
    };

    const url = `${process.env.NEXT_PUBLIC_API_URL}/login`;

    axios
      .post(url, data)
      .then(function (response) {
        if (response.data[0].username && response.data[0].password) {
          // User is authenticated
          localStorage.setItem("username", response.data[0].username);
          router.push("/");
        } else {
          // Invalid username or password
          setError("Invalid username or password");
        }
      })
      .catch(function (error) {
        setError("Invalid username or password");
      });
  };

  return (
    <>
      <div className={`${styles.maincontainer}`}>
        <div className={`${styles.container}`}>
          <div className={styles.forms_container}>
            <div className={`${styles.form_control} ${styles.signin_form}`}>
              <form action="#">
                <h2>Signin</h2>
                <input
                  type="text"
                  name="username"
                  value={loginData.username}
                  placeholder="Username"
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  placeholder="Password"
                  onChange={handleInputChange}
                  required
                />
                {loginData.username == "" || loginData.password == "" ? (
                  <button disabled className="disable-btn">
                    Signin
                  </button>
                ) : (
                  <button onClick={handleSubmit}>Signin</button>
                )}
                {error && (
                  <p style={{ color: "red", paddingTop: "20px" }}>{error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
