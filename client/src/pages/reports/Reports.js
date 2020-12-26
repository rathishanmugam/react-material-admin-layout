import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Sales from "./components/Sales";
import {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, Divider} from "@material-ui/core";
import {Button} from "../../components/Wrappers";
import Purchase from "./components/Purchase";
import SalesCredit from "./components/SalesCredit";
import SalesProduct from './components/SalesProduct';
import DueModel from "./components/DueModel";
import DeleteForeverIcon from "@material-ui/core/SvgIcon/SvgIcon";
import orderBy from 'lodash/orderBy';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Slide from '@material-ui/core/Slide';
import styles from "../sales/styles";
import Example from './components/pieChart';
import SimpleLineChart from './components/lineChart';
import Sample from './components/barChart';

function TabPanel(props) {
    const {children, value, index, ...other} = props;
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={6}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}
function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                event.preventDefault();
            }}
            {...props}
        />
    );
}
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        width: 1400,
    },
}));

export default function Reports() {
    const classes = useStyles();
    const theme = useTheme();
    let card = '';
    let data = {};
    const [value, setValue] = React.useState(0);
    const [items, setItems] = React.useState([]);
    const [total, setTotal] = React.useState(0);
    const [products, setProducts] = React.useState([]);
    const [purchase, setPurchase] = React.useState([]);
    const [creditSales, setCreditSales] = React.useState([]);
    const [creditDue, setCreditDue] = React.useState([]);
    const [parentId, setparentId] = React.useState('');
    const [pettySales, setPettySales] = React.useState([]);
    const [pettyProducts, setPettyProducts] = React.useState([]);

    const [col, setCol] = useState({
        colToSort: 'serialNo',
        sortDir: 'asc',
        reverse: false,
        query: '',
        filter: ''
    });

    useEffect(() => {
        getItems();
        getPurchase();
        getCreditSales();
        getPettySales();
    }, []);

    function getItems(page, limit, sort, order, filter) {
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

        let url = 'http://localhost:8081/api/sales?' + query
        console.log('query', url);
        fetch(url)
            .then(response => response.json())
            .then(res => {
                setItems(res.docs);
                setTotal(res.count);
                console.log('total', total);
                console.log('items', items);
            })
            .catch(err => console.log(err))
    }

    function getPurchase(page, limit, sort, order, filter) {
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

        let url = 'http://localhost:8081/api/purchase?' + query
        console.log('query', url);
        fetch(url)
            .then(response => response.json())
            .then(res => {
                setPurchase(res.docs);
                setTotal(res.count);
                console.log('total', total);
                console.log('purchase', purchase);
            })
            .catch(err => console.log(err))
    }
    function getPettySales(page, limit, sort, order, filter) {
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

        let url = 'http://localhost:8081/api/pettys?' + query
        console.log('query', url);
        fetch(url)
            .then(response => response.json())
            .then(res => {
                setPettySales(res.docs);
                setTotal(res.count);
                console.log('total', total);
                console.log('pettySales', pettySales);
            })
            .catch(err => console.log(err))
    }
    function getCreditSales(page, limit, sort, order, filter) {
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

        let url = 'http://localhost:8081/api/sales/credit?' + query
        console.log('query', url);
        fetch(url)
            .then(response => response.json())
            .then(res => {
                let duePending = 0;
                let diff = 0;
                console.log('HERE THE RECORDS ======>', res.docs);
                for (let j = 0; j < res.docs.length; j++) {
                    duePending = 0;
                    diff = 0;
                    for (let i = 0; i < res.docs[j].credit.creditDue.length; i++) {
                        console.log('today date', new Date());
                        console.log('due payable date date', res.docs[j].credit.creditDue[i].dueCurrentDate);

                        console.log('due payable date', new Date(res.docs[j].credit.creditDue[i].dueCurrentDate).toString());
                        const currentDate = new Date(res.docs[j].credit.creditDue[i].dueCurrentDate).getTime();
                        const todayDate = new Date().getTime();
                        console.log('iam in time difference (due pay date) (current date)', currentDate, todayDate);
                        if (todayDate >= currentDate) {

                            if (res.docs[j].credit.creditDue[i].duePaid === false) {

                                let days = 1000 * 60 * 60 * 24;
                                const sub = (todayDate - currentDate);
                                diff += Math.round((todayDate - currentDate) / days);

                                if (diff <= 31) {
                                    duePending = 0;
                                } else if (diff > 31) {
                                    duePending = Math.round(diff / 31);
                                    console.log('i am in loop due pending', sub, days, diff, duePending);
                                }
                            }
                                console.log('i am in', duePending);
                            res.docs[j].credit.duePending = `${duePending} month Due Pending,For ${diff} days`;
                            // console.log('the due pending====>', res.docs[j].credit.duePending);
                        } else {
                            // res.docs[j].credit.duePending = '';

                        }
                    }
                }
                setCreditSales(res.docs);
                setTotal(res.count);
                console.log('total', total);
                console.log('credit sales', res.docs);
            })
            .catch(err => console.log(err))
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };
    const displayProductTable = (row) => {
        setProducts(row.products);

    }
    const displayCreditDueTable = (credit) => {
        setparentId(credit._id);
        setCreditDue(credit.creditDue);
    }
    const displayPettySaleProductTable = (row) => {
        console.log('the selected row is =====>', row);
        setPettyProducts(row.products);
    }

    const handleSort = (colName) => {
        setCol({
            colToSort: colName,
            reverse: !col.reverse,
        });
        console.log('the col to sort and order ', colName, col.reverse ? 'desc' : 'asc', col.filter);
    }
   const handleReset = () => {
       setValue(2);
    }
    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                >
                    <Tab label="Sales Tab"  {...a11yProps(0)} />
                    <Tab label="Credit Sales Tab"  {...a11yProps(1)} />
                    <Tab label="Petty Sales Tab"   {...a11yProps(2)} />
                    <Tab label="Purchase Tab"  {...a11yProps(3)} />
                    <Tab label="Sales Line Chart "  {...a11yProps(4)} />
                    <Tab label="Sales Pie Chart "  {...a11yProps(5)} />
                    <Tab label="Sales Bar Chart "  {...a11yProps(6)} />

                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <Card style={{maxWidth: 1400, marginLeft: 10}}>
                        <CardContent>
                            Sales Details
                            <button
                                type="button"
                                style={styles.button}
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                                <Sales items={items} total={total} getItems={getItems}
                                       displayProductTable={displayProductTable}/>

                        </CardContent>
                    </Card>
                    <br/>
                    <br/>
                    <Card style={{maxWidth: 1400, marginLeft: 10}}>
                        <CardContent>
                            Sales Product Details
                            <Table textalign='center'
                                   className="mb-0"
                                   // handleSort={handleSort}
                                   // products={orderBy(products, col.colToSort, col.reverse ? 'desc' : 'asc')}
                            >
                                <TableHead style={{backgroundColor:'lightblue',color:'white'}}>
                                    <TableRow>
                                        <TableCell alignitems="center"
                                                   onClick={() => handleSort('serialNo')}>serial No
                                            <span align="left">{col.colToSort === 'serialNo' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell  alignitems="center"
                                                   onClick={() => handleSort('modelNo')}>model No
                                            <span align="left">{col.colToSort === 'modelNo' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell  alignitems="center" onClick={() => handleSort('qty')}>qty
                                            <span align="left">{col.colToSort === 'qty' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell  alignitems="center"
                                                   onClick={() => handleSort('productRate')}>product price
                                            <span align="left">{col.colToSort === 'productRate' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell  alignitems="center"
                                                   onClick={() => handleSort('gstRate')}>gst price
                                            <span align="left">{col.colToSort === 'gstRate' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell  alignitems="center"
                                                   onClick={() => handleSort('sgstRate')}>sgst price
                                            <span align="left">{col.colToSort === 'sgstRate' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell  alignitems="center"
                                                   onClick={() => handleSort('totalRate')}>total price
                                            <span align="left">{col.colToSort === 'totalRate' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map(row => (
                                        <TableRow key={row.serialNo}>
                                            <TableCell alignitems="center">{row.serialNo}</TableCell>
                                            <TableCell alignitems="center">{row.modelNo}</TableCell>
                                            <TableCell alignitems="center">{row.qty}</TableCell>
                                            <TableCell alignitems="center">{row.productRate}</TableCell>
                                            <TableCell alignitems="center">{row.gstRate}</TableCell>
                                            <TableCell alignitems="center">{row.sgstRate}</TableCell>
                                            <TableCell alignitems="center">{row.totalRate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabPanel>


                <TabPanel value={value} index={1} dir={theme.direction}>
                    <Card style={{maxWidth: 1400, marginLeft: 10}}>
                        <CardContent>
                            Sales Credit Details
                            <Typography color="textSecondary">
                                <SalesCredit creditSales={creditSales} total={total} getCreditSales={getCreditSales}
                                             displayCreditDueTable={displayCreditDueTable}/>
                            </Typography>
                        </CardContent>
                    </Card>
                    <br/>
                    <br/>
                    <Card style={{maxWidth: 1400, marginLeft: 0}}>
                        <CardContent>
                            Sales Credit Due Details
                            <Table textalign='center' className="mb-0">
                                <TableHead style={{backgroundColor:'lightpink',color:'#000000'}}>
                                    <TableRow>
                                        <TableCell alignitems="center">dueAmount</TableCell>
                                        <TableCell alignitems="center">dueCurrent</TableCell>
                                        <TableCell alignitems="center">duePaid</TableCell>
                                        <TableCell alignitems="center">payingDate</TableCell>
                                        <TableCell alignitems="center">payingAmount</TableCell>
                                        <TableCell alignitems="left">gracePeriod</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {creditDue.map(row => (
                                        <TableRow key={row.dueCurrentDate}>
                                            <TableCell alignitems="center">{row.dueAmount}</TableCell>
                                            <TableCell alignitems="center">{row.dueCurrentDate.slice(0, 10)}</TableCell>
                                            <TableCell alignitems="center">{row.duePaid.toString()}</TableCell>
                                            <TableCell
                                                alignitems="center">{row.payingDueDate ? row.payingDueDate.slice(0, 10) : ''}</TableCell>
                                            <TableCell alignitems="center">{row.payingDueAmount}</TableCell>
                                            <div style={{width: "130px"}}>
                                                <DueModel buttonLabel="Edit" parentId="parentId"
                                                          creditDue={{...row, parentId}}/>{' '}
                                            </div>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabPanel>


                <TabPanel value={value} index={2} dir={theme.direction}>
                    <Card style={{maxWidth: 1400, marginLeft: 10}}>
                        <CardContent>
                           Petty Sales  Details
                            <Typography color="textSecondary">
                                <SalesProduct pettySales={pettySales} total={total} getPettySales={getPettySales}
                                             displayPettySaleProductTable={displayPettySaleProductTable}/>
                            </Typography>
                        </CardContent>
                    </Card>
                    <br/>
                    <br/>
                    <Card style={{maxWidth: 1400, marginLeft: 0}}>
                        <CardContent>
                           Petty Sales Product Details
                            <Table textalign='center' className="mb-0">
                                <TableHead  style={{backgroundColor:'lightyellow',color:'white'}}>
                                    <TableRow>
                                        <TableCell alignitems="center" display="flex"
                                                   onClick={() => handleSort('serialNo')}>serial No
                                            <span align="left">{col.colToSort === 'serialNo' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell display="flex" alignItems="center"
                                                   onClick={() => handleSort('modelNo')}>model No
                                            <span alignitems="left">{col.colToSort === 'modelNo' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell display="flex" alignItems="center" onClick={() => handleSort('qty')}>qty
                                            <span alignitems="left">{col.colToSort === 'qty' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell display="flex" alignItems="center"
                                                   onClick={() => handleSort('productRate')}>product price
                                            <span alignitems="left">{col.colToSort === 'productRate' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell display="flex" alignItems="center"
                                                   onClick={() => handleSort('gstRate')}>gst price
                                            <span alignitems="left">{col.colToSort === 'gstRate' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell display="flex" alignItems="center"
                                                   onClick={() => handleSort('sgstRate')}>sgst price
                                            <span alignitems="left">{col.colToSort === 'sgstRate' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                        <TableCell display="flex" alignItems="center"
                                                   onClick={() => handleSort('totalRate')}>total price
                                            <span alignitems="left">{col.colToSort === 'totalRate' ?
                                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pettyProducts.map(row => (
                                        <TableRow key={row.serialNo}>
                                            <TableCell alignItems="center">{row.serialNo}</TableCell>
                                            <TableCell alignItems="center">{row.modelNo}</TableCell>
                                            <TableCell alignItems="center">{row.qty}</TableCell>
                                            <TableCell alignItems="center">{row.productRate}</TableCell>
                                            <TableCell alignItems="center">{row.gstRate}</TableCell>
                                            <TableCell alignItems="center">{row.sgstRate}</TableCell>
                                            <TableCell alignItems="center">{row.totalRate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabPanel>



                <TabPanel value={value} index={3} dir={theme.direction}>
                    <Card style={{maxWidth: 1400, marginLeft: 10}}>
                        <CardContent>
                            Purchase Details
                            <Typography color="textSecondary">
                                <Purchase purchase={purchase} total={total} getPurchase={getPurchase}/>

                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={4} dir={theme.direction}>
                    <Card
                        style={{maxWidth: 1400 , minWidth: 1400,height: 1000, textAlign: "center" , marginLeft: 10 }}>

                    <CardContent>
                            Sales Line Chart
                            <Typography color="textSecondary">
                               <SimpleLineChart/>
                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>

                <TabPanel value={value} index={5} dir={theme.direction}>
                    <Card
                        style={{maxWidth: 1400 , minWidth: 1400,height: 1000, textAlign: "center" , marginLeft: 10 }}>
                        <CardContent>
                            Sales Pie Chart
                            <Typography color="textSecondary">
                                <Example />
                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={6} dir={theme.direction}>
                    <Card
                        style={{maxWidth: 1400 , minWidth: 1400,height: 1000, textAlign: "center" , marginLeft: 10 }}>
                        <CardContent>
                            Sales Bar Chart
                            <Typography color="textSecondary">
                                <Sample />
                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}
// disabled={!!this.props.creditDue.duePaid}
