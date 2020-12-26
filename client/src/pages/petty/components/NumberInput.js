import * as React from "react";
import styles from "./../styles";
import { AbstractControl } from "react-reactive-form";

// React SFC to render Input element
const NumberInput = ({
                       handler,
                       meta: { label, placeholder ,readOnly }
                   }) => (
    <div>
        <label style={styles.genderText}>{label}:</label>
        <input type="number" readOnly={readOnly} placeholder={placeholder} style={styles.input} {...handler()} />
        {/*<span style={styles.error}>*/}
        {/*  {touched &&*/}
        {/*  hasError("required") &&*/}
        {/*  `${label} is required`}*/}
        {/*</span>*/}
    </div>
);

export default NumberInput;
