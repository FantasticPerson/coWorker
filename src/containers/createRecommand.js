import React,{ Component } from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Chip from '@material-ui/core/Chip'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'

export default class CreateRecommand extends Component{
    constructor(){
        super()
        this.state={chipArr:[],contact:'微信'}
        this.contentArr = ['微信','电话','QQ','邮箱']
        this.tags = ['Dapp','WEB前端','IOS','ANDROID','JAVA','后端','产品','UI','其他']
        this.titleRef = React.createRef()
        this.contentRef = React.createRef()
        this.contactRef = React.createRef()
    }

    onConfirm=()=>{
        const {chipArr,contact} = this.state
        if(chipArr.length == 0){
            alert('请至少选择一个标签')
            return
        }
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
        const {oncreate,onCancel} = this.props
        let contactText = `${this.contentArr.indexOf(contact)}-{${contactValue}}`
        let typesText = chipArr.join(',')
        oncreate(titleValue,contentValue,contactText,typesText)
        onCancel()
    }

    onCancel=()=>{
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

    onChipClick=(index)=>{
        let arr = this.state.chipArr
        let index2 = arr.indexOf(index)
        if(index2 >= 0){
            arr.splice(index2,1)
        } else {
            arr.push(index)
        }
        this.setState({chipArr:arr})
    }

    getChipStyle=(index)=>{
        if(this.state.chipArr.indexOf(index) >= 0){
            return {backgroundColor: '#123',color: '#FFF',cursor:'pointer',marginLeft:'2px'}
        }
        return {cursor:'pointer',marginLeft:'2px'}
    }

    render(){
        return (
            <Dialog open={true} maxWidth={false} onClose={this.onCancel}>
                <DialogTitle>新建需求</DialogTitle>
                <DialogContent>
                    <div style={{width:'800px'}}>
                        <h4>请选择至少一个标签</h4>
                        <div style={{height:'40px',lineHeight:'40px'}}>
                            {this.tags.map((item,index)=>{
                                return <Chip key={index} onClick={()=>{this.onChipClick(index)}} style={this.getChipStyle(index)} label={item}/>
                            })}
                        </div>
                        <TextField inputRef={(input)=>{this.titleRef = input}} fullWidth style={{marginTop:'20px'}} label="请输入标题" placeholder="标题"></TextField>
                        <TextField inputRef={(input)=>{this.contentRef=input}} fullWidth style={{marginTop:'20px'}} label="请输入内容" placeholder="内容" multiline rows="4"/>
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
                <Button onClick={this.onConfirm} color="primary">确定</Button>
                <Button onClick={this.onCancel} color="primary" autoFocus>取消</Button>
                </DialogActions>
            </Dialog>
        )
    }
}