import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";
import { useAuth } from "../../Context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const { logout, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const response = await checkAuthStatus();
      if (response) {
        console.log("user details", response);
        navigate("/welcome");
      }
    };
    verifyAuth();
  }, []);

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
