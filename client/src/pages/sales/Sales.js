import * as React from "react";
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
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
import CustomerModel from './CustomerModel'
import AccountModel from "../customer/CustomerModel";
const filterOptions = createFilterOptions({
    matchFrom: 'start',
    stringify: option => option.name,
});

export default class Icons extends React.Component {
    constructor() {
        super();
        // this.onTagsChange = this.onTagsChange().bind(this);
        this.getCustomers = this.getCustomers.bind(this);
        this.state = {
            items:[],
            sales: [],
            customer: [],
            credit:[],
            customerName: [],
            products: [],
            product: [],
            account: [],
            tags: [],
            snackbaropen: false,
            snackbarmsg: '',
        }
        this.getCustomers();
    }

    _isMounted = false;
    keyCount = 0;
    nxtId = 0;
    accountId = 0;
    creditId = 0;
    obj = {};
    cus = [];
    customers = [];
    product = [];
    total = 0;
    count = 0;
    type = '';
    tenure = '';
    div = '';
    span = '';
    id = '';
    totalSalesAmt= 0;
    isAllowed = false;
    isPermitted= false;
    filteredCustomer = '';
    loanAmount = 0;
    loanTenure = '';

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
        customerName: ["", [Validators.required]],
        address: ["", [Validators.required]],
        email: ["", [Validators.required, Validators.email]],
        phoneNo: ["", [Validators.required, Validators.pattern(/(\(?[0-9]{3}\)?-?\s?[0-9]{3}-?[0-9]{4})/)]],
        products: FormBuilder.array([]),
        totalNetAmount: ["", [Validators.required, Validators.pattern('[0-9].*')]],
        billType: ["", [Validators.required]],
        delivered: ["", [Validators.required]],
        financeName: ["", [Validators.required]],
        credit: FormBuilder.group({
            billNo: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            creditNo: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            initialAmountPaid: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            loanAmount: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            tenureType: ["months", [Validators.required]],
            loanTenure: ["", [Validators.required]],
            loanInterest: ["", [Validators.required]],
            EMIPerMonth: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            totalInterestPayable: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            totalAmountPayable: ["", [Validators.required, Validators.pattern('[0-9].*')]],
            duePayableDate: ["", [Validators.required]],
            totalPayableDues: ["", [Validators.required]],
            dueEndYear: ["", [Validators.required]],
            betweenDues: ["", [Validators.required]],
        }),
    });

    componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            this.getInitialLoad();


            this.productForm.get('customerName').valueChanges
                .subscribe(value => {
                    if (this._isMounted) {

                        // this.filteredCustomer = this.state.customer.filter(cus => cus.name === value);
                        // this.populateFillterdCustomer(Object.assign({}, this.filteredCustomer));
                    }
                });


            this.productForm.get('billType').valueChanges.subscribe(
                value => {
                    if (this._isMounted) {
                        const itemsControl = this.productForm.get("products");
                        let isValid = false;
                        for (let val of itemsControl.controls) {
                            console.log('the entry is allowed =====>', val.valid);
                            let value = val.get('reduceStock').value;
                            console.log('the value of reduce stock is ====>', value);
                            if (val.valid && value === true) {
                                isValid = true;
                            } else {
                                isValid = false;
                            }
                        }
                        if (!isValid) {
                            this.setState({snackbaropen: true, snackbarmsg: 'Check Qty And Reduce Stock Validated'});
                        } else {
                            this.type = value;
                            let nextId;
                            if (this.type === 'credit') {
                                this.getMaxCreditNo();
                                this.productForm.get('totalNetAmount').patchValue(this.totalSalesAmt);
                            } else if (this.type === 'finance') {
                                this.productForm.get('totalNetAmount').patchValue(this.totalSalesAmt);

                            } else if (this.type === 'cash') {
                                this.productForm.get('totalNetAmount').patchValue(this.totalSalesAmt);
                            }
                            this.setBillType(this.type);
                        }
                    }
                });


            this.productForm.controls.credit.get('loanTenure').valueChanges.subscribe(
                value => {
                  let type = this.productForm.controls.credit.get('tenureType').value;
                  this.loanTenure = `${value} ${type}`;
                    console.log('the val ===>',`${value} ${type}` );
                });
            this.productForm.controls.credit.get('initialAmountPaid').valueChanges.subscribe(
                value => {
                    console.log('net amt=====>', this.totalSalesAmt);
                    this.loanAmount = this.totalSalesAmt - parseInt(value, 10);
                    this.productForm.controls.credit.get('loanAmount').patchValue(this.loanAmount);
                });
            this.productForm.controls.credit.get('loanInterest').valueChanges.subscribe(
                value => {
                    if (value) {
                        let monthTenure, monthlyInterestRatio, bottom;
                        let yearTenure;
                        let emi;
                        let interest;
                        let loanAmount;
                        let top, sp, full;
                        let type = this.productForm.controls.credit.get('tenureType').value;
                        let val = this.productForm.controls.credit.get('loanTenure').value;

                        loanAmount = this.productForm.controls.credit.get('loanAmount').value;
                        if (type === 'months') {
                            this.numberOfMonths = val;
                        } else {
                            this.numberOfMonths = (val * 12);
                        }
                        monthlyInterestRatio = (value / 12) / 100;
                        console.log('monthly interest rate, no of monthhs =======>', monthlyInterestRatio , this.numberOfMonths);
                        console.log('no of months =========>', this.numberOfMonths);
                        top = Math.pow((1 + monthlyInterestRatio), this.numberOfMonths);
                        console.log('the top is =============>', top);
                        bottom = top - 1;
                        console.log('the bottom is =============>', bottom);
                        sp = top / bottom;
                        emi = ((loanAmount * monthlyInterestRatio) * sp);
                        console.log('emi ================>', emi.toFixed(0));
                        full = this.numberOfMonths * emi;
                        interest = full - loanAmount;
                        const current = new Date();
                        const dat = new Date().toISOString().slice(0, 10);
                        const eDue = this.addMonths(new Date(), this.numberOfMonths);
                        const edat = eDue.toISOString().slice(0,10);
                        // let endDue = new Date().setMonth(new Date().getMonth() + +this.numberOfMonths);
                         console.log('i found the answer ==========>', dat, eDue);
                        let range = this.dateRange(dat, edat);
                        console.log('range dates =============>', range);
                        console.log('interest rate ==========>', interest.toFixed(0));
                        this.productForm.controls.credit.get('EMIPerMonth').patchValue(emi.toFixed(0));
                        this.productForm.controls.credit.get('totalInterestPayable').patchValue(interest.toFixed(0));
                        this.productForm.controls.credit.get('totalAmountPayable').patchValue(full.toFixed(0));
                        this.productForm.controls.credit.get('duePayableDate').patchValue(range[0]);
                        this.productForm.controls.credit.get('totalPayableDues').patchValue(this.numberOfMonths);
                        this.productForm.controls.credit.get('dueEndYear').patchValue(edat);
                        // this.productForm.controls.credit.get('currentDue').patchValue(range[0]);
                        this.productForm.controls.credit.get('betweenDues').patchValue(range);
                    }
                });

        }
        this.productForm.controls.credit.get('duePayableDate').valueChanges.subscribe(
            value => {
                if (value) {
                    this.isUserDate = !this.isUserDate;
                    console.log('iam in user changed me changed', value);
                    let startDue = new Date(value).toISOString().slice(0, 10);
                    // const eDue = this.addMonths(new Date(value), this.numberOfMonths);
                     let endDue = new Date(value).setMonth(new Date(value).getMonth() + +this.numberOfMonths);
                     const edat = new Date(parseInt(endDue, 10));
                    let ds = edat.toISOString('y/MM/dd');
                    console.log('after getting date from user end due ===========>',startDue , ds);
                     const eda = ds.slice(0,10);
                    let range = this.dateRange(startDue, ds);
                    console.log('after getting date from user ===========>', range);
                    this.productForm.controls.credit.get('dueEndYear').patchValue(eda);
                    this.productForm.controls.credit.get('betweenDues').patchValue(range);
                }
            });
    }
    dateRange(startDate, endDate) {
        let da;
        console.log('iam in date range ====>', startDate, endDate);
        let start = startDate.split('-');
        let end = endDate.split('-');
        let startYear = parseInt(start[0], 10);
        let endYear = parseInt(end[0], 10);
        console.log('iam in date range after split ====>', start, end);

        let dates = [];
        if (!this.isUserDate) {
            console.log('if block');
            da = new Date(startDate).getDate();
        } else if (this.isUserDate) {
            console.log('else block');
            da = new Date().getDate();
        }
        console.log('the current day selected ====>', da);
        for (let i = startYear; i <= endYear; i++) {
            let endMonth = (i !== endYear) ? 12 : parseInt(end[1], 10);
            let startMon = (i === startYear) ? parseInt(start[1], 10) : 0;
            console.log('the rangeeeeeeee selected ====>', endMonth, startMon);

            for (let j = startMon; j < endMonth; j = (j > 12) ? j % 12 || 12 : j + 1) {
                let month = j + 1;
                let displayMonth = month < 10 ? '0' + month : month;
                let displayDay = da < 10 ? '0' + da : da;

                dates.push([i, displayMonth, displayDay].join('-'));
            }
        }
        return dates;
    }

    addMonths(date, months) {
        let d = date.getDate();
        date.setMonth(date.getMonth() + +months);
        return date;
    }

    getInitialLoad() {
        this._isMounted = true;

        this.getSales();
        this.getCustomers();
        this.getProducts();
        this.getMaxAccountNo();

    }
    getMaxCreditNo() {
        fetch('http://localhost:8081/api/credit')
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {

                    console.log('the response account is ====>', res);
                    this.setState({credit: res});
                    if (!!this.state.credit) {
                        this.creditId = this.getNextAvailableCredit(this.state.credit);
                        console.log('the new account id is:', this.creditId);
                    } else {
                        this.creditId = 0;
                    }
                    this.productForm.controls.credit.get('creditNo').patchValue(this.creditId);
                    this.productForm.controls.credit.get('billNo').patchValue(this.nxtId);

                }
            });
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

    getSales() {
        fetch('http://localhost:8081/api/sale')
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {

                    console.log('the sales response is ====>', res);
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

    getCustomers() {
        fetch('http://localhost:8081/api/customers')
            .then(response => response.json())
            .then(res => {
                if (this._isMounted) {
                    this.cus = res;
                    console.log('the get customer  is ====>', this.cus );
                    this.setState({customer: res});

                    if (!!this.state.customer) {
                        this.customers = this.state.customer;

                    }
                }
            })
            .catch(err => console.log(err))
        console.log('the purchase data =====>', this.state.purchase);
    }


    populateFillterdCustomer(cus) {
        console.log('filter customer =========>', JSON.stringify(cus, null, 5));
        let addr = `${cus[0].address.street} , ${cus[0].address.city},${cus[0].address.state},${cus[0].address.zipCode}`;
        console.log('the address is ===============>', addr);
        this.productForm.get('address').patchValue(addr);
        this.productForm.get('email').patchValue(cus[0].email);
        this.productForm.get('phoneNo').patchValue(cus[0].phone1);
        // this.productForm.get('address').disable({emitEvent: false});
        // this.productForm.get('email').disable({emitEvent: false});
        // this.productForm.get('phoneNo').disable({emitEvent: false});

    }
    getNextAvailableCredit(credit) {
        let maxID = 0;
        credit.forEach(function (element, index, array) {
            if (element.creditNo) {
                if (element.creditNo > maxID) {
                    maxID = element.creditNo;
                }
            }
        });
        console.log('the maxid', maxID);
        return ++maxID;
    }

    getNextAvailableID(purchase) {
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
                this.setState({snackbaropen: true, snackbarmsg: 'quantity Reduced Sucessfully'});

            })
            .catch(err => console.log(err))
    }

    addSale(body) {
        axios.post(`http://localhost:8081/api/sales`, body)
            .then(res => {
                console.log(res);
                console.log(res.data);
                console.log('the  sales saved item', res.data);
                this.setState({snackbaropen: true, snackbarmsg: ' Sales Loaded Into  Data Base Sucessfully'});

            })
    }
    addCreditSale(body) {

        axios.post(`http://localhost:8081/api/credit`, body)
            .then(res => {
                console.log(res);
                console.log(res.data);
                console.log('the credit sales saved item', res.data);
                this.setState({snackbaropen: true, snackbarmsg: 'Credit Sales Loaded Into  Data Base Sucessfully'});

            })
            .catch(err => console.log(err))
    }

    addAccount(body) {
        axios.post(`http://localhost:8081/api/account`, body)
            .then(res => {
                console.log(res);
                console.log(res.data);
                console.log('the credit sales saved item', res.data);
                this.setState({snackbaropen: true, snackbarmsg: 'Credit Sales Loaded Into  Data Base Sucessfully'});

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
    addItem(index) {
        if (this._isMounted) {
            if (index === 0) {
                console.log('iam in index zero', this.productForm.get('customerName').value);
                if (this.productForm.get('customerName').value === '') {
                    console.log('iam in undefined ');
                    this.setState({snackbaropen: true, snackbarmsg: 'Select Customer Name '});
                } else if (this.productForm.get('customerName').value !== '') {
                    this.isAllowed = true;
                }
            }
            if(this.isAllowed) {
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
    }
    componentWillUnmount() {
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
    removeItem(index) {
        const itemsControl = this.productForm.get("products");
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
            reduceStock: ["", Validators.required],
        });
        this.count = this.count + 1;
        // Adding key
        control.meta = {
            key: this.getKey()
        };
        return control;
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log('the saving record is ======>', `${JSON.stringify(this.productForm.value, 0, 2)}`);
        alert(`You submitted \n ${JSON.stringify(this.productForm.value, 0, 2)}`);
        const array = [];
        if (this.type === 'credit') {
            console.log('hai iam in credit');

            const billNo = this.productForm.get('billNo').value;
            const creditNo = this.productForm.controls.credit.get('creditNo').value;
            const customerName = this.productForm.get('customerName').value;
            const dueAmount = this.productForm.controls.credit.get('EMIPerMonth').value;
            const dueStartYear = new Date(this.productForm.controls.credit.get('duePayableDate').value).toISOString();
            const dueEndYear = new Date(this.productForm.controls.credit.get('dueEndYear').value).toISOString();
            console.log('after conversion ======>', dueStartYear, dueEndYear);
            const duePaid = false;
            const gracePeriod = 0;
            for (let val of this.productForm.controls.credit.get('betweenDues').value) {
                const currentDue = new Date(val).toISOString();
                console.log('after conversion ======>', currentDue);
                const obj = {
                    billNo: billNo,
                    customerName: customerName,
                    creditNo: creditNo,
                    dueAmount: dueAmount,
                    dueStartDate: dueStartYear,
                    dueEndDate: dueEndYear,
                    dueCurrentDate: currentDue,
                    gracePeriod: gracePeriod,
                    duePaid: duePaid,
                };
                array.push(obj);
                console.log('array ===>', array);
            }
            const acc = {
                accountNo: this.accountId,
                particulars: `Credit Sale BillNo${this.productForm.get('billNo').value}Initial Amt`,
                debit: 0,
                credit: this.productForm.controls.credit.get('initialAmountPaid').value,
                createdOn: new Date().toLocaleDateString(),
            };
            console.log('the account object created ========>', acc);

            const body = {obj: array, data: {...this.productForm.value}};
            console.log('Saved Credit due: ' + body);

            console.log('Saved Credit due: ' + body);
             // this.addCreditSale({obj: JSON.stringify(array), data:JSON.stringify(this.productForm.value)});
           this.addCreditSale(body);
            this.addAccount(acc);
        } else if (this.type === 'finance') {
            console.log('hai iam in finance');
            const acc = {
                accountNo: this.accountId,
                particulars: `${this.productForm.get('financeName').value} Finance Sale BillNo${this.productForm.get('billNo').value} Amt`,
                debit: 0,
                credit: this.productForm.get('totalNetAmount').value,
                createdOn: new Date().toLocaleDateString(),
            };
            console.log('the account object created ========>', acc);
            console.log('Saved: ' + JSON.stringify(this.productForm.value, null, 2));
            this.addSale(this.productForm.value);
            this.addAccount(acc);
        } else if (this.type === 'cash') {
            console.log('hai iam in cash');
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
    }
    handleReset() {
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

    reduceStock(index) {
        const quantity = this.productForm.get("products").controls[index].get('qty').value;
        const serial = this.productForm.get("products").controls[index].get('serialNo').value;
        const action = 'delete';
         this.totalSalesAmt += parseInt(this.productForm.get("products").controls[index].get('totalRate').value, 10);
        this.updateQuantity(quantity, serial, action);
        this.productForm.get("products").controls[index].get('reduceStock').disable({emitEvent: false});

    }

    setBillType(note) {
        console.log('option', note);
        const finance = this.productForm.get('financeName');
        if (note === 'finance') {
            finance.patchValue('');
            finance.setValidators(Validators.required);
            finance.updateValueAndValidity();

        } else {
            finance.clearValidators();
            finance.updateValueAndValidity();

        }
        finance.updateValueAndValidity();
        const credit = this.productForm.get('credit');
        if (note === 'credit') {
            this.productForm.controls.credit.get('creditNo').patchValue('');

            credit.setValidators(Validators.required);
            credit.updateValueAndValidity();

        } else {
            credit.clearValidators();
            credit.updateValueAndValidity();

        }
        credit.updateValueAndValidity();
    }
    onTagsChange = (event, values) => {
        this.setState({
            tags: values
        }, () => {
            // This will output an array of objects
            // given by Autocompelte options property.
            console.log(this.state.tags);
            if(this.state.tags === null) {
                return;
            } else {
                this.filteredCustomer = this.state.customer.filter(cus => cus.name === values.name);
                this.populateFillterdCustomer(Object.assign({}, this.filteredCustomer));
            }
        });

    }
    addItemToState = (item) => {
        this.setState(prevState => ({
            items: [...prevState.items, item]
        }))
        console.log('the item after loaded', this.state.items);
        this.setState({snackbaropen: true, snackbarmsg: ' customer Added Into  Data Base Sucessfully'});
        this.getCustomers();
    }
    render() {

        this.productForm.get('billType').valueChanges.subscribe(
            value => {
                let finance = ''
                let title = ''
                if (this.type === 'credit') {
                    this.div = <div>
                        <h4 style={styles.addressText}>Credit</h4>

                        <FieldControl
                            name="credit.creditNo"
                            render={NumberInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Credit No",
                                placeholder: "Enter creditNo",
                                readOnly: true

                            }}
                        />
                        <FieldControl
                            name="credit.initialAmountPaid"
                            render={NumberInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Initial Amount Paid",
                                placeholder: "Enter initialAmountPaid",
                                readOnly: false

                            }}
                        />
                        <FieldControl
                            name="credit.loanAmount"
                            render={NumberInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Loan Amount",
                                placeholder: "Enter loanAmount",
                                readOnly: true

                            }}
                        />
                        <FieldControl name="credit.tenureType" render={loanTenureRadio}/>
                        <FieldControl
                            name="credit.loanTenure"
                            render={NumberInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Loan Tenure",
                                placeholder: "Enter loanTenure",
                                readOnly: false

                            }}
                        />
                        <FieldControl name="credit.loanInterest"  render={SelectBox}/>

                        {/*<FieldControl*/}
                        {/*    name="credit.loanInterest"*/}
                        {/*    render={NumberInput}*/}
                        {/*    // Use meta to add some extra props*/}
                        {/*    meta={{*/}
                        {/*        label: "loanInterest",*/}
                        {/*        placeholder: "Enter loanInterest"*/}
                        {/*    }}*/}
                        {/*/>*/}


                        <FieldControl
                            name="credit.EMIPerMonth"
                            render={NumberInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "EMI Per Month",
                                placeholder: "Enter EMIPerMonth",
                                readOnly: true

                            }}
                        />
                        <FieldControl
                            name="credit.totalInterestPayable"
                            render={NumberInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Total Interest Payable",
                                placeholder: "Enter totalInterestPayable",
                                readOnly: true

                            }}
                        />
                        <FieldControl
                            name="credit.totalAmountPayable"
                            render={NumberInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Total Amount Payable",
                                placeholder: "Enter totalAmountPayable",
                                readOnly: true

                            }}
                        />
                        <FieldControl
                            name="credit.duePayableDate"
                            render={DateInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Due Payable Date(Changeable)",
                                placeholder: "Enter duePayableDate"
                            }}
                        />
                        <FieldControl
                            name="credit.totalPayableDues"
                            render={NumberInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Total Payable Dues",
                                placeholder: "Enter totalPayableDues",
                                readOnly: true
                            }}
                        />
                        <FieldControl
                            name="credit.dueEndYear"
                            render={DateInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Due End Year",
                                placeholder: "Enter dueEndYear"
                            }}
                        />
                        <FieldControl
                            name="credit.betweenDues"
                            render={TextArea}
                            // Use meta to add some extra props
                            meta={{
                                label: "Between Dues",
                                placeholder: "Enter betweenDues"
                            }}
                        />
                    </div>
                    this.setBillType(this.type);

                } else if (this.type === 'finance') {
                    this.div = <div>
                        <FieldControl
                            name="financeName"
                            render={TextInput}
                            // Use meta to add some extra props
                            meta={{
                                label: "Finance Name",
                                placeholder: "Enter financeName",
                                readOnly: false

                            }}
                        />
                    </div>
                    this.setBillType(this.type);

                } else if (this.type === 'cash') {
                    this.div = ''
                }
            });


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
                            render={({value, pristine, invalid, hasError ,handler,  touched}) => (
                                <div style={styles.main}>
                                    <h2> Sales Form</h2>
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

                                        <FieldControl
                                            name="customerName"
                                            render={({
                                                         handler,
                                                         pending,
                                                         touched,
                                                         hasError
                                                     }) => (
                                                <div>
                                                    <label style={styles.genderText}>Customer Name:</label>
                                                    <select  style={styles.input} {...handler()}
                                                             options={this.state.customer}
                                                    >
                                                        <option value="" disabled>
                                                            Select
                                                        </option>
                                                        {this.state.customer.map(customer => (
                                                            <option key={customer.email}>{customer.name}</option>))}

                                                    </select>
                                                    {pending && <i className="fa fa-spinner fa-spin"/>}
                                                    <div>
                      <span style={styles.error}>
                        {touched &&
                        hasError("required") &&
                        "Customer name is required"}
                      </span>
                                                    </div>
                                                </div>
                                            )}
                                        />

                                        <div style={styles.genderContainer}>
                                            <CustomerModel items={this.state.items} style={styles.button} total={this.state.total} buttonLabel="Add Name"
                                                           addItemToState={this.addItemToState}/>

                                            <Autocomplete
                                                      id="combo-box-demo"
                                            options={this.state.customer}
                                            getOptionLabel={(option) => option.name}
                                                      onChange={this.onTagsChange}
                                                      // onChange={() => this.onTagsChange()}
                                            style={{ width: 300 }}
                                            renderInput={(params) => <TextField {...params} label="Select Name" variant="outlined" />}
                                        />

                                         </div>

                                        <FieldControl
                                            name="address"
                                            render={TextInput}
                                            // Use meta to add some extra props
                                            meta={{
                                                label: "Address",
                                                placeholder: "Enter address",
                                                readOnly: true

                                            }}
                                        />

                                        <FieldControl
                                            name="email"
                                            render={TextInput}
                                            // Use meta to add some extra props
                                            meta={{
                                                label: "Email",
                                                placeholder: "Enter email",
                                                readOnly: true

                                            }}
                                        />

                                        <FieldControl
                                            name="phoneNo"
                                            render={TextInput}
                                            // Use meta to add some extra props
                                            meta={{
                                                label: "Phone No",
                                                placeholder: "Enter phoneNo",
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
                                                                                readOnly:false
                                                                            }}
                                                                        />

                                                                        <FieldControl
                                                                            name="productRate"
                                                                            render={NumberInput}
                                                                            // Use meta to add some extra props
                                                                            meta={{
                                                                                label: "Product Rate",
                                                                                placeholder: "Enter productRate",
                                                                                readOnly:false
                                                                            }}
                                                                        />

                                                                        <FieldControl
                                                                            name="gstRate"
                                                                            render={NumberInput}
                                                                            // Use meta to add some extra props
                                                                            meta={{
                                                                                label: "GST Rate",
                                                                                placeholder: "Enter gstRate",
                                                                                readOnly:true
                                                                            }}
                                                                        />

                                                                        <FieldControl
                                                                            name="sgstRate"
                                                                            render={NumberInput}
                                                                            // Use meta to add some extra props
                                                                            meta={{
                                                                                label: "SGST Rate",
                                                                                placeholder: "Enter sgstRate",
                                                                                readOnly:true
                                                                            }}
                                                                        />

                                                                        <FieldControl
                                                                            name="totalRate"
                                                                            render={NumberInput}
                                                                            // Use meta to add some extra props
                                                                            meta={{
                                                                                label: "Total Rate",
                                                                                placeholder: "Enter totalRate",
                                                                                readOnly:true
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



                                        <FieldControl name="billType" render={BillTypeRadio}/>
                                        <FieldControl
                                            name="totalNetAmount"
                                            render={NumberInput}
                                            // Use meta to add some extra props
                                            meta={{
                                                label: "Total Net Amount",
                                                placeholder: "Enter totalNetAmount",
                                                readOnly:true
                                            }}
                                        />
                                        {this.div}
                                        <FieldControl name="delivered" meta={{label: "Delivered"}} render={Checkbox}/>


                                        <div>
                                            <button
                                                disabled={this.productForm.get('delivered').pristine }
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

