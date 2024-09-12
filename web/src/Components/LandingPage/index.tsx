import { Link } from "react-router-dom";
import styles from "./LandingPage.module.scss";

function LandingPage() {
  return (
    <div className={styles.main}>
      <Link to="register">
        <button type="button">SignUp</button>
      </Link>
      <Link to="login">
        <button type="button">Login</button>
      </Link>
    </div>
  );
}

export default LandingPage;
