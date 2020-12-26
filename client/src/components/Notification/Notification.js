import React, {useState, useEffect} from 'react';
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
import orderBy from 'lodash/orderBy';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

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
    width: 200,
  },
}));
const useStyles2 = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  table: {
    minWidth: 500,
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


export default function CustomPaginationActionsTable() {
  const classes = useStyles2();
  const classs = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const invertDir = {
    'asc': 'desc',
    'desc': 'asc'
  }
  const [col, setCol] = useState({
    colToSort: '',
    sortDir: 'asc',
    query: '',
    colToQuery: 'first'
  });
  const [values, setValues] = React.useState({
    first: '',
    last: '',
    location: ''
  });

  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8081/api/user')
        .then(response => response.json())
        .then(data => {
          setData(data); // set customers in state
          console.log('the cols are', data);
          console.log('the cols are', data.cols);

        });
  }, []);


  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
    },
  }))(TableRow);

  const handleSort = colName => {
    console.log('iam get called', colName);
    setCol({
      colToSort: colName,
      sortDir: col.colToSort === colName ? invertDir[col.sortDir] : 'desc'
    });
    console.log(col.sortDir, col.colToSort);
    console.log(col.colToSort);

  }
  const handleChange = name => event => {
    setValues({...values, [name]: event.target.value.toLowerCase()});
  };
  const [select, setSelect] = React.useState({
    name: 'user'

  });

  function handleChangeSelect(event) {
    setSelect(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));

    console.log('the select field', select.user);
  }

  return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <form className={classes.container} noValidate autoComplete="off">
            <TextField
                id="standard-name"
                label="first"
                className={classs.textField}
                value={values.name}
                onChange={handleChange('first')}
                margin="normal"
            />
            <FormControl className={classs.formControl}>
              <InputLabel>name</InputLabel>
              <Select
                  value={select.user}
                  onChange={handleChangeSelect}
                  displayEmpty
                  name='user'
                  className={classs.selectEmpty}
                  inputProps={{ 'aria-label': 'user' }}
              >

                <MenuItem value='first'>first</MenuItem>
                <MenuItem value='last'>last</MenuItem>
                <MenuItem value='location'>location</MenuItem>
              </Select>
            </FormControl>
          </form>

          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell onClick={() => handleSort('first')}>first
                  <span>{col.colToSort === 'first' ?
                      (col.sortDir === 'asc' ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="right" onClick={() => handleSort('last')}>last
                  <span>{col.colToSort === 'last' ?
                      (col.sortDir === 'asc' ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
                <StyledTableCell align="right" onClick={() => handleSort('location')}>location
                  <span>{col.colToSort === 'location' ?
                      (col.sortDir === 'asc' ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>) : null}</span>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                orderBy(
                    values.first ? data.filter(x => x[select.user].includes(values.first)) : data,

                    // values.first? data.filter(x => x.first.toLowerCase().includes(values.first)):  data,
                    col.colToSort, col.sortDir).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(row => (

                        <StyledTableRow key={row.id}>
                          <StyledTableCell component="th" scope="row">
                            {row.first}
                          </StyledTableCell>
                          <StyledTableCell align="right">{row.last}</StyledTableCell>
                          <StyledTableCell align="right">{row.location}</StyledTableCell>
                        </StyledTableRow>

                    ))}

              {emptyRows > 0 && (
                  <TableRow style={{height: 48 * emptyRows}}>
                    <StyledTableCell colSpan={6}/>
                  </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                    rowsPerPageOptions={[3, 5, 10, 25]}
                    colSpan={3}
                    count={data.length}
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
        </div>
      </Paper>
  );
}

