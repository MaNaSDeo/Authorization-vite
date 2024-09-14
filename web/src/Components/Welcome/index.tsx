import { useAuth } from "../../Context/AuthContext";
import styles from "./Welcome.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Welcome = () => {
  const { user, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const response = await checkAuthStatus();
      if (response) {
        console.log("user details", response);
      } else {
        navigate("/");
      }
    };
    verifyAuth();
  }, []);

  const formattedDate = new Date(user?.createdAt!).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.main}>
      <p>
        Hey, {user?.firstname} {user?.lastname} you created this account on{" "}
        {formattedDate}
      </p>
    </div>
  );
};

export default Welcome;
