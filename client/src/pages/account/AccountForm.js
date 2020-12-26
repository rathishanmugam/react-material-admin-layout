import React from 'react';
// import { FormControl,InputLabel,Input,FormHelperText } from '@material-ui/core';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';

const api = window.runtimeEnvironment || 'http://localhost:8000';

class AccountForm extends React.Component {
    _isMounted = false;
    state = {
        _id: '',
        accountNo: 0,
        particulars: '',
        credit: 0,
        debit: 0,
        createdOn: '',
        accNo: 0

    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitFormAdd = e => {
        e.preventDefault()
        // const id= Math.max(...this.props.items.map(i => i.id))+1;
        const id = parseInt(this.props.total, 10) + 1
        this.setState({id});
        console.log('the id is', id);
        fetch(`${api}/api/account`, {

            // fetch('http://localhost:8081/api/account', {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // id: Math.max(...this.props.items.map(i => i.id))+1,
                accountNo: this.state.accountNo,
                particulars: this.state.particulars,
                credit: this.state.credit,
                debit: this.state.debit,
                createdOn: new Date().toISOString(),
            })
        })
            .then(response => response.json())
            .then(data => {
                this.setState({data})
                console.log('the saved item', {data});
                this.props.addItemToState(this.state)
                console.log('the saved item', this.state);
                this.props.toggle()

            })
            .catch(err => console.log(err))
    }

    submitFormEdit = e => {
        e.preventDefault()
        let obj = {
            _id: this.state._id,
            accountNo: this.state.accountNo,
            particulars: this.state.particulars,
            credit: this.state.credit,
            debit: this.state.debit,
            createdOn: new Date().toISOString()
        }
        fetch(`${api}/api/account/${this.state._id}`, {

            // fetch('http://localhost:8081/api/account/' + this.state._id, {
            method: 'put',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("access_token")}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accountNo: this.state.accountNo,
                particulars: this.state.particulars,
                credit: this.state.credit,
                debit: this.state.debit,
                createdOn: new Date().toISOString(),
            })
        })
            .then(response => response.json())
            .then(data => {
                this.setState({data})
                this.props.updateState(obj);
                // this.props.items.splice(this.props.items.indexOf(this.state._id), 1, obj);
                // this.setState({snackbaropen: true, snackbarmsg: 'Account Entry updated Sucessfully'});
                // this.getItems()
                console.log('the updated item', {data});
                this.props.toggle()

            })
            .catch(err => console.log(err))
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            // if item exists, populate the state with proper data
            console.log('the item are (account form)====>', this.props.item);
            if (this.props.item) {
                const {_id, accountNo, particulars, credit, debit} = this.props.item
                this.setState({_id, accountNo, particulars, credit, debit})
            } else {
                console.log('iam in else part');
                this.setState({accountNo: this.props.accNo});
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        console.log('the props are in (account form)====>', this.props.accNo);

        return (
            <ValidatorForm
                onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}
                // onError={errors => console.log(errors)}
            >
                <TextValidator
                    label="accountNo"
                    onChange={this.onChange}
                    name="accountNo"
                    value={(this.state.accNo !== undefined || this.state.accountNo === undefined) ? this.state.accountNo : this.state.accountNo}
                    validators={['required']}
                    errorMessages={['Account No field is required']}
                    style={{width: '300px'}}
                />
                <br/>
                <TextValidator
                    label="particulars"
                    onChange={this.onChange}
                    name="particulars"
                    value={this.state.particulars === null ? '' : this.state.particulars}
                    validators={['required']}
                    errorMessages={['Particulars field is required']}
                    style={{width: '300px'}}

                />
                <br/>
                <TextValidator
                    label="credit"
                    onChange={this.onChange}
                    name="credit"
                    value={this.state.credit === null ? '' : this.state.credit}
                    validators={['required']}
                    errorMessages={['this field is required']}
                    style={{width: '300px'}}

                />
                <br/>
                <TextValidator
                    label="debit"
                    onChange={this.onChange}
                    name="debit"
                    value={this.state.debit === null ? '' : this.state.debit}
                    validators={['required']}
                    errorMessages={['this field is required']}
                    style={{width: '300px'}}

                />
                <br/>
                <br/>

                <Button variant="contained" color="primary" type="submit">Submit</Button>
            </ValidatorForm>

        );
    }
}

export default AccountForm
