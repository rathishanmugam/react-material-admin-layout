import * as React from "react";
import { AbstractControl } from "react-reactive-form";
import styles from "../styles";

const Checkbox = ({ handler, meta: { label } }) => (
    <div style={styles.checkText}>
        <input {...handler("checkbox")} />
        <label >&nbsp;&nbsp;{label}</label>
    </div>
);

export default Checkbox;
