// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// // import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
//
// const useStyles = makeStyles({
//   table: {
//     minWidth: 650,
//   },
// });
//
// function createData(name, calories, fat, carbs, protein ) {
//   return { name, calories, fat, carbs, protein };
// }
//
// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];
//
// export default function Tables() {
//   const classes = useStyles();
//
//   return (
//         <Table className={classes.table} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell>Dessert (100g serving)</TableCell>
//               <TableCell align="right">Calories</TableCell>
//               <TableCell align="right">Fat&nbsp;(g)</TableCell>
//               <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//               <TableCell align="right">Protein&nbsp;(g)</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.map((row) => (
//                 <TableRow key={row.name}>
//                   <TableCell component="th" scope="row">
//                     {row.name}
//                   </TableCell>
//                   <TableCell align="right">{row.calories}</TableCell>
//                   <TableCell align="right">{row.fat}</TableCell>
//                   <TableCell align="right">{row.carbs}</TableCell>
//                   <TableCell align="right">{row.protein}</TableCell>
//                 </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//   );
// }

import React from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {useEffect, useState} from 'react';
import axios from 'axios';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import PropTypes from 'prop-types';
import {makeStyles, useTheme, Theme, createStyles} from '@material-ui/core/styles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import orderBy from 'lodash/orderBy';
import TextField from "@material-ui/core/TextField/TextField";

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});
const useStyles1 = makeStyles((theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    }),
);


function Row(props) {
    const {row} = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell align="center">
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell align="center" component="th" scope="row">
                    {row.billNo}
                </TableCell>
                <TableCell align="center">{row.salesDate.slice(0, 10)}</TableCell>
                <TableCell align="center">{row.customerName}</TableCell>
                <TableCell align="center">{row.phoneNo}</TableCell>
                <TableCell align="center">{row.totalNetAmount}</TableCell>
                <TableCell align="center">{row.billType}</TableCell>
                <TableCell align="center">{row.delivered.toString()}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Sold Product Details
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead style={{backgroundColor: 'lightblue', color: '#000000'}}>
                                    <TableRow>
                                        <TableCell align="center">serialno</TableCell>
                                        <TableCell align="center">modelno</TableCell>
                                        <TableCell align="center">qty</TableCell>
                                        <TableCell align="center">product price ($)</TableCell>
                                        <TableCell align="center">gst price ($)</TableCell>
                                        <TableCell align="center">sgst price ($)</TableCell>
                                        <TableCell align="center">total price ($)</TableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.products.map((historyRow) => (
                                        <TableRow key={historyRow.serialNo}>
                                            <TableCell align="center" component="th" scope="row">
                                                {historyRow.serialNo}
                                            </TableCell>
                                            <TableCell align="center">{historyRow.modelNo}</TableCell>
                                            <TableCell align="center">{historyRow.qty}</TableCell>
                                            <TableCell align="center">{historyRow.productRate}</TableCell>
                                            <TableCell align="center">{historyRow.gstRate}</TableCell>
                                            <TableCell align="center">{historyRow.sgstRate}</TableCell>
                                            <TableCell align="center">{historyRow.totalRate}</TableCell>

                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const {count, page, rowsPerPage, onChangePage} = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
                {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
            </IconButton>
        </div>
    );
}


export default function Tables() {
    let timer = null;
    let array = [];
    let value = '';
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [val, setVal] = React.useState('');
    const [orderBy, setOrderBy] = React.useState('customerName');
    const [select, setSelect] = React.useState([]);
    const [values, setValues] = React.useState({
        first: '',
        last: '',
        location: '',
        email: '',
        hobby: ''
    });


    const [col, setCol] = useState({
        colToSort: 'customerName',
        sortDir: 'asc',
        reverse: false,
        query: '',
        filter: ''
    });

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, sales.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    useEffect(() => {
        const fetchSale = async () => {
            setLoading(true);
            axios.get('http://localhost:8081/api/sale')
                .then(res => {
                    setSales(res.data);
                    console.log('responce', res.data);
                    console.log('state', sales);
                    setLoading(false);
                })
                .catch(err => console.log(err))
        }
        fetchSale();
        // setSelect(sales.filter(sale => sale.customerName.includes(select)));

    }, []);

    const handleSort = (colName) => {
        setCol({
            colToSort: colName,
            reverse: !col.reverse,
        });
        console.log('the col to sort and order ', colName, col.reverse ? 'desc' : 'asc');
    }

    function descendingComparator(a, b, orderBy) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }

    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const handleChange = name => event => {
        console.log('iam in');
        event.preventDefault();
        value = event.target.value.toLowerCase();
        console.log('each time the value --->', value);
        clearTimeout(timer);
        timer = setTimeout(() => {
            filter(value);
        }, 1000);

    }
    const [didMount, setDidMount] = useState(false);

    useEffect(() => {
        setDidMount(true);
        setSelect(array);
        console.log('the filtered array of select and length===>', select, select.length);
        return () => setDidMount(false);
    }, [])

    function filter(name) {
        console.log('the filtered value===>', name);
        // setSelect(sales.filter(sale => sale.customerName.includes(name)));
        array = sales.filter(sale => sale.customerName.toLowerCase().includes(name.toLowerCase()) || sale.billType.toLowerCase().includes(name.toLowerCase()));
        console.log('the filtered date===>', array);
    }

    // const  handleKey = (event)  => {
    //     const keyCode = event.keyCode;
    //     if (event.keyCode === 13) {
    //         event.preventDefault();
    //         const val = event.target.value.toLowerCase();
    //         filter(val);
    //     }
    // }
    return (
        <TableContainer component={Paper}>

            <form noValidate autoComplete="off">
                <TextField
                    id="standard-name"
                    label="enter text"
                    value={values.name}
                    onChange={handleChange()}
                    // onKeyUp={handleKey()}
                    margin="normal"
                />
            </form>

            <Table
                aria-label="collapsible table">
                <TableHead style={{backgroundColor: 'pink', color: 'white'}}>
                    <TableRow>
                        <TableCell/>
                        <TableCell alignitems="center"
                                   onClick={() => handleSort('billNo')}>Bill No
                            <span>{col.colToSort === 'billNo' ?
                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                        </TableCell>
                        <TableCell alignitems="center"
                                   onClick={() => handleSort('salesDate')}>Sales Date
                            <span>{col.colToSort === 'salesDate' ?
                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                        </TableCell>
                        <TableCell alignitems="center"
                                   onClick={() => handleSort('customerName')}>customerName
                            <span>{col.colToSort === 'customerName' ?
                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                        </TableCell>
                        <TableCell alignitems="center"
                                   onClick={() => handleSort('phoneNo')}>phoneNo
                            <span>{col.colToSort === 'phoneNo' ?
                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                        </TableCell>
                        <TableCell alignitems="center"
                                   onClick={() => handleSort('totalNetAmount')}>totalnetamount
                            <span>{col.colToSort === 'totalnetamount' ?
                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                        </TableCell>
                        <TableCell alignitems="center"
                                   onClick={() => handleSort('billType')}>billtype
                            <span>{col.colToSort === 'billtype' ?
                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                        </TableCell>
                        <TableCell alignitems="center"
                                   onClick={() => handleSort('delivered')}>delivered
                            <span>{col.colToSort === 'delivered' ?
                                (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                        </TableCell>
                        {/*<TableCell>billno </TableCell>*/}
                        {/*<TableCell align="right">salesdate</TableCell>*/}
                        {/*<TableCell align="right">customerName&nbsp;</TableCell>*/}
                        {/*<TableCell align="right">phoneNo&nbsp;</TableCell>*/}
                        {/*<TableCell align="right">totalnetamount&nbsp;</TableCell>*/}
                        {/*<TableCell align="right">billtype&nbsp;</TableCell>*/}
                        {/*<TableCell align="right">delivered&nbsp;</TableCell>*/}

                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        // select.length !== 0  ? stableSort(select, getComparator(col.reverse ? 'desc' : 'asc',col.colToSort))
                        //        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) :
                        //    stableSort(sales, getComparator(col.reverse ? 'desc' : 'asc',col.colToSort))
                        //        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

                        stableSort(values.name === undefined ? sales : sales.filter(sale => sale.customerName.toLowerCase().includes(values.name.toLowerCase()) || sale.billType.toLowerCase().includes(values.nametoLowerCase())),
                            getComparator(col.reverse ? 'desc' : 'asc', col.colToSort))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                                <Row key={row._id} row={row}/>
                            ))}
                    {emptyRows > 0 && (
                        <TableRow style={{height: 10 * emptyRows}}>
                            <TableCell colSpan={8}/>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, {label: 'All', value: -1}]}
                            colSpan={3}
                            count={sales.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: {'aria-label': 'rows per page'},
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}

// {(rowsPerPage > 0
//         ? sales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//         : sales
// ).map((row) => (
