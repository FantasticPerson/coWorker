import React,{ Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default class RecommandItemDetail extends Component{
    constructor(){
        super()
    }

    onCancel(){
        const {cancleHandler} = this.props
        cancleHandler()
    }

    createRequest(){
        const {showRequest} = this.props
        showRequest()
    }

    renderButton(){
        console.log(this.props.pass)
        if(!this.props.pass){
            return (
                <Button onClick={this.createRequest.bind(this)} color="primary" style={{display:'block'}}>申请</Button>
            )
        }
    }

    render(){
        const {data} = this.props
        return (
            <Dialog open={true} maxWidth={false} onClose={this.onCancel.bind(this)}>
                <DialogTitle>
                    <div style={{width:'560px',display:'inline-block'}}>
                        <p>test</p>
                        <p style={{color:'#ccc',fontSize:'13px'}}>author : 12345</p>
                    </div>
                    <IconButton onClick={this.onCancel.bind(this)} style={{marginTop:'-35px'}} color="inherit" aria-label="Close">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Card style={{width:'600px',height:'450px',display:'inline-block',margin:'5px',cursor:'pointer'}}>
                        <CardContent>
                            <Typography component="p" style={{height:'405px',overflowY:'auto'}}>
                                This impressive paella is a perfect party dish and a fun meal to cook together with
                                your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                            </Typography>
                        </CardContent>
                        <CardActions>
                            
                        </CardActions>
                    </Card>
                    {this.renderButton()}
                </DialogContent>
            </Dialog>
        )
    }
}