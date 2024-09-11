import { useState, ChangeEvent, FormEvent, FC } from "react";
import styles from "./SignUP.module.scss";

// Types for form state and errors
type FormField = string;
type FormState = Record<string, FormField>;

// Input field configuration
const inputFields = [
  {
    label: "First Name",
    tag: "firstname",
    type: "text",
    placeholder: "First name...",
  },
  {
    label: "Last Name",
    tag: "lastname",
    type: "text",
    placeholder: "Last name...",
  },
  {
    label: "Unique username",
    tag: "username",
    type: "text",
    placeholder: "Unique username...",
  },
  {
    label: "Unique email",
    tag: "email",
    type: "email",
    placeholder: "Unique Email...",
  },
  {
    label: "Password",
    tag: "password",
    type: "password",
    placeholder: "8+ chars: upper, lower, number, (@$!%*?&)",
  },
  {
    label: "Confirm password",
    tag: "confirmPassword",
    type: "text",
    placeholder: "Re-enter your password",
  },
] as const;

// Type for the keys of the form state
type FormStateKey = (typeof inputFields)[number]["tag"];

// Props for InputBox component
interface InputProps {
  label: string;
  tag: FormStateKey;
  placeholder: string;
  type: string;
  value: string;
  error: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const InputBox: FC<InputProps> = ({
  label,
  tag,
  type,
  placeholder,
  value,
  error,
  onChange,
}) => (
  <div className={styles.inputBox}>
    <div className={styles.labelContainer}>
      <label htmlFor={tag}>{label}</label>
      {error && <p className={styles.requiredError}>{error}</p>}
    </div>

    <input
      type={type}
      name={tag}
      id={tag}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={error ? styles.inputError : ""}
    />
  </div>
);

const SignUp: FC = () => {
  const [formData, setFormData] = useState<FormState>(
    Object.fromEntries(inputFields.map((filed) => [filed.tag, ""]))
  );

  const [formError, setFormError] = useState<FormState>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError((prev) => ({ ...prev, [name]: "" }));
  };

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    let errors: FormState = {};

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) errors[key] = "Required";
    });

    // Password specific validations
    if (formData.password !== formData.confirmPassword) {
      errors.password = errors.confirmPassword = "Passwords don't match";
    } else {
      const passworRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passworRegex.test(formData.password)) {
        errors.password = errors.confirmPassword = "Weak password";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormError(errors);
    } else {
      console.log("formData", formData);
      // Backend
    }
  }
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

export default SignUp;
