import React, { Component } from 'react'
import DueForm from './DueForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
class DueModel extends Component {
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

    render() {
        // // const closeBtn = <button className="close" onClick={this.toggle}>&times;</button>
        //
        const label = this.props.buttonLabel

        let button = ''
        let title = ''

        if(label === 'Edit'){
            button = <Button
                variant="contained"
                color="secondary"
                onClick={this.toggle}
                style={{float: "left", marginRight:"10px"}}>{label}


                {/*is={this.props.creditDue.duePaid.toString()}*/}
            </Button>
            title = 'Edit Item'
        } else {
            button = <Button
                variant="contained" color="primary"
                onClick={this.toggle}
                disabled={true}
                style={{float: "left", marginRight:"10px"}}>{label}
            </Button>
            title = 'Add New Item'
        }


        return (
            <>
                {button}
                <Dialog wid={"500px"} open={this.state.modal} onClose={this.toggle} >
                    <DialogTitle >Edit Credit Due</DialogTitle>
                    <DialogContent>
                        <DueForm
                            updateState={this.props.updateState}
                            toggle={this.toggle}
                            parentId = {this.props.parentId}
                            creditDue={this.props.creditDue} />
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

export default DueModel

