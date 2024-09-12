import { type FC } from "react";
import styles from "./InputBox.module.scss";
import { type InputProps } from "../../types";

const InputBox: FC<InputProps> = ({
  label,
  tag,
  type,
  placeholder,
  value,
  error,
  onChange,
}) => {
  return (
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
};

export default InputBox;
