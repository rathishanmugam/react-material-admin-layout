import * as React from "react";
import styles from "./../styles";
import { AbstractControl } from "react-reactive-form";

const SelectBox = ({ handler , meta: { label,creditors }}) => (
    <div>
        <label>{label}:</label>

        <select style={styles.input} {...handler()}>
            <option value="" disabled>
                Select
            </option>
            { creditors.map(credit => (
                <option key={credit.name}>{credit.name}</option>))}

        </select>
    </div>
);
export default SelectBox;
