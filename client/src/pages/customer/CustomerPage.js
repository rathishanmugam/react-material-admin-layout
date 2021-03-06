import React, {Component} from 'react'
import AccountModel from './CustomerModel'
import AccountTable from './CustomerTable'
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Snackbar from "@material-ui/core/Snackbar";
import {IconButton} from "@material-ui/core";

class CustomerPage extends Component {
    constructor() {
        super();
        this.getItems = this.getItems.bind(this);

    }

    _isMounted = false;

    state = {
        items: [],
        account: [],
        total: 0,
        snackbaropen: false,
        snackbarmsg: '',
        totalCredit: 0,
        totalDebit: 0,
        balance: 0,
        accNo :0,
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

    getItems(page, limit, sort, order, filter) {
        let params = {
            "page": page ? page : "0",
            "limit": limit ? limit : "5",
            "sort": sort ? sort : 'first',
            "order": order === 'desc' ? -1 : 1,
            "filter": filter ? filter : ''
        }

        let query = Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
            .join('&');

        let url = 'http://localhost:8081/api/customer?' + query
        console.log('query', url);
        fetch(url)
        // fetch('http://localhost:8081/api/user')
            .then(response => response.json())
            .then(res => {
                console.log('creditor responce', res.docs);

                this.setState({
                    items: res.docs,
                    total: res.count,
                });
            })
            .catch(err => console.log(err))
    }

    // getAccount() {
    //     let url = 'http://localhost:8081/api/account';
    //     console.log('query', url);
    //     fetch(url)
    //         .then(response => response.json())
    //         .then(res => {
    //             this.setState({
    //                 account: res.docs,
    //             });
    //             console.log('responce', res.docs);
    //             console.log('state', this.state.account);
    //             // this.getNextAvailableID(res.docs);
    //             if (this.state.account) {
    //                 this.setState({accNo :  this.getNextAvailableID(res.docs)} );
    //                 console.log('the new accountNo is:', this.state.accNo);
    //             } else {
    //                 this.state.accNo = 0;
    //             }
    //         })
    //         .catch(err => console.log(err))
    // }

    addItemToState = (item) => {
        this.setState(prevState => ({
            items: [...prevState.items, item]
        }))
        console.log('the item after loaded', this.state.items);
        this.setState({snackbaropen: true, snackbarmsg: ' customer Added Into  Data Base Sucessfully'});
        this.getItems()
    }

    updateState = (item) => {
        console.log('the item array(UPDATE) ===>',this.state.items);
        console.log('the props are(UPDATE) ====>', item);
        const itemIndex = this.state.items.findIndex(data => data.accountNo === item.accountNo)
        console.log('IAM IN UPDATE STATE',itemIndex);

        this.setState({items:this.state.items.splice(itemIndex, 1, item)})
        this.setState({snackbaropen: true, snackbarmsg: 'customer Entry updated Sucessfully'});
        this.getItems()
        // const itemIndex = this.state.items.findIndex(data => data.id === item.id)
        // const newArray = [
        //     // destructure all items from beginning to the indexed item
        //     ...this.state.items.slice(0, itemIndex),
        //     // add the updated item to the array
        //     item,
        //     // add the rest of the items to the array from the index after the replaced item
        //     ...this.state.items.slice(itemIndex + 1)
        // ]
        // this.setState({ items: newArray })
    }

    deleteItemFromState = (_id) => {
        console.log('the item id delete===>',this.state.items);
        console.log('the props id delete===>',_id);

        this.setState({items: (this.state.items.filter(item => item._id !== _id))})
        this.setState({snackbaropen: true, snackbarmsg: 'customer Entry Deleted Sucessfully'});
        this.getItems()
        // const updatedItems = this.state.items.filter(item => item.id !== id)
        // this.setState({ items: updatedItems })
    }

    componentDidMount() {  this._isMounted = true;
        if (this._isMounted) {
            this.getItems();
            // this.getAccount();
        }
    }
    componentWillUnmount() {
        console.log('iam in unmount');
        this._isMounted = false;
    }
    // getNextAvailableID(account) {
    //     let maxID = 0;
    //     account.forEach(function (element, index, array) {
    //         if (element.accountNo) {
    //             if (element.accountNo > maxID) {
    //                 maxID = element.accountNo;
    //             }
    //         }
    //     });
    //     console.log('the maxid', maxID);
    //     return ++maxID;
    // }

    render() {
        return (
            <Card style={{maxWidth: 1400, marginLeft: 20}}>
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
                    <h2>Customer Entry Form</h2>

                    <AccountTable items={this.state.items}   total={this.state.total} getItems={this.getItems} accNo={this.state.accNo}
                                  updateState={this.updateState} deleteItemFromState={this.deleteItemFromState}/>

                </CardContent>
                <CardActions>
                    {this.state.items ?
                        <AccountModel items={this.state.items} total={this.state.total} accNo={this.state.accNo} buttonLabel="Add Item"
                                      addItemToState={this.addItemToState}/>
                        : null}

                </CardActions>
            </Card>
        )
    }
}

export default CustomerPage
