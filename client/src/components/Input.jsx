import React from "react";
import clsx from "clsx";
import styles from "./input.module.css";

const Input = /* React.forwardRef(( */ (props /* , ref */) => {
  const { className, placeholder, required, type = "text", ...rest } = props;

  const classNames = clsx({ [styles.input]: true }, className);

  return (
    <label className="label">
      {placeholder}
      {required && <span className="inputRequired">*</span>}
      <div>
        <input
          /*           ref={ref} */
          type={type}
          placeholder={placeholder}
          className={classNames}
          required={required}
          {...rest}
        />
      </div>
    </label>
  );
}; /* ) */
export default Input;
