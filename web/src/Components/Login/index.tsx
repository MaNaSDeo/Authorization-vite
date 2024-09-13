import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormState, InputFields } from "../../types";
import styles from "./Login.module.scss";
import InputBox from "../InputBox";
import { useAuth } from "../../Context/AuthContext";

const inputFields: InputFields = [
  {
    label: "Username/Email",
    tag: "usernameEmail",
    type: "text",
    placeholder: "Login with username or email",
  },
  {
    label: "Password",
    tag: "password",
    type: "password",
    placeholder: "Password please!",
  },
] as const;

const Login: FC = () => {
  const [formData, setFormData] = useState<FormState>(
    Object.fromEntries(inputFields.map((filed) => [filed.tag, ""]))
  );
  const [formError, setFormError] = useState<FormState>({});

  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log("user useEffect", user);
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let errors: FormState = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) errors[key] = "Required";
    });

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
    } else {
      const loginData = {
        password: formData.password,
        email: formData.usernameEmail,
        username: formData.usernameEmail,
      };
      try {
        const response = await login(loginData);

        if (response) {
          setFormData(
            Object.fromEntries(inputFields.map((filed) => [filed.tag, ""]))
          );
          //Succes snackbar
          navigate("/welcome");
        } else {
          //... Error logic here and an error snackbare
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className={styles.main}>
      <form onSubmit={handleSubmit}>
        {inputFields.map((field) => (
          <InputBox
            key={field.tag}
            {...field}
            value={formData[field.tag]}
            error={formError[field.tag]}
            onChange={handleChange}
          />
        ))}
        <button type="submit" className={styles.signUpBtn}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Login;
