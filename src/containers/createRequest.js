import React,{Component} from 'react'

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Button from '@material-ui/core/Button'

export default class CreateRequest extends Component{
    constructor(){
        super()
        this.state={chipArr:[],contact:'微信'}
        this.contentArr = ['微信','电话','QQ','邮箱']

        this.titleRef = React.createRef()
        this.contentRef = React.createRef()
        this.contactRef = React.createRef()
    }

    onConfirmClick = ()=>{
        let titleValue = this.titleRef.value.trim()
        if(titleValue.length == 0){
            alert('请填写标题')
            return
        }
        let contentValue = this.contentRef.value.trim()
        if(contentValue.length == 0){
            alert('请填写内容')
            return
        }
        let contactValue = this.contactRef.value.trim()
        if(contactValue.length == 0){
            alert('请填写联系方式')
            return
        }
        const {contact} = this.state
        let contactText = `${this.contentArr.indexOf(contact)}-{${contactValue}}`

        const {onrequest,targetId,onCancel} = this.props

        onrequest(contentValue,contactText,titleValue,targetId)
        onCancel()
    }

    onCancelClick = ()=>{
        const {onCancel} = this.props
        onCancel()
    }

    handleChange =  event => {
        if(event.target.value != this.state.contact){
            this.setState({
                contact: event.target.value,
            });
        }
    };

    render(){
        return (
            <Dialog open={true} maxWidth={false} onClose={this.onCancelClick}>
                <DialogTitle>新建请求</DialogTitle>
                <DialogContent>
                    <div style={{width:'800px'}}>
                        <TextField  inputRef={(input)=>{this.titleRef = input}} fullWidth style={{marginTop:'20px'}} label="请输入标题" placeholder="标题"></TextField>
                        <TextField inputRef={(input)=>{this.contentRef=input}}  fullWidth style={{marginTop:'20px'}} label="请输入内容" placeholder="内容" multiline rows="4"/>
                        <TextField
                            select
                            value={this.state.contact}
                            onChange={this.handleChange}
                            helperText="选择联系方式"
                            margin="normal"
                            >
                            {this.contentArr.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField inputRef={(input)=>{this.contactRef = input}} style={{marginTop:'20px',width:'300px'}} label="输入内容" placeholder="内容"/>
                    </div>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.onConfirmClick} color="primary">确定</Button>
                <Button onClick={this.onCancelClick} color="primary" autoFocus>取消</Button>
                </DialogActions>
            </Dialog>
        )
    }
}