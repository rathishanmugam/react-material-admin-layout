import * as React from "react";
import styles from "./../styles";
import { AbstractControl } from "react-reactive-form";

// React SFC to render Input element
const TextInput = ({
                       handler,
                       meta: { label, placeholder, readOnly }
                   }) => (
    <div>
        <label style={styles.genderText}>{label}:</label>
        <input readOnly={readOnly} placeholder={placeholder} style={styles.input} {...handler()} />
        <div>

        </div>
    </div>
);

export default TextInput;
