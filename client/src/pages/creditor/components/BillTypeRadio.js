import * as React from "react";
import styles from "./../styles";
import { AbstractControl } from "react-reactive-form";

const BillTypeRadio = ({ handler }) => (
    <div style={styles.genderContainer}>
        <div style={styles.genderText}>
            <label>BillType:</label>
        </div>
        <div style={styles.radioContainer}>
            <div>
                <input {...handler("radio", "credit")} />
                <label >Credit&nbsp;&nbsp;</label>

                <input {...handler("radio", "finance")} />
                <label>Finance&nbsp;&nbsp;&nbsp;&nbsp;</label>

                <input {...handler("radio", "cash")} />
                <label>Cash</label>
            </div>
        </div>
    </div>
);

export default BillTypeRadio;
