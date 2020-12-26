import React, { Component } from 'react'
import AccountForm from './CustomerForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import {withStyles} from "@material-ui/core";
import PropTypes from 'prop-types';

const styles = {
    dialogPaper: {
        minHeight: '100vh',
        maxHeight: '100vh',
    },
};
class CustomerModel extends Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            modal: false
        }
    }
    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }))
    }


    componentDidMount() {
        this._isMounted = true;

    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const { classes } = this.props;

        // const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>
        console.log('the passed props are =====>',this.props.accNo);
        const label = this.props.buttonLabel

        let button = ''
        let title = ''

        if(label === 'Edit'){
            button = <EditIcon
                variant="contained"
                color="secondary"
                onClick={this.toggle}
                style={{float: "left", marginRight:"10px"}}>{label}
            </EditIcon>
            title = 'Edit Item'
        } else {
            button = <Button
                variant="contained" color="primary"
                onClick={this.toggle}
                style={{float: "left", marginRight:"10px"}}>{label}
            </Button>
            title = 'Add New Item'
        }

        return (
            <>
                {button}
                <Dialog  fullWidth={true} classes={{ paper: classes.dialogPaper }}
                         maxWidth = {'sm'} open={this.state.modal} onClose={this.toggle} >
                    <DialogTitle >{title}</DialogTitle>
                    <DialogContent>
                        <AccountForm
                            items={this.props.items}
                            addItemToState={this.props.addItemToState}
                            updateState={this.props.updateState}
                            total={this.props.total}
                            accNo={this.props.accNo}

                            toggle={this.toggle}
                            item={this.props.item} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.toggle} color="primary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </>


        )
    }
}
// export default CreditorModel
export default withStyles(styles)(CustomerModel);

//
// <div>
//     {button}
//     <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
//         <ModalHeader toggle={this.toggle} close={closeBtn}>{title}</ModalHeader>
//         <ModalBody>
//             <DueForm
//                 items={this.props.items}
//                 addItemToState={this.props.addItemToState}
//                 updateState={this.props.updateState}
//                 toggle={this.toggle}
//                 item={this.props.item} />
//         </ModalBody>
//     </Modal>
// </div>
