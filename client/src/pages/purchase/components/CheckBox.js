import * as React from "react";
import { AbstractControl } from "react-reactive-form";

const Checkbox = ({ handler }) => (
    <div>
        <input {...handler("checkbox")} />
        <label>&nbsp;&nbsp;Send Stock</label>
    </div>
);

export default Checkbox;
