import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {withStyles} from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
// import orderBy from 'lodash/orderBy';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from "@material-ui/core/Button";
import {ValidatorForm} from "react-material-ui-form-validator";

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: 120,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 100,
  },
}));
const useStyles2 = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  table: {
    minWidth: '500',
    textAlign: 'center',

  },

  tableWrapper: {
    overflowX: 'auto',
  },
}));

function TablePaginationActions(props) {


  const classes = useStyles1();
  const theme = useTheme();
  const {count, page, rowsPerPage, onChangePage} = props;

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
  }

  function handleLastPageButtonClick(event) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }

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

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};


// export default function CustomPaginationActionsTable() {
const Sales = ({
                      items,
                      total,
                      getItems,
                 displayProductTable
                    }) => {
  const classes = useStyles2();
  const classs = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const invertDir = {
    'asc': 'desc',
    'desc': 'asc'
  }
  const [col, setCol] = useState({
    colToSort: 'customerName',
    sortDir: 'asc',
    reverse : false,
    query: '',
    filter:''
  });
  const [values, setValues] = React.useState({
    billNo: '',
    salesDate: '',
    customerName: '',
    address: '',
    phoneNo: '',
    totalNetAmount:'',
    billType:'',
    delivered:''
  });

  // const [data, setData] = useState([]);
  //
  // useEffect(() => {
  // fetch('http://localhost:8081/api/user')
  //     .then(response => response.json())
  //     .then(data => {
  //         setData(data); // set customers in state
  //         console.log('the cols are', data);
  //         console.log('the cols are', data.cols);
  //
  //     });
  // }, []);


  const emptyRows = rowsPerPage - Math.min(rowsPerPage, parseInt(total, 10) - page * rowsPerPage);

  function handleChangePage(event, newPage) {
    console.log('the new page , rows per page :', newPage, rowsPerPage, col.colToSort, col.filter);
    setPage(newPage);
    getItems(newPage, rowsPerPage, col.colToSort, col.sortDir, col.filter);
  }

  function handleChangeRowsPerPage(event) {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
    console.log('the new selection and page :', (parseInt(event.target.value, 10)), 0, col.colToSort, col.filter);

    getItems(0, parseInt(event.target.value, 10), col.colToSort, col.sortDir, col.filter);

  }


  const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
      tableRow: {
        "&$hover:hover": {
          backgroundColor: "lightblue"
        }
      },
      tableCell: {
        "$hover:hover &": {
          color: "pink"
        }
      },
      hover: {},
    },
  }))(TableRow);

  const handleSort = (colName) => {
    setCol({
      colToSort: colName,
      reverse: !col.reverse,
      // sortDir: col.colToSort === colName ? (col.sortDir === 'desc' ? 'asc' : 'desc') : 'desc'

      // sortDir: col.colToSort === colName ? invertDir[col.sortDir] : 'desc'
    });
    setPage(0);
    console.log('the col to sort and order ', colName, col.filter);
    getItems(0, rowsPerPage, colName, col.reverse ? 'desc' : 'asc', col.filter);


  }
  const handleChange = name => event => {
    setValues({...values, [name]: event.target.value.toLowerCase()});
    console.log('the filter order:', event.target.value.toLowerCase());
    setCol({
      filter: event.target.value ? event.target.value.toLowerCase() : ''
    });
    getItems(0, rowsPerPage, col.colToSort, col.reverse ? 'desc' : 'asc', event.target.value.toLowerCase());

  };

  const displayProduct = row => {
            displayProductTable(row);
  }

  return (
      <Paper className={classes.root}>
          <form className={classes.container} noValidate autoComplete="off">
        <FormControl className={classs.formControl}>
              <TextField
                  id="standard-name"
                  label="enter text"
                  className={classs.textField}
                  // value={col.filter}
                  value={values.name}
                  // onChange={handleChange('first')}
                  onChange={handleChange()}

                  margin="normal"
              />
        </FormControl>
          </form>

          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={() => handleSort('billNo')}>Bill No
                  <span>{col.colToSort === 'billNo' ?
                      (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="center" onClick={() => handleSort('salesDate')}>Sales Date
                  <span>{col.colToSort === 'salesDate' ?
                      (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="center" onClick={() => handleSort('customerName')}>Customer Name
                  <span>{col.colToSort === 'customerName' ?
                      (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="center" onClick={() => handleSort('address')}>Address
                  <span>{col.colToSort === 'address' ?
                      (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="center" onClick={() => handleSort('phoneNo')}>Phone No
                  <span>{col.colToSort === 'phoneNo' ?
                      (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="center" onClick={() => handleSort('totalNetAmount')}>Total Net Amount
                  <span>{col.colToSort === 'totalNetAmount' ?
                      (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="center" onClick={() => handleSort('billType')}>Bill Type
                  <span>{col.colToSort === 'billType' ?
                      (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="center" onClick={() => handleSort('delivered')}>Delivered
                  <span>{col.colToSort === 'delivered' ?
                      (col.reverse ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="center">Details</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                // orderBy(
                //     values.first ? items.filter(x => (x[select.user] === undefined ? x.first : x[select.user]).includes(values.first)) : items,
                //     // values.first ? data.filter(x => x[select.user].includes(values.first)) : data,
                //
                //     // values.first? data.filter(x => x.first.toLowerCase().includes(values.first)):  data,
                //     col.colToSort, col.sortDir).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                items.map(row => (

                    <StyledTableRow hover  classes={{ hover: classes.hover }}className={classes.tableRow}key={row.billNo}>
                      <StyledTableCell component="th" scope="row">
                        {row.billNo}
                      </StyledTableCell>
                      <StyledTableCell align="center">{row.salesDate}</StyledTableCell>
                      <StyledTableCell align="center">{row.customerName}</StyledTableCell>
                      <StyledTableCell align="center">{row.address}</StyledTableCell>
                      <StyledTableCell align="center">{row.phoneNo}</StyledTableCell>
                      <StyledTableCell align="center">{row.totalNetAmount}</StyledTableCell>
                      <StyledTableCell align="center">{row.billType}</StyledTableCell>
                      <StyledTableCell align="center">{row.delivered.toString()}</StyledTableCell>
                      <StyledTableCell align="center">
                      {/*<div style={{width: "130px"}}>*/}
                        {/*<UsersModel buttonLabel="Edit" item={row} updateState={updateState}/>{' '}*/}
                        <Button variant="contained" color="primary" onClick={() => displayProduct(row)}>Details</Button>

                      {/*</div>*/}
                      </StyledTableCell>
                    </StyledTableRow>

                ))}

              {/*{emptyRows > 0 && (*/}
              {/*    <TableRow style={{height: 48 * emptyRows}}>*/}
              {/*        <StyledTableCell colSpan={6}/>*/}
              {/*    </TableRow>*/}
              {/*)}*/}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                    rowsPerPageOptions={[3, 5, 7, 6, 10, 15, 12, 20]}
                    colSpan={3}
                    count={total}
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
      </Paper>
  );
}
Sales.propTypes = {
  items: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  getItems: PropTypes.func.isRequired,
  displayProductTable: PropTypes.func.isRequired,

};
export default Sales;