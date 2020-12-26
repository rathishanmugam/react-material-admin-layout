import React from 'react';
// import { FormControl,InputLabel,Input,FormHelperText } from '@material-ui/core';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
import {FieldControl, FieldGroup, FormBuilder, Validators} from "react-reactive-form";
import styles from "../sales/styles";
import {
    TextInput,
    Checkbox,
    BillTypeRadio,
    SelectBox,
    TextArea,
    NumberInput,
    loanTenureRadio,
    DateInput
} from "./components";
import axios, * as others from 'axios';

class CustomerForm extends React.Component {
    _isMounted = false;
    addressId = "";
    error = '';
    productForm = FormBuilder.group({
        name: ["", [Validators.required]],

        address: FormBuilder.group({

            street: ["", [Validators.required]],
            city: ["", [Validators.required]],
            state: ["", [Validators.required]],
            zipCode: ["", [Validators.required]],
        }),
        email: ['', [Validators.required, Validators.email]],
        phone1: ["", [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]],
        phone2: ["", [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]],
        mobile1: ["", [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]],
        mobile2: ["", [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]],

    });

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.productForm.get('name').valueChanges
                .subscribe(value => {
                    this.error = this.productForm.get('name').value ? null : 'Enter Name';
                });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    submitFormAdd = e => {
        e.preventDefault();
        console.log('the saving record is ======>', `${JSON.stringify(this.productForm.value, 0, 2)}`);
        // alert(`You submitted \n ${JSON.stringify(this.productForm.value, 0, 2)}`);
        const obj = {...this.productForm.value};
        const array = [];
        axios.post(`http://localhost:8081/api/customer`, obj)
            .then(res => {
                console.log(res);
                console.log(res.data);
                console.log('the  sales saved item', res.data);
                this.props.addItemToState(res.data)
                this.props.toggle();
            })
    }
    submitFormEdit = e => {
        e.preventDefault();
        console.log('the saving record is ======>', `${JSON.stringify(this.productForm.value, 0, 2)}`);
        // alert(`You submitted \n ${JSON.stringify(this.productForm.value, 0, 2)}, ${this.addressId}`);
        const obj = {...this.productForm.value};
        const array = [];
        axios.put(`http://localhost:8081/api/customer/${this.addressId}/${this.props.item._id}`, obj)
            .then(res => {
                console.log(res);
                console.log(res.data);
                console.log('the  sales saved item', res.data);
                this.props.updateState(obj);
                this.props.toggle();
            })
    }

    handleReset() {
        this._isMounted = false;
        console.log('mounted flag', this._isMounted);
        if (this._isMounted === false) {
            this.productForm.reset();
            this.error = '';
        }
    }

    render() {
        if (this.props.item) {
            this.productForm.get('name').patchValue(this.props.item.name);
            this.productForm.controls.address.get('street').patchValue(this.props.item.address.street);
            this.productForm.controls.address.get('city').patchValue(this.props.item.address.city);
            this.productForm.controls.address.get('state').patchValue(this.props.item.address.state);
            this.productForm.controls.address.get('zipCode').patchValue(this.props.item.address.zipCode);
            this.productForm.get('phone1').patchValue(this.props.item.phone1);
            this.productForm.get('phone2').patchValue(this.props.item.phone2);
            this.productForm.get('mobile1').patchValue(this.props.item.mobile1);
            this.productForm.get('mobile2').patchValue(this.props.item.mobile2);
            this.productForm.get('email').patchValue(this.props.item.email);
            this.addressId = this.props.item.address._id;
        }
        return (
            <>
                <FieldGroup
                    control={this.productForm}
                    render={({value, pristine, invalid, hasError, handler, touched}) => (
                        <div style={styles.main}>
                            <form onSubmit={() => this.props.item ? this.submitFormEdit : this.submitFormAdd}>

                                <FieldControl
                                    name="name"
                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>Name:</label>
                                            <input style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                      <span style={styles.error}>
                        {(touched &&
                            (hasError("required") && "Name is required"))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />

                                <br/>
                                <FieldControl
                                    name="address.street"
                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>Street:</label>
                                            <input style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                      <span style={styles.error}>
                        {(touched &&
                            (hasError("required") && "street is required"))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />
                                <br/>
                                <FieldControl
                                    name="address.city"
                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>City:</label>
                                            <input style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                      <span style={styles.error}>
                        {(touched &&
                            (hasError("required") && "city is required"))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />
                                <br/>
                                <FieldControl
                                    name="address.state"
                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>State:</label>
                                            <input style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                      <span style={styles.error}>
                        {(touched &&
                            (hasError("required") && "state is required"))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />

                                <br/>
                                <FieldControl
                                    name="address.zipCode"
                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>ZipCode:</label>
                                            <input style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                      <span style={styles.error}>
                        {(touched &&
                            (hasError("required") && "ZipCode is required"))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />
                                <br/>
                                <FieldControl
                                    name="email"
                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>Email:</label>
                                            <input style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                      <span style={styles.error}>
                        {(touched &&
                            ((hasError("required") && "Email is required") ||
                                (hasError("email") &&
                                    "Please enter a valid email")))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />
                                <br/>
                                <FieldControl
                                    name="phone1"

                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>Phone1:</label>
                                            <input placeholder="xxx-xxx-xxxx" style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                       <span style={styles.error}>
                        {(touched &&
                            ((hasError("required") && "Phone1 is required") ||
                                (hasError("pattern") &&
                                    "Please enter a valid pattern")))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />
                                <br/>
                                <FieldControl
                                    name="phone2"

                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>Phone2:</label>
                                            <input placeholder="xxx-xxx-xxxx" style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                      <span style={styles.error}>
                        {(touched &&
                            ((hasError("required") && "Phone2 is required") ||
                                (hasError("pattern") &&
                                    "Please enter a valid pattern")))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />
                                <br/>
                                <FieldControl
                                    name="mobile1"

                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>Mobile1:</label>
                                            <input placeholder="xxx-xxx-xxxx" style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                       <span style={styles.error}>
                        {(touched &&
                            ((hasError("required") && "Mobile1 is required") ||
                                (hasError("pattern") &&
                                    "Please enter a valid pattern")))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />
                                <br/>
                                <FieldControl
                                    name="mobile2"

                                    render={({
                                                 handler,
                                                 pending,
                                                 touched,
                                                 hasError
                                             }) => (
                                        <div>
                                            <label>Mobile2:</label>
                                            <input placeholder="xxx-xxx-xxxx" style={styles.input} {...handler()} />
                                            {pending && <i className="fa fa-spinner fa-spin"/>}
                                            <div>
                       <span style={styles.error}>
                        {(touched &&
                            ((hasError("required") && "mobile2 is required") ||
                                (hasError("pattern") &&
                                    "Please enter a valid pattern")))}
                      </span>
                                            </div>
                                        </div>
                                    )}
                                />
                                <br/>
                                <div>
                                    {/*<Button variant="contained" color="primary" type="submit">Submit</Button>*/}

                                    <button
                                        disabled={!this.productForm.valid}
                                        style={styles.button}
                                        onClick={e => this.props.item ? this.submitFormEdit(e) : this.submitFormAdd(e)}
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

export default CustomerForm
