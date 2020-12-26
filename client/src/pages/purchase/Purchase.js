import * as React from "react";
import {render} from "react-dom";
import {
    FormBuilder,
    AbstractControl,
    Validators,
    FormGroup,
    FormArray,
    FieldGroup,
    FieldControl,
    FieldArray
} from "react-reactive-form";
import Values from "./Values";
import styles from "./styles";

import {
    TextInput,
    Checkbox,
    GenderRadio,
    SelectBox,
    TextArea,
    NumberInput
} from "./components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "@material-ui/core/Snackbar";
import {IconButton} from "@material-ui/core";


export default class Purchase extends React.Component {
    _isMounted = false;
    isAllowed = false;
    isPermitted= false;
    keyCount = 0;
    nxtId = 0;
    accountId = 0;
    obj = {};
    creditors = [];
    product = [];
    total = 0;
    count = 0;
    state = {
        purchase: [],
        creditor: [],
        creditorName: [],
        products: [],
        product: [],
        account: [],
        totalSalesAmt: 0,
        snackbaropen: false,
        snackbarmsg: '',
    }
    SnackbarClose = (event) => {
        this.setState({
            snackbaropen: false,
            snackbarmsg: '',
        });
    };

    openSnackbar = ({message}) => {
        this.setState({open: true, message});
    };
    productForm = FormBuilder.group({
        purchaseBillNo: ["", Validators.required],
        purchaseDate: ["", [Validators.required]],
        productCreditor: ["", [Validators.required]],
        creditorGstIM: ["", [Validators.required]],
        creditorAddress: ["", [Validators.required]],
        creditorPhoneNo: ["", [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]],
        creditorMobileNo: ["", [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]],
        creditorEmail: ["", [Validators.required, Validators.email]],
        itemDescription: FormBuilder.array([])
    });

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
            this.getInitialLoad();
            this.productForm.get('productCreditor').valueChanges
                .subscribe(name => {
                    if(this._isMounted) {
                        console.log('the selected name is====>', name);
                        this.getCreditorDetails(name);
                        // this.productForm.get('creditorEmail').patchValue(`${name} @gfd.com`, {emitEvent: false});
                        // this.productForm.get('creditorEmail').disable({emitEvent: false});
                    }
                });
        }
    }

    getInitialLoad() {
        this._isMounted = true;

        this.getPurchases();
        this.getCreditors();
        this.getProducts();
        this.getMaxAccountNo();

    }


    getMaxAccountNo() {
        fetch('http://localhost:8081/api/accounts')
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {

                    console.log('the response account is ====>', res);
                this.setState({account: res});
                    if (!!this.state.account) {
                        this.accountId = this.getNextAvailableAccount(this.state.account);
                        console.log('the new account id is:', this.accountId);
                    } else {
                        this.accountId = 0;
                    }
                }
            });
    }

    getPurchases() {
        fetch('http://localhost:8081/api/purchase')
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {

                    console.log('the response is ====>', res.docs);
                this.setState({purchase: res.docs});
                    if (!!this.state.purchase) {
                        this.nxtId = this.getNextAvailableID(this.state.purchase);
                        console.log('the new id is:', this.nxtId);
                    } else {
                        this.nxtId = 0;
                    }
                }
                this.productForm.get('purchaseBillNo').patchValue(this.nxtId);
                this.productForm.get('purchaseDate').patchValue(new Date().toLocaleDateString());
                this.productForm.get('purchaseBillNo').disable({emitEvent: false});
                this.productForm.get('purchaseDate').disable({emitEvent: false});

            })
            .catch(err => console.log(err))
        console.log('the purchase data =====>', this.state.purchase);
    }

    getCreditors() {
        fetch('http://localhost:8081/api/creditors')
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {

                    console.log('the response is ====>', res.docs);
                    this.setState({creditor: res});

                    if (!!this.state.creditor) {
                        this.creditors = this.state.creditor;

                    }
                }
            })
            .catch(err => console.log(err))
        console.log('the purchase data =====>', this.state.purchase);
    }

    getCreditorDetails(name) {
        fetch(`http://localhost:8081/api/creditors/${name}`)
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {

                    console.log('the response is ====>', res);
                    this.setState({creditorName: res});
                    if (!!this.state.creditorName) {
                        // this.state.creditorName = this.state.creditor.map(cre => cre.name);
                        this.populateFillterdCreditor(Object.assign({}, this.state.creditorName));

                    }
                }
            })
            .catch(err => console.log(err))
        console.log('the purchase data =====>', this.state.purchase);
    }


    populateFillterdCreditor(cre) {
        console.log('filter customer =========>', JSON.stringify(cre, null, 5));
        let addr = `${cre[0].address.street} , ${cre[0].address.city},${cre[0].address.state},${cre[0].address.zipCode}`;
        console.log('the address is ===============>', addr);
        this.productForm.get('creditorAddress').patchValue(addr);
        this.productForm.get('creditorEmail').patchValue(cre[0].email);
        this.productForm.get('creditorPhoneNo').patchValue(cre[0].phone1);
        this.productForm.get('creditorMobileNo').patchValue(cre[0].mobile1);
        this.productForm.get('creditorGstIM').patchValue(cre[0].gstIM);
        this.productForm.get('creditorAddress').disable({emitEvent: false});
        this.productForm.get('creditorEmail').disable({emitEvent: false});
        this.productForm.get('creditorPhoneNo').disable({emitEvent: false});
        this.productForm.get('creditorMobileNo').disable({emitEvent: false});
        this.productForm.get('creditorGstIM').disable({emitEvent: false});
    }

    getNextAvailableID(purchase) {
        let maxID = 0;
        purchase.forEach(function (element, index, array) {
            if (element.purchaseBillNo) {
                if (element.purchaseBillNo > maxID) {
                    maxID = element.purchaseBillNo;
                }
            }
        });
        console.log('the maxid', maxID);
        return ++maxID;
    }

    getProducts() {
        fetch('http://localhost:8081/api/products')
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {

                    console.log('the response is ====>', res);
                    this.setState({products: res});
                    if (!!this.state.products) {

                    }
                }
            })
            .catch(err => console.log(err))
        console.log('the purchase data =====>', this.state.products);
    }


    updateQuantity(quantity, serial, action) {
        fetch('http://localhost:8081/api/products/' + serial, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity, action
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('the updated item', {data});
                this.setState({snackbaropen: true, snackbarmsg: 'quantity Added Sucessfully'});

            })
            .catch(err => console.log(err))
    }

    addPurchase(index) {
        fetch('http://localhost:8081/api/purchase', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                purchaseBillNo: this.productForm.get('purchaseBillNo').value,
                purchaseDate: new Date().toLocaleDateString(),
                productCreditor: this.productForm.get('productCreditor').value,
                creditorGstIM: this.productForm.get('creditorGstIM').value,
                creditorAddress: this.productForm.get('creditorAddress').value,
                creditorPhoneNo: this.productForm.get('creditorPhoneNo').value,
                creditorMobileNo: this.productForm.get('creditorMobileNo').value,
                creditorEmail: this.productForm.get('creditorEmail').value,
                serialNo: this.productForm.get("itemDescription").controls[index].get('serialNo').value,
                modelNo: this.productForm.get("itemDescription").controls[index].get('modelNo').value,
                HSNCodeNo: this.productForm.get("itemDescription").controls[index].get('HSNCodeNo').value,
                companyName: this.productForm.get("itemDescription").controls[index].get('companyName').value,
                productType: this.productForm.get("itemDescription").controls[index].get('productType').value,
                qty: this.productForm.get("itemDescription").controls[index].get('qty').value,
                productRate: this.productForm.get("itemDescription").controls[index].get('productRate').value,
                gstRate: this.productForm.get("itemDescription").controls[index].get('gstRate').value,
                sgstRate: this.productForm.get("itemDescription").controls[index].get('sgstRate').value,
                totalRate: this.productForm.get("itemDescription").controls[index].get('totalRate').value,
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('the purchase saved item', {data});
                this.setState({snackbaropen: true, snackbarmsg: 'Purchase Loaded Into  Data Base Sucessfully'});

            })
            .catch(err => console.log(err))
    }

    addAccount(index) {
        fetch('http://localhost:8081/api/account', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                accountNo: this.accountId,
                particulars: `${this.productForm.get('productCreditor').value} Purchase billNo ${this.productForm.get('purchaseBillNo').value}`,
                debit: this.productForm.get("itemDescription").controls[index].get('totalRate').value,
                credit: 0,
                createdOn: new Date().toLocaleDateString(),
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('the account saved item', {data});
                this.setState({snackbaropen: true, snackbarmsg: 'Account Loaded Into  Data Base Sucessfully'});

            })
            .catch(err => console.log(err))
    }

    getNextAvailableAccount(account) {
        let maxID = 0;
        account.forEach(function (element, index, array) {
            if (element.accountNo) {
                if (element.accountNo > maxID) {
                    maxID = element.accountNo;
                }
            }
        });
        console.log('the new account maxid', maxID);
        return ++maxID;
    }

    getProduct(code, index) {
        fetch(`http://localhost:8081/api/product/serial/${code}`)
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {

                    this.product = res;
                    console.log('the (response serialno index) is ====>', res, code, index);
                    const obj = (Object.assign({}, res));
                    console.log('the response is ====>', index, obj);
                    this.setState({product: res});
                    this.productForm.get("itemDescription").controls[index].get('modelNo').patchValue(obj[0].modelNo);
                    this.productForm.get("itemDescription").controls[index].get('HSNCodeNo').patchValue(obj[0].HSNCodeNo);
                    this.productForm.get("itemDescription").controls[index].get('companyName').patchValue(obj[0].companyName);
                    this.productForm.get("itemDescription").controls[index].get('productType').patchValue(obj[0].productType);
                    // this.productForm.get("itemDescription").controls[index].get('qty').patchValue(this.obj[0].qty);
                    this.productForm.get("itemDescription").controls[index].get('productRate').patchValue(obj[0].rate);
                    this.productForm.get("itemDescription").controls[index].get('gstRate').patchValue(obj[0].gstRate);
                    this.productForm.get("itemDescription").controls[index].get('sgstRate').patchValue(obj[0].sgstRate);
                }
            })
            .catch(err => console.log(err))
    }

    // Creates the unique keys
    getKey = () => {
        return this.keyCount++;
    };

    // Adds an item in Form Array
    addItem(index) {
        if (this._isMounted) {
            if (index === 0) {
                console.log('iam in index zero', this.productForm.get('productCreditor').value);
                if (this.productForm.get('productCreditor').value === '') {
                    console.log('iam in undefined ');
                    this.setState({snackbaropen: true, snackbarmsg: 'Select productCreditor Name '});
                } else if (this.productForm.get('productCreditor').value !== '') {
                    this.isAllowed = true;
                }
            }
            if(this.isAllowed) {
                const itemsControl = this.productForm.get("itemDescription");
                itemsControl.push(this.createItem());
                for (let val of itemsControl.controls) {
                    // itemsControl.controls[0].get('serialNo').valueChanges.subscribe(
                    val.get('serialNo').valueChanges.subscribe(
                        value => {
                            if (this._isMounted) {
                                this.productForm.get("itemDescription").controls[index].get('qty').patchValue('');
                                this.productForm.get("itemDescription").controls[index].get('sendStock').patchValue('');

                                if (value) {
                                    this.getProduct(value, index);
                                }
                            }
                        })
                    val.get('qty').valueChanges.subscribe(
                        value => {
                            if (this._isMounted) {
                                this.productForm.get("itemDescription").controls[index].get('sendStock').patchValue('');

                                if (this.productForm.get("itemDescription").controls[index].get('serialNo').value === '') {
                                    this.setState({snackbaropen: true, snackbarmsg: 'Select Serial No '});

                                } else if (this.productForm.get("itemDescription").controls[index].get('serialNo').value !== '') {

                                    this.isPermitted = true;
                                }
                                if (this.isPermitted) {
                                    if (value) {
                                        let total = 0;
                                        const arr = (Object.assign({}, this.product));
                                        console.log('the nxt rate =======>', arr[0].rate, arr[0].gstRate, arr[0].sgstRate, val.get('qty').value);
                                        console.log('the tot tax with amt =======>', (arr[0].rate * arr[0].gstRate) / 100);
                                        total = val.get('qty').value * ((arr[0].rate * arr[0].gstRate) / 100 + arr[0].rate + (arr[0].rate * arr[0].sgstRate) / 100);
                                        console.log('the total amt(final) =====>', total);

                                        this.productForm.get("itemDescription").controls[index].get('totalRate').patchValue(total);
                                    }
                                }
                            }
                        })
                    val.get('sendStock').valueChanges.subscribe(
                        value => {
                            if (this._isMounted) {
                                if (!!this.productForm.get("itemDescription").controls[index].get('qty').value &&
                                    !!this.productForm.get("itemDescription").controls[index].get('serialNo').value && value === true) {

                                    this.addStock(index);
                                    this.productForm.get("itemDescription").controls[index].get('sendStock').disable({emitEvent: false});
                                } else {
                                    this.setState({snackbaropen: true, snackbarmsg: 'Make Sure SerialNo and Qty Has Selected'});
                                    // this.productForm.get("itemDescription").controls[index].get('senStock').setValue(true)
                                }
                            }
                        });
                }
            }
        }
    }

    componentWillUnmount() {
        console.log('iam in unmount');
        this._isMounted = false;
        this.productForm.reset();
        this.productForm.get('productCreditor').valueChanges.unsubscribe();
        const itemsControl = this.productForm.get("itemDescription");
        for (let val of itemsControl.controls) {
            val.get('serialNo').valueChanges.unsubscribe();
            val.get('sendStock').valueChanges.unsubscribe();
            val.get('qty').valueChanges.unsubscribe();
        }
    }

    // Removes an item
    removeItem(index) {
        const itemsControl = this.productForm.get("itemDescription");
        itemsControl.removeAt(index);
    }

    createItem() {
        const control = FormBuilder.group({
            serialNo: ["", Validators.required],
            modelNo: ["", Validators.required],
            HSNCodeNo: ["", Validators.required],
            companyName: ["", Validators.required],
            productType: ["", Validators.required],
            qty: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            productRate: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            gstRate: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            sgstRate: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            totalRate: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            sendStock: ["", Validators.required],
        });
        this.count = this.count +1;
        // Adding key
        control.meta = {
            key: this.getKey()
        };
        return control;
    }

    handleSubmit(e) {
        e.preventDefault();
        alert(`You submitted \n ${JSON.stringify(this.productForm.value, 0, 2)}`);
    }

    handleReset() {
        this._isMounted = false;
        console.log('mounted flag',this._isMounted);
        if(this._isMounted === false) {
            this.productForm.reset();
            for(let i = 0 ; i <= this.count; i++){
            this.productForm.get('itemDescription').controls.pop(i);
             }
             this.getInitialLoad()
        }
    }

    addStock(index) {
        const quantity = this.productForm.get("itemDescription").controls[index].get('qty').value;
        const serial = this.productForm.get("itemDescription").controls[index].get('serialNo').value;
        const obj = {
            purchaseBillNo: this.productForm.get('purchaseBillNo').value,
            purchaseDate: new Date().toLocaleDateString(),
            productCreditor: this.productForm.get('productCreditor').value,
            creditorGstIM: this.productForm.get('creditorGstIM').value,
            creditorAddress: this.productForm.get('creditorAddress').value,
            creditorPhoneNo: this.productForm.get('creditorPhoneNo').value,
            creditorMobileNo: this.productForm.get('creditorMobileNo').value,
            creditorEmail: this.productForm.get('creditorEmail').value,
            serialNo: this.productForm.get("itemDescription").controls[index].get('serialNo').value,
            modelNo: this.productForm.get("itemDescription").controls[index].get('modelNo').value,
            HSNCodeNo: this.productForm.get("itemDescription").controls[index].get('HSNCodeNo').value,
            companyName: this.productForm.get("itemDescription").controls[index].get('companyName').value,
            productType: this.productForm.get("itemDescription").controls[index].get('productType').value,
            qty: this.productForm.get("itemDescription").controls[index].get('qty').value,
            productRate: this.productForm.get("itemDescription").controls[index].get('productRate').value,
            gstRate: this.productForm.get("itemDescription").controls[index].get('gstRate').value,
            sgstRate: this.productForm.get("itemDescription").controls[index].get('sgstRate').value,
            totalRate: this.productForm.get("itemDescription").controls[index].get('totalRate').value,
        };
        const acc = {
            accountNo: 1,
            particulars: `${this.productForm.get('productCreditor').value} Purchase billNo ${this.productForm.get('purchaseBillNo').value}`,
            debit: this.productForm.get("itemDescription").controls[index].get('totalRate').value,
            credit: 0,
            createdOn: new Date().toLocaleDateString(),
        };
        console.log('the object created ========>', obj);
        console.log('the account object created ========>', acc);

        const action = 'add';
        this.state.totalSalesAmt += parseInt(this.productForm.get("itemDescription").controls[index].get('totalRate').value, 10);
        this.updateQuantity(quantity, serial, action);
        this.addPurchase(index);
        this.addAccount(index);
    }

    render() {
        return (
            <Card style={{maxWidth: 1000, marginLeft: 20}}>
                {/*<CardActionArea>*/}
                <CardContent>
                    <Snackbar
                        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                        message={<span id='message-id'>{this.state.snackbarmsg}</span>}
                        autoHideDuration={3000}
                        onClose={this.SnackbarClose}
                        open={this.state.snackbaropen}
                        ContentProps={{
                            'aria-describedby': 'snackbar-message-id',
                        }}
                        action={[
                            <IconButton
                                key="close"
                                aria-label="close"
                                color='inherit'
                                onClick={this.SnackbarClose}
                            > x </IconButton>
                        ]}
                    />
                    <FieldGroup
                        control={this.productForm}
                        render={({value, pristine, invalid}) => (
                            <div style={styles.main}>
                                <h2> Purchase Form</h2>
                                <form onSubmit={() => this.handleSubmit}>
                                    <FieldControl
                                        name="purchaseBillNo"
                                        render={TextInput}
                                        // Use meta to add some extra props
                                        meta={{
                                            label: "purchaseBillNo",
                                            placeholder: "Enter purchaseBillNo"
                                        }}
                                    />

                                    <FieldControl
                                        name="purchaseDate"
                                        render={TextInput}
                                        // Use meta to add some extra props
                                        meta={{
                                            label: "purchaseDate",
                                            placeholder: "Enter purchaseDate"
                                        }}
                                    />

                                    <FieldControl
                                        name="productCreditor"
                                        render={({
                                                     handler,
                                                     pending,
                                                     touched,
                                                     hasError
                                                 }) => (
                                            <div>
                                                <label>productCreditor:</label>
                                                <select style={styles.input} {...handler()}
                                                        options={this.state.creditor}
                                                >
                                                    <option value="" disabled>
                                                        Select
                                                    </option>
                                                    {this.state.creditor.map(creditor => (
                                                        <option key={creditor.name}>{creditor.name}</option>))}

                                                </select>
                                                {pending && <i className="fa fa-spinner fa-spin"/>}
                                                <div>
                      <span style={styles.error}>
                        {touched &&
                        hasError("required") &&
                        "productCreditor name is required"}
                      </span>
                                                </div>
                                            </div>
                                        )}
                                    />

                                    <FieldControl
                                        name="creditorGstIM"
                                        render={TextInput}
                                        // Use meta to add some extra props
                                        meta={{
                                            label: "creditorGstIM",
                                            placeholder: "Enter creditorGstIM"
                                        }}
                                    />

                                    <FieldControl
                                        name="creditorAddress"
                                        render={TextInput}
                                        // Use meta to add some extra props
                                        meta={{
                                            label: "creditorAddress",
                                            placeholder: "Enter creditorAddress"
                                        }}
                                    />

                                    <FieldControl
                                        name="creditorPhoneNo"
                                        render={TextInput}
                                        // Use meta to add some extra props
                                        meta={{
                                            label: "creditorPhoneNo",
                                            placeholder: "Enter creditorPhoneNo"
                                        }}
                                    />

                                    <FieldControl
                                        name="creditorMobileNo"
                                        render={TextInput}
                                        // Use meta to add some extra props
                                        meta={{
                                            label: "creditorMobileNo",
                                            placeholder: "Enter creditorMobileNo"
                                        }}
                                    />

                                    <FieldControl
                                        name="creditorEmail"
                                        render={TextInput}
                                        // Use meta to add some extra props
                                        meta={{
                                            label: "creditorEmail",
                                            placeholder: "Enter creditorEmail"
                                        }}
                                    />


                                    <FieldArray
                                        name="itemDescription"
                                        render={({controls}) => (
                                            <div>
                                                <div>
                                                    <button
                                                        type="button"
                                                        style={styles.button}
                                                        onClick={() => this.addItem(0)}
                                                    >
                                                        {" "}
                                                        Add Item
                                                    </button>
                                                </div>
                                                <h2>{controls.length ? "Item Descriptions:" : null}</h2>
                                                {controls.map((productControl, index) => (
                                                    <div key={`${productControl.meta.key}-${String(index)}`}>
                                                        <FieldGroup
                                                            control={productControl}
                                                            render={() => (
                                                                <div>

                                                                    <FieldControl
                                                                        name="serialNo"
                                                                        render={({handler}) => (
                                                                            <div>
                                                                                <label>serialNo:</label>
                                                                                <select
                                                                                    style={styles.input} {...handler()}
                                                                                    options={this.state.products}
                                                                                >
                                                                                    <option value="" disabled>
                                                                                        Select
                                                                                    </option>
                                                                                    {this.state.products.map(product => (
                                                                                        <option
                                                                                            key={product.serialNo}>{product.serialNo}</option>))}

                                                                                </select>

                                                                            </div>
                                                                        )}
                                                                    />

                                                                    <FieldControl
                                                                        name="modelNo"
                                                                        render={TextInput}
                                                                        // Use meta to add some extra props
                                                                        meta={{
                                                                            label: "modelNo",
                                                                            placeholder: "Enter modelNo"
                                                                        }}
                                                                    />

                                                                    <FieldControl
                                                                        name="HSNCodeNo"
                                                                        render={TextInput}
                                                                        // Use meta to add some extra props
                                                                        meta={{
                                                                            label: "HSNCodeNo",
                                                                            placeholder: "Enter HSNCodeNo"
                                                                        }}
                                                                    />

                                                                    <FieldControl
                                                                        name="companyName"
                                                                        render={TextInput}
                                                                        // Use meta to add some extra props
                                                                        meta={{
                                                                            label: "companyName",
                                                                            placeholder: "Enter companyName"
                                                                        }}
                                                                    />

                                                                    <FieldControl
                                                                        name="productType"
                                                                        render={TextInput}
                                                                        // Use meta to add some extra props
                                                                        meta={{
                                                                            label: "productType",
                                                                            placeholder: "Enter productType"
                                                                        }}
                                                                    />

                                                                    <FieldControl
                                                                        name="qty"
                                                                        render={NumberInput}
                                                                        // Use meta to add some extra props
                                                                        meta={{
                                                                            label: "qty",
                                                                            placeholder: "Enter qty"
                                                                        }}
                                                                    />

                                                                    <FieldControl
                                                                        name="productRate"
                                                                        render={NumberInput}
                                                                        // Use meta to add some extra props
                                                                        meta={{
                                                                            label: "productRate",
                                                                            placeholder: "Enter productRate"
                                                                        }}
                                                                    />

                                                                    <FieldControl
                                                                        name="gstRate"
                                                                        render={NumberInput}
                                                                        // Use meta to add some extra props
                                                                        meta={{
                                                                            label: "gstRate",
                                                                            placeholder: "Enter gstRate"
                                                                        }}
                                                                    />

                                                                    <FieldControl
                                                                        name="sgstRate"
                                                                        render={NumberInput}
                                                                        // Use meta to add some extra props
                                                                        meta={{
                                                                            label: "sgstRate",
                                                                            placeholder: "Enter sgstRate"
                                                                        }}
                                                                    />

                                                                    <FieldControl
                                                                        name="totalRate"
                                                                        render={NumberInput}
                                                                        // Use meta to add some extra props
                                                                        meta={{
                                                                            label: "totalRate",
                                                                            placeholder: "Enter totalRate"
                                                                        }}
                                                                    />

                                                                    <FieldControl name="sendStock" render={Checkbox}/>
                                                                    {/*<button*/}
                                                                    {/*    type="button"*/}
                                                                    {/*    style={styles.button}*/}
                                                                    {/*    onClick={() => this.addStock(index)}*/}
                                                                    {/*>*/}
                                                                    {/*    {" "}*/}
                                                                    {/*    Add Me To Stock*/}
                                                                    {/*</button>*/}
                                                                    <div>
                                                                        <button
                                                                            disabled={this.productForm.get("itemDescription").controls[index].get('sendStock').value == false && this.productForm.pristine || this.productForm.invalid}

                                                                            type="button"
                                                                            style={styles.button}
                                                                            onClick={() => this.addItem(index + 1)}
                                                                        >
                                                                            {" "}
                                                                            Add More Product
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            style={styles.buttonDanger}
                                                                            onClick={() => this.removeItem(index)}
                                                                        >
                                                                            {" "}
                                                                            Remove Product
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    />
                                    <div>
                                        <button
                                            disabled={this.productForm.pristine || this.productForm.invalid}
                                            style={styles.button}
                                            // onClick={e => this.handleSubmit(e)}
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
                                    {JSON.stringify(value, 0, 2)}
                                    {/*<Values value={value}/>*/}
                                </form>
                            </div>
                        )}
                    />
                </CardContent>
            </Card>
        );
    }
}

