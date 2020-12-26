import * as React from "react";
import styles from "./../styles";
import { AbstractControl } from "react-reactive-form";

// React SFC to render Input element
const TextInput = ({
                       handler,
                       meta: { label, placeholder }
                   }) => (
    <div>
        <label>{label}:</label>
        <input placeholder={placeholder} style={styles.input} {...handler()} />
        {/*<span style={styles.error}>*/}
        {/*  {touched &&*/}
        {/*  hasError("required") &&*/}
        {/*  `${label} is required`}*/}
        {/*</span>*/}
    </div>
);

export default TextInput;
