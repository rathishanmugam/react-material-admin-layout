import React from 'react';
// import { FormControl,InputLabel,Input,FormHelperText } from '@material-ui/core';
import {ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Button from '@material-ui/core/Button';
const styles = {
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        width: 300,
        margin: 100,
    },
//style for font size
    resize:{
        fontSize:50
    },
}
class ProductForm extends React.Component {
    _isMounted = false;
    state = {
        _id: '',
        serialNo: '',
        modelNo: '',
        HSNCodeNo: '',
        productType: '',
        companyName: '',
        qty: '',
        rate: '',
        gstRate: '',
        sgstRate: ''

    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    submitFormAdd = e => {
        e.preventDefault()
        // const id= Math.max(...this.props.items.map(i => i.id))+1;
        // const id = parseInt(this.props.total,10)+1
        // this.setState({id});
        // console.log('the id is',id);
        fetch('http://localhost:8081/api/product', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                serialNo: this.state.serialNo,
                modelNo: this.state.modelNo,
                HSNCodeNo: this.state.HSNCodeNo,
                productType: this.state.productType,
                companyName: this.state.companyName,
                qty: this.state.qty,
                rate: this.state.rate,
                gstRate: this.state.gstRate,
                sgstRate: this.state.sgstRate,
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
            serialNo: this.state.serialNo,
            modelNo: this.state.modelNo,
            HSNCodeNo: this.state.HSNCodeNo,
            productType: this.state.productType,
            companyName: this.state.companyName,
            qty: this.state.qty,
            rate: this.state.rate,
            gstRate: this.state.gstRate,
            sgstRate: this.state.sgstRate,
        }
        fetch('http://localhost:8081/api/product/' + this.state._id, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                serialNo: this.state.serialNo,
                modelNo: this.state.modelNo,
                HSNCodeNo: this.state.HSNCodeNo,
                productType: this.state.productType,
                companyName: this.state.companyName,
                qty: this.state.qty,
                rate: this.state.rate,
                gstRate: this.state.gstRate,
                sgstRate: this.state.sgstRate,
            })
        })
            .then(response => response.json())
            .then(data => {
                this.setState({data})
                this.props.updateState(obj);
                console.log('the updated item', {data});
                this.props.toggle()

            })
            .catch(err => console.log(err))
    }

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            if (this.props.item) {
                const {_id, serialNo, modelNo, HSNCodeNo, productType,companyName,qty,rate,gstRate,sgstRate} = this.props.item
                this.setState({_id, serialNo, modelNo, HSNCodeNo, productType,companyName,qty,rate,gstRate,sgstRate})
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        return (
            <ValidatorForm
                onSubmit={this.props.item ? this.submitFormEdit : this.submitFormAdd}
                // onError={errors => console.log(errors)}
            >
                <TextValidator
                    label="serialNo"
                    type="text"
                    onChange={this.onChange}
                    name="serialNo"
                    value={this.state.serialNo === null ? '' : this.state.serialNo}
                    validators={['required']}
                    errorMessages={['serial No field is required']}
                    style={{marginRight: '25px',width: '260px' }}

                />

                <TextValidator
                    label="modelNo"
                    type="text"
                    onChange={this.onChange}
                    name="modelNo"
                    value={this.state.modelNo === null ? '' : this.state.modelNo}
                    validators={['required']}
                    errorMessages={['model no field is required']}
                    style={{width: '265px' }}

                />
                <br/>
                <TextValidator
                    label="HSNCodeNo"
                    type="text"
                    onChange={this.onChange}
                    name="HSNCodeNo"
                    value={this.state.HSNCodeNo === null ? '' : this.state.HSNCodeNo}
                    validators={['required']}
                    errorMessages={['this HSNCodeNo field is required']}
                    style={{marginRight: '25px' ,width: '260px'}}
                />

                <TextValidator
                    type="text"
                    label="companyName"
                    onChange={this.onChange}
                    name="companyName"
                    value={this.state.companyName === null ? '' : this.state.companyName}
                    validators={['required']}
                    errorMessages={['this companyName field is required']}
                    style={{width: '260px' }}
                />
                <br/>
                <TextValidator
                    type="text"
                    label="productType"
                    onChange={this.onChange}
                    name="productType"
                    value={this.state.productType === null ? '' : this.state.productType}
                    validators={['required']}
                    errorMessages={['this productType field is required']}
                    style={{marginRight: '25px',width: '260px' }}
                />

                <TextValidator
                    type="number"
                    label="qty"
                    onChange={this.onChange}
                    name="qty"
                    value={this.state.qty === null ? '' : this.state.qty}
                    validators={[ 'required']}
                    errorMessages={['this qty field is required']}
                    style={{width: '260px' }}

                />
                <br/>
                <TextValidator
                    label="rate"
                    type="number"
                    width ='500px'
                    onChange={this.onChange}
                    name="rate"
                    value={this.state.rate === null ? '' : this.state.rate}
                    validators={['required']}
                    errorMessages={['this rate field is required']}
                    style={{marginRight: '25px',width: '260px' }}
                />

                <TextValidator
                    label="gstRate"
                    type="number"
                    onChange={this.onChange}
                    name="gstRate"
                    value={this.state.gstRate === null ? '' : this.state.gstRate}
                    validators={['required']}
                    errorMessages={['this gstRate field is required']}
                    style={{width: '260px' }}

                />
                <br/>
                <TextValidator
                    label="sgstRate"
                    type="number"
                    onChange={this.onChange}
                    name="sgstRate"
                    value={this.state.sgstRate === null ? '' : this.state.sgstRate}
                    validators={['required']}
                    errorMessages={['this sgstRate field is required']}
                    style={{width: '260px' }}

                />
                <br/>
                <br/>
                <Button variant="contained" color="primary" type="submit">Submit</Button>
            </ValidatorForm>

        );
    }
}

export default ProductForm
