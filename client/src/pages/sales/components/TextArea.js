import * as React from "react";
import styles from "./../styles";
import { AbstractControl } from "react-reactive-form";

const TextArea = ({ handler }) => (
    <div >
            <label style={styles.genderText}>Notes:</label>
            <textarea style={styles.textAreaStyles} {...handler()} />
    </div>
);

export default TextArea;
