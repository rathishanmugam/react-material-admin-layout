import * as React from "react";
import styles from "./../styles";
import { AbstractControl } from "react-reactive-form";

const SelectBox = ({ handler }) => (
    <div>
        <label style={styles.genderText}>Loan Interest:</label>
        <select style={styles.input} {...handler()}>
            <option value="" disabled>
                Select
            </option>
            <option value="1">1</option>
            <option value="1.5">1.5</option>
            <option value="2.5">2</option>
            <option value="0.5">0.5</option>
        </select>
    </div>
);
export default SelectBox;
