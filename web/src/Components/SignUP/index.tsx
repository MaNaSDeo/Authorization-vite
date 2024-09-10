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
}

function InputBox(props: InputProps) {
  const { label, tag, formData, setFormData, placeholder, type } = props;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [tag]: e.target.value,
    });
  };

  return (
    <div className={styles.inputBox}>
      <label htmlFor={tag}>{label}</label>
      <input
        type={type}
        name={tag}
        id={tag}
        value={formData[tag]}
        onChange={handleChange}
        placeholder={placeholder}
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
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
        />
        <InputBox
          label={"Last Name"}
          tag={"lastname"}
          formData={formData}
          setFormData={setFormData}
          placeholder={"Enter your last name..."}
          type={"text"}
        />
        <InputBox
          label={"Unique username"}
          tag={"username"}
          formData={formData}
          setFormData={setFormData}
          type={"text"}
          placeholder={"Enter an unique username..."}
        />
        <InputBox
          label={"Unique Email"}
          tag={"email"}
          formData={formData}
          setFormData={setFormData}
          type={"email"}
          placeholder={"Enter an unique email..."}
        />
        <InputBox
          label={"Password"}
          tag={"password"}
          formData={formData}
          setFormData={setFormData}
          type={"password"}
          placeholder={"Minimum 8 Char"}
        />
        <InputBox
          label={"Confirm password"}
          tag={"confirmPassword"}
          formData={formData}
          setFormData={setFormData}
          type={"text"}
          placeholder={"Minimum 8 Char"}
        />
        <button type="submit" className={styles.signUpBtn}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
