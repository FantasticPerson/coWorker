import React, { Component } from 'react';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import RecommandDetail from './recommandDetail'
import CreateRequest from './createRequest'
import EditRecommand from './editRecommand'

export default class RecommandItem extends Component{
    constructor(){
        super()
        this.state = {showDetail:false,showRequest:false,showEdit:false}
    }

    showDetail(){
        this.setState({showDetail:true})
    }

    hideDetail(){
        this.setState({showDetail:false})
    }

    renderDetail(){
        const {pass,data} = this.props
        if(this.state.showDetail && !this.state.showRequest){
            return (
                <RecommandDetail data={data} pass={pass} showRequest={this.showRequest.bind(this)} cancleHandler={this.hideDetail.bind(this)}></RecommandDetail>
            )
        }
    }

    showRequest(){
        this.setState({showRequest:true})
    }

    hideRequest(){
        this.setState({showRequest:false})
    }

    renderRequest(){
        if(this.state.showRequest){
            const {createRequest,data} = this.props
            return <CreateRequest targetId={data.id} onrequest={createRequest} onCancel={this.hideRequest.bind(this)}></CreateRequest>
        }
    }

    showEdit(){
        this.setState({showEdit:true})
    }

    hideEdit(){
        this.setState({showEdit:false})
    }

    renderEdit(){
        if(this.state.showEdit){
            const {data,updateRemand} = this.props
            return (
                <EditRecommand updateRemand={updateRemand} hideEdit={this.hideEdit.bind(this)} data={data}></EditRecommand>
            )
        }
    }

    renderActions(){
        const {hideRequst,data} = this.props
        let disabled = data.isUsers
        if(hideRequst){
            return (
                <CardActions>
                    <Button variant="contained" color="primary"  onClick={this.showEdit.bind(this)}>编辑</Button>
                </CardActions>
            )
        } else if(data.hasRequest){
            return (
                <CardActions>
                    <Button variant="contained" color="primary" disabled={true} onClick={this.showRequest.bind(this)}>申请通过</Button>
                </CardActions>
            )
        } else if(data.didRequest){
            return (
                <CardActions>
                    <Button variant="contained" color="primary" disabled={true} onClick={this.showRequest.bind(this)}>已申请</Button>
                </CardActions>
            )
        }
        return (
            <CardActions>
                <Button variant="contained" color="primary" disabled={disabled} onClick={this.showRequest.bind(this)}>申请</Button>
            </CardActions>
        )
    }

    render(){
        const {data} = this.props
        return (
            <div style={{display:'inline-block'}}>
                <Card onDoubleClick={this.showDetail.bind(this)} style={{width:'300px',height:'250px',display:'inline-block',margin:'5px',cursor:'pointer'}}>
                    <CardContent>
                        <Typography style={{overflow: 'hidden',textOverflow: 'ellipsis',width: '260px'}} variant="headline">{data.title}</Typography>
                        <Typography  style={{overflow: 'hidden',textOverflow: 'ellipsis',width: '260px'}} color="textSecondary">{data.address}</Typography>
                        <Typography component="p" style={{height:'115px',padding:'5px,0',overflowY:'auto',fontSize:'16px'}}>
                            {data.content}
                        </Typography>
                    </CardContent>
                    {this.renderActions()}
                </Card>
                {this.renderDetail()}
                {this.renderRequest()}
                {this.renderEdit()}
            </div>
        )
    }
}