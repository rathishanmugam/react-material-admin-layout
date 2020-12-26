import React from 'react';
// import { FormControl,InputLabel,Input,FormHelperText } from '@material-ui/core';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import {
    FormBuilder,
    Validators,
    FieldGroup,
    FieldControl,
    FieldArray
} from "react-reactive-form";
import {
    Checkbox,
    NumberInput,
    DateInput
} from "./FieldControl";
import styles from "../../sales/styles";
import axios from 'axios';
import CardContent from "@material-ui/core/CardContent";
class DueForm extends React.Component {
    sendInterest = false;
    _isMounted = false;

    dueForm = FormBuilder.group({
        grace: ["", [Validators.required, Validators.pattern('[0-9].*')]],
        payingDueAmount: ["", [Validators.required]],
        payingDueDateDate: ["", [Validators.required]],
        interest: ["", [Validators.required]],
    });

    //     onChange = e => {
    //     this.setState({[e.target.name]: e.target.value})
    // }


    componentDidMount(){
        this._isMounted = true;

        if (this._isMounted) {

            this.dueForm.get('payingDueAmount').valueChanges.subscribe(
                value => {
                    // this.data.payingDueAmount = value;
                    const current = new Date();
                    const dat = new Date().toISOString().slice(0, 10);
                    console.log('date===>', dat);
                    this.dueForm.get('payingDueDate').patchValue(dat);
                });
            this.dueForm.get('grace').valueChanges.subscribe(
                value => {
                    // this.data.gracePeriod = value;
                    this.sendInterest = false;

                });
            this.dueForm.get('interest').valueChanges.subscribe(
                value => {
                    this.sendInterest = value;

                });

        }
    }

    handleReset() {
        this._isMounted = false;
        console.log('mounted flag', this._isMounted);
        if (this._isMounted === false) {
            this.dueForm.reset();
        }
    }
    handleSubmit(e) {
        e.preventDefault();
        if(this.props.creditDue){
            const { creditNo, customerName,dueAmount, dueCurrentDate, dueEndDate, duePaid, dueStartDate } = this.props.creditDue;
            console.log('the val are===>',creditNo, customerName,dueAmount, dueCurrentDate, dueEndDate, duePaid, dueStartDate);
        }
        let obj = {
            creditNo:this.props.creditDue.creditNo,
            customerName: this.props.creditDue.customerName,
            dueAmount: this.props.creditDue.dueAmount,
            dueCurrentDate: this.props.creditDue.dueCurrentDate,
            dueEndDate: this.props.creditDue.dueEndDate,
            duePaid: this.props.creditDue.duePaid,
            dueStartDate: this.props.creditDue.dueStartDate,
            gracePeriod: this.dueForm.get('grace').value,
            payingDueAmount:this.dueForm.get('payingDueAmount').value,
            payingDueDate: this.dueForm.get('payingDueDate').value,
            sendInterest: this.sendInterest,
            parentId:this.props.creditDue.parentId,
        }
        console.log('THE DUE ====>',obj);
        axios.put(`http://localhost:8081/api/credit/${obj.creditNo}/${obj.parentId}`,obj)
            .then(res => {
                console.log(res);
                console.log(res.data);
            })
        this.props.toggle()
    }
    render() {
        return (
            <>
                <FieldGroup
                    control={this.dueForm}
                    render={({value, pristine, invalid, hasError ,handler,  touched}) => (
                        <div style={styles.main}>
                            <form onSubmit={() => this.handleSubmit}>

                            <FieldControl
                name="grace"
                render={NumberInput}
                // Use meta to add some extra props
                meta={{
                    label: "Grace Period",
                    placeholder: "Enter Grace Period",
                    readOnly: false

                }}
            />
                <FieldControl

                    name="payingDueAmount"
                render={NumberInput}
                // Use meta to add some extra props
                meta={{
                label: "Paying Due Amount",
                placeholder: "Enter Paying Due Amount",
                readOnly: false

            }}
                />
                <FieldControl
                    name="payingDueDate"
                    render={DateInput}
                    // Use meta to add some extra props
                    meta={{
                        label: "Paying Due Date",
                        placeholder: "Enter Paying Due Date"
                    }}
                />
                <FieldControl name="interest" meta={{label: "Want To Add Interest?"}} render={Checkbox}/>
                            <div>
                                {/*<Button variant="contained" color="primary" type="submit">Submit</Button>*/}

                    <button
                        style={styles.button}
                         onClick={e => this.handleSubmit(e)}
                        type="submit"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        style={styles.button}
                        onClick={() => this.handleReset()}
                    >
                        Reset
                    </button>
                </div>
                            </form>
                        </div>
                    )}
                />
            </>
        );
    }
}

export default DueForm
