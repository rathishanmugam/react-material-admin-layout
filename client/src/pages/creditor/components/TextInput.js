import * as React from "react";
import styles from "./../styles";
import {AbstractControl, FieldControl} from "react-reactive-form";

// React SFC to render Input element
const TextInput = ({
                       handler,
                       meta: { label, placeholder, readOnly ,touched,hasError},

                   }) => (
    <div>
        <label style={styles.genderText}>{label}:</label>
        <input readOnly={readOnly} placeholder={placeholder} style={styles.input} {...handler()} />
        <div>
                        <span style={styles.error}>
                          {touched &&
                          hasError("required") &&
                          "Name is required"}
                        </span>
        </div>
    </div>
);

export default TextInput;
