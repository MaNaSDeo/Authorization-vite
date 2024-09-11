import {
  useState,
  Dispatch,
  SetStateAction,
  ChangeEvent,
  FormEvent,
} from "react";
import styles from "./SignUP.module.scss";

interface SignUpFormState {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

interface InputProps {
  label: string;
  tag: keyof SignUpFormState;
  formData: SignUpFormState;
  setFormData: Dispatch<SetStateAction<SignUpFormState>>;
  placeholder: string;
  type: string;
  formError: SignUpFormState;
  setFormError: Dispatch<SetStateAction<SignUpFormState>>;
}

function InputBox(props: InputProps) {
  const {
    label,
    tag,
    formData,
    setFormData,
    placeholder,
    type,
    formError,
    setFormError,
  } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [tag]: e.target.value,
    });
    setFormError({
      ...formError,
      [tag]: "",
    });
  };

  return (
    <div className={styles.inputBox}>
      <div className={styles.labelContainer}>
        <label htmlFor={tag}>{label}</label>
        {formError[tag] && (
          <p className={styles.requiredError}>{formError[tag]}</p>
        )}
      </div>

      <input
        type={type}
        name={tag}
        id={tag}
        value={formData[tag]}
        onChange={handleChange}
        placeholder={placeholder}
        className={formError[tag] ? styles.inputError : ""}
      />
    </div>
  );
}

function SignUp() {
  const [formData, setFormData] = useState<SignUpFormState>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  const [formError, setFormError] = useState<SignUpFormState>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    let errors: Partial<SignUpFormState> = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof SignUpFormState]) {
        errors[key as keyof SignUpFormState] = "Required";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormError((prevState) => ({ ...prevState, ...errors }));
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Password don't match",
        confirmPassword: "Password don't match",
      }));
      return;
    }

    let passworRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g;

    if (!formData.password.match(passworRegex)) {
      setFormError((prevState) => ({
        ...prevState,
        password: "Weak password",
        confirmPassword: "Weak password",
      }));
      return;
    }
    console.log("formData", formData);
  }
  return (
    <div className={styles.main}>
      <form onSubmit={handleSubmit}>
        <InputBox
          label={"First Name"}
          tag={"firstname"}
          formData={formData}
          setFormData={setFormData}
          placeholder={"Enter your first name..."}
          type={"text"}
          formError={formError}
          setFormError={setFormError}
        />
        <InputBox
          label={"Last Name"}
          tag={"lastname"}
          formData={formData}
          setFormData={setFormData}
          placeholder={"Enter your last name..."}
          type={"text"}
          formError={formError}
          setFormError={setFormError}
        />
        <InputBox
          label={"Unique username"}
          tag={"username"}
          formData={formData}
          setFormData={setFormData}
          type={"text"}
          placeholder={"Enter an unique username..."}
          formError={formError}
          setFormError={setFormError}
        />
        <InputBox
          label={"Unique Email"}
          tag={"email"}
          formData={formData}
          setFormData={setFormData}
          type={"email"}
          placeholder={"Enter an unique email..."}
          formError={formError}
          setFormError={setFormError}
        />
        <InputBox
          label={"Password"}
          tag={"password"}
          formData={formData}
          setFormData={setFormData}
          type={"password"}
          placeholder={"Minimum 8 Char"}
          formError={formError}
          setFormError={setFormError}
        />
        <InputBox
          label={"Confirm password"}
          tag={"confirmPassword"}
          formData={formData}
          setFormData={setFormData}
          type={"text"}
          placeholder={"Minimum 8 Char"}
          formError={formError}
          setFormError={setFormError}
        />
        <button type="submit" className={styles.signUpBtn}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
