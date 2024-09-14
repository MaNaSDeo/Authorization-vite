import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";
import axios from "axios";
import { useAuth } from "../../Context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL!;

const checkAuthStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/auth/check`, {
      withCredentials: true,
    });
    return response.data.user;
  } catch (error) {
    console.error("Authentication check failed: ", error);
    return null;
  }
};

function LandingPage() {
  const { setUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuthStatus();
      if (user) {
        setUser;
        console.log("user details", user);
        navigate("/welcome");
      }
    };
    verifyAuth();
  }, [setUser]);

  async function handleClick() {
    const response = await logout();

    console.log("response", response);
  }
  return (
    <div className={styles.main}>
      <Link to="register">
        <button type="button">SignUp</button>
      </Link>
      <Link to="login">
        <button type="button">Login</button>
      </Link>
      <button type="button" onClick={handleClick}>
        Logout
      </button>
    </div>
  );
}

export default LandingPage;
