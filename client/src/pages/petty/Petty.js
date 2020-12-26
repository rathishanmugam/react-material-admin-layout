import * as React from "react";
import axios from 'axios';

import {
    FormBuilder,
    Validators,
    FieldGroup,
    FieldControl,
    FieldArray
} from "react-reactive-form";
import Values from "./Values";
import styles from "./styles";

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
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Snackbar from "@material-ui/core/Snackbar";
import {IconButton} from "@material-ui/core";


export default class Icons extends React.Component {
    _isMounted = false;
    keyCount = 0;
    nxtId = 0;
    accountId = 0;
    creditId = 0;
    obj = {};
    customers = [];
    product = [];
    total = 0;
    count = 0;
    type = '';
    tenure = '';
    div = '';
    span = '';
    id = '';
    totalSalesAmt = 0;
    filteredCustomer = '';
    loanAmount = 0;
    loanTenure = '';
    state = {
        sales: [],
        products: [],
        product: [],
        account: [],
        snackbaropen: false,
        snackbarmsg: '',
        productts:[],
        serials:[]
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
        billNo: ["", [Validators.required, Validators.pattern('[0-9].*')]],
        salesDate: ["", [Validators.required]],
        products: FormBuilder.array([]),
        totalNetAmount: ["", [Validators.required, Validators.pattern('[0-9].*')]],
    });

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getInitialLoad();
        }
    }

    getInitialLoad() {
        this._isMounted = true;
        this.getPettySales();
        this.getProducts();
        this.getMaxAccountNo();
        this.getPettyProducts();
    }

    getPettyProducts() {
        fetch('http://localhost:8081/api/products/petty')
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {
                    this.setState({productts:res});
                    this.setState({serials : res.map(prod => prod.serialNo)});
                    // this.serials[0] = 'SELECT';
                    console.log('fetched serial number is ===-====>', this.state.serials);

                    console.log('fetched serial number is ===-====>', res);
                }
            });
    }
        getMaxAccountNo()
        {
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

        getPettySales()
        {
            fetch('http://localhost:8081/api/petty')
                .then(response => response.json())
                .then(res => {
                    if (this._isMounted) {

                        console.log('the petty sales response is ====>', res);
                        this.setState({sales: res});
                        if (!!this.state.sales) {
                            this.nxtId = this.getNextAvailableID(this.state.sales);
                            console.log('the new id is:', this.nxtId);
                        } else {
                            this.nxtId = 0;
                        }
                    }
                    this.productForm.get('billNo').patchValue(this.nxtId);
                    this.productForm.get('salesDate').patchValue(new Date().toLocaleDateString());
                    // this.productForm.get('billNo').disable({emitEvent: false ,onlySelf: true});
                    // this.productForm.get('salesDate').disable({emitEvent: false});

                })
                .catch(err => console.log(err))
            console.log('the sales data =====>', this.state.sales);
        }

        getNextAvailableID(purchase)
        {
            let maxID = 0;
            purchase.forEach(function (element, index, array) {
                if (element.billNo) {
                    if (element.billNo > maxID) {
                        maxID = element.billNo;
                    }
                }
            });
            console.log('the maxid', maxID);
            return ++maxID;
        }

        getProducts()
        {
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


        updateQuantity(quantity, serial, action)
        {
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
                    this.setState({snackbaropen: true, snackbarmsg: 'quantity Reduced Sucessfully'});

                })
                .catch(err => console.log(err))
        }

        addSale(body)
        {
            axios.post(`http://localhost:8081/api/petty`, body)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    console.log('the  sales saved item', res.data);
                    this.setState({snackbaropen: true, snackbarmsg: ' Sales Loaded Into  Data Base Sucessfully'});

                })
        }


        addAccount(body)
        {
            axios.post(`http://localhost:8081/api/account`, body)
                .then(res => {
                    console.log(res);
                    console.log(res.data);
                    console.log('the credit sales saved item', res.data);
                    this.setState({snackbaropen: true, snackbarmsg: 'Credit Sales Loaded Into  Data Base Sucessfully'});

                })

                .catch(err => console.log(err))
        }

        getNextAvailableAccount(account)
        {
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

        getProduct(code, index)
        {
            fetch(`http://localhost:8081/api/product/serial/${code}`)
                .then(response => response.json())
                .then(res => {
                    if (this._isMounted) {

                        this.product = res;
                        this.setState({product: res});
                        console.log('the (response serialno index) is ====>', res, code, index);

                        const obj = (Object.assign({}, res));

                        console.log('the selected product qty is =====>', obj[0]);

                        if (obj[0].qty <= 0) {
                            this.setState({snackbaropen: true, snackbarmsg: 'Qty Is Zero'});

                        } else if (obj[0].qty <= 5) {
                            this.setState({snackbaropen: true, snackbarmsg: `Only ${obj[0].qty} is Left.Order Soon `});

                            this.productForm.get("products").controls[index].get('modelNo').patchValue(obj[0].modelNo);
                            this.productForm.get("products").controls[index].get('companyName').patchValue(obj[0].companyName);
                            this.productForm.get("products").controls[index].get('HSNCodeNo').patchValue(obj[0].HSNCodeNo);

                            this.productForm.get("products").controls[index].get('productType').patchValue(obj[0].productType);
                            this.productForm.get("products").controls[index].get('productRate').patchValue(obj[0].rate);
                            this.productForm.get("products").controls[index].get('gstRate').patchValue(obj[0].gstRate);
                            this.productForm.get("products").controls[index].get('sgstRate').patchValue(obj[0].sgstRate);

                        } else {
                            this.productForm.get("products").controls[index].get('modelNo').patchValue(obj[0].modelNo);
                            this.productForm.get("products").controls[index].get('companyName').patchValue(obj[0].companyName);
                            this.productForm.get("products").controls[index].get('HSNCodeNo').patchValue(obj[0].HSNCodeNo);

                            this.productForm.get("products").controls[index].get('productType').patchValue(obj[0].productType);
                            this.productForm.get("products").controls[index].get('productRate').patchValue(obj[0].rate);
                            this.productForm.get("products").controls[index].get('gstRate').patchValue(obj[0].gstRate);
                            this.productForm.get("products").controls[index].get('sgstRate').patchValue(obj[0].sgstRate);

                        }
                    }
                })
                .catch(err => console.log(err))
        }

// Creates the unique keys
        getKey = () => {
            return this.keyCount++;
        };

// Adds an item in Form Array
        addItem(index)
        {
            if (this._isMounted) {
                const itemsControl = this.productForm.get("products");
                itemsControl.push(this.createItem());
                for (let val of itemsControl.controls) {
                    // itemsControl.controls[0].get('serialNo').valueChanges.subscribe(
                    val.get('serialNo').valueChanges.subscribe(
                        value => {
                            if (this._isMounted) {
                                this.productForm.get("products").controls[index].get('qty').patchValue('');

                                if (value) {
                                    this.getProduct(value, index);
                                }
                            }
                        })
                    val.get('qty').valueChanges.subscribe(
                        value => {
                            if (this._isMounted) {
                                if (this.productForm.get("products").controls[index].get('serialNo').value === '') {
                                    this.setState({snackbaropen: true, snackbarmsg: 'Select Serial No '});

                                } else if (this.productForm.get("products").controls[index].get('serialNo').value !== '') {

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
                                        this.productForm.get("products").controls[index].get('totalRate').patchValue(total);
                                        if (!value) {
                                            this.productForm.get("products").controls[index].get('reduceStock').patchValue('false', {emitEvent: false});
                                        }
                                    }
                                }
                            }
                        })
                    val.get('reduceStock').valueChanges.subscribe(
                        value => {
                            if (this._isMounted) {
                                if (!!this.productForm.get("products").controls[index].get('qty').value) {

                                    this.reduceStock(index);

                                    this.productForm.get("products").controls[index].get('reduceStock').disable({emitEvent: false});
                                } else {
                                    this.setState({snackbaropen: true, snackbarmsg: 'Select Qty'});
                                    this.productForm.get("products").controls[index].get('reduceStock').patchValue(false, {emitEvent: false});
                                }
                            }
                        });
                }
            }
        }

        componentWillUnmount()
        {
            console.log('iam in unmount');
            this._isMounted = false;
            this.productForm.reset();
            // this.productForm.get('productCreditor').valueChanges.unsubscribe();
            const itemsControl = this.productForm.get("products");
            for (let val of itemsControl.controls) {
                val.get('serialNo').valueChanges.unsubscribe();
                val.get('reduceStock').valueChanges.unsubscribe();
                val.get('qty').valueChanges.unsubscribe();
            }
        }

// Removes an item
        removeItem(index)
        {
            const itemsControl = this.productForm.get("products");
            itemsControl.removeAt(index);
        }

        createItem()
        {
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
                reduceStock: ["", Validators.required],
            });
            this.count = this.count + 1;
            // Adding key
            control.meta = {
                key: this.getKey()
            };
            return control;
        }

        handleSubmit(e)
        {
            e.preventDefault();
            console.log('the saving record is ======>', `${JSON.stringify(this.productForm.value, 0, 2)}`);
            alert(`You submitted \n ${JSON.stringify(this.productForm.value, 0, 2)}`);
            const array = [];
            const acc = {
                accountNo: this.accountId,
                particulars: ` Cash Sale BillNo ${this.productForm.get('billNo').value} Amt`,
                debit: 0,
                credit: this.productForm.get('totalNetAmount').value,
                createdOn: new Date().toLocaleDateString(),
            };
            console.log('the account object created ========>', acc);

            console.log('Saved: ' + JSON.stringify(this.productForm.value, null, 2));
            this.addSale(this.productForm.value);
            this.addAccount(acc);
        }

        handleReset()
        {
            this._isMounted = false;
            console.log('mounted flag', this._isMounted);
            if (this._isMounted === false) {
                this.productForm.reset();
                for (let i = 0; i <= this.count; i++) {
                    this.productForm.get('products').controls.pop(i);
                }
                this.getInitialLoad()
            }
        }

        reduceStock(index)
        {
            const quantity = this.productForm.get("products").controls[index].get('qty').value;
            const serial = this.productForm.get("products").controls[index].get('serialNo').value;
            const action = 'delete';
            this.totalSalesAmt += parseInt(this.productForm.get("products").controls[index].get('totalRate').value, 10);
            this.updateQuantity(quantity, serial, action);
            this.productForm.get("products").controls[index].get('reduceStock').disable({emitEvent: false});
            this.productForm.get('totalNetAmount').patchValue(this.totalSalesAmt);

        }

        render()
        {
            return (
                <>

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
                                render={({value, pristine, invalid, hasError, handler, touched}) => (
                                    <div style={styles.main}>
                                        <h2> Petty Sales Form</h2>
                                        <form onSubmit={() => this.handleSubmit}>
                                            <FieldControl
                                                name="billNo"
                                                render={TextInput}
                                                // Use meta to add some extra props
                                                meta={{
                                                    label: "Bill No",
                                                    placeholder: "Enter billNo",
                                                    readOnly: true

                                                }}
                                            />


                                            <FieldControl
                                                name="salesDate"
                                                render={TextInput}

                                                // Use meta to add some extra props
                                                meta={{
                                                    label: "Sales Date",
                                                    placeholder: "Enter salesDate",
                                                    readOnly: true

                                                }}
                                            />

                                            <FieldArray
                                                name="products"
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
                                                        <h2>{controls.length ? "Products:" : null}</h2>
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
                                                                                        <label style={styles.genderText}>SerialNo:</label>
                                                                                        <select
                                                                                            style={styles.input} {...handler()}
                                                                                            options={this.state.productts}
                                                                                        >
                                                                                            <option value="" disabled>
                                                                                                Select
                                                                                            </option>
                                                                                            {this.state.productts.map(product => (
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
                                                                                    label: "Model No",
                                                                                    placeholder: "Enter modelNo",
                                                                                    readOnly: true

                                                                                }}
                                                                            />

                                                                            <FieldControl
                                                                                name="HSNCodeNo"
                                                                                render={TextInput}
                                                                                // Use meta to add some extra props
                                                                                meta={{
                                                                                    label: "HSN Code No",
                                                                                    placeholder: "Enter HSNCodeNo",
                                                                                    readOnly: true

                                                                                }}
                                                                            />

                                                                            <FieldControl
                                                                                name="companyName"
                                                                                render={TextInput}
                                                                                // Use meta to add some extra props
                                                                                meta={{
                                                                                    label: "Company Name",
                                                                                    placeholder: "Enter companyName",
                                                                                    readOnly: true

                                                                                }}
                                                                            />

                                                                            <FieldControl
                                                                                name="productType"
                                                                                render={TextInput}
                                                                                // Use meta to add some extra props
                                                                                meta={{
                                                                                    label: "Product Type",
                                                                                    placeholder: "Enter productType",
                                                                                    readOnly: true

                                                                                }}
                                                                            />

                                                                            <FieldControl
                                                                                name="qty"
                                                                                render={NumberInput}
                                                                                // Use meta to add some extra props
                                                                                meta={{
                                                                                    label: "Quantity",
                                                                                    placeholder: "Enter qty",
                                                                                    readOnly: false
                                                                                }}
                                                                            />

                                                                            <FieldControl
                                                                                name="productRate"
                                                                                render={NumberInput}
                                                                                // Use meta to add some extra props
                                                                                meta={{
                                                                                    label: "Product Rate",
                                                                                    placeholder: "Enter productRate",
                                                                                    readOnly: false
                                                                                }}
                                                                            />

                                                                            <FieldControl
                                                                                name="gstRate"
                                                                                render={NumberInput}
                                                                                // Use meta to add some extra props
                                                                                meta={{
                                                                                    label: "GST Rate",
                                                                                    placeholder: "Enter gstRate",
                                                                                    readOnly: true
                                                                                }}
                                                                            />

                                                                            <FieldControl
                                                                                name="sgstRate"
                                                                                render={NumberInput}
                                                                                // Use meta to add some extra props
                                                                                meta={{
                                                                                    label: "SGST Rate",
                                                                                    placeholder: "Enter sgstRate",
                                                                                    readOnly: true
                                                                                }}
                                                                            />

                                                                            <FieldControl
                                                                                name="totalRate"
                                                                                render={NumberInput}
                                                                                // Use meta to add some extra props
                                                                                meta={{
                                                                                    label: "Total Rate",
                                                                                    placeholder: "Enter totalRate",
                                                                                    readOnly: true
                                                                                }}
                                                                            />

                                                                            <FieldControl name="reduceStock"
                                                                                          meta={{label: "Reduce Stock"}}
                                                                                          render={Checkbox}/>

                                                                            <div>
                                                                                <button
                                                                                    disabled={!this.productForm.get("products").controls[index].get('reduceStock').value ||
                                                                                    this.productForm.get("products").controls[index].get('qty').value === false}

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


                                            <FieldControl
                                                name="totalNetAmount"
                                                render={NumberInput}
                                                // Use meta to add some extra props
                                                meta={{
                                                    label: "Total Net Amount",
                                                    placeholder: "Enter totalNetAmount",
                                                    readOnly: true
                                                }}
                                            />
                                            {this.div}


                                            <div>
                                                <button
                                                    disabled={!this.productForm.valid}
                                                    style={styles.button}
                                                    onClick={e => this.handleSubmit(e)}
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
                </>
            );
        }
    }


