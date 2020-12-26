import * as React from "react";
import styles from "./../styles";
import { AbstractControl } from "react-reactive-form";

const loanTenureRadio = ({ handler }) => (
    <div style={styles.genderContainer}>
        <div style={styles.genderText}>
            <label> Tenure Type:</label>
        </div>
        <div style={styles.radioContainer}>
            <div>
                <input {...handler("radio", "months")} />
                <label>Loan Tenure Months&nbsp;&nbsp;&nbsp;&nbsp;</label>

                <input {...handler("radio", "years")} />
                <label>Loan Tenure Years&nbsp;&nbsp;&nbsp;&nbsp;</label>

            </div>
        </div>
    </div>
);

export default loanTenureRadio;
