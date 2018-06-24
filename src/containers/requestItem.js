import React,{ Component } from 'react';

import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import CardHeader from '@material-ui/core/CardHeader';

import RequestDetail from './requestItemDetail'

export default class RequestItem extends Component{
    constructor(){
        super()
        this.state = {showDetail:false}
    }

    showDetail(){
        this.setState({showDetail:true})
    }


    hideDetail(){
        this.setState({showDetail:false})
    }

    renderDetail(){
        if(this.state.showDetail){
            const {pass} = this.props
            return <RequestDetail pass={pass}></RequestDetail>
        }
    }

    renderActions(){
        if(this.props.pass){
            return
        } else {
            return (
                <CardActions>
                    <Button variant="contained" color="primary" style={{marginLeft:'800px'}}>同意</Button>
                </CardActions>
            )
        }
    }

    renderContact(){
        if(this.props.pass){
            return (
                <Typography component="p" style={{margin:'5px 0'}}>
                    微信:13818184608
                </Typography>
            )
        }
    }

    render(){
        let subTitle = this.props.pass ? "请求加入 时代发生的" : "已加入 时代发生的"
        let height = this.props.pass ? '140px' : '165px'
        return(
            <div style={{display:'inline-block'}}>
                <Card onDoubleClick={this.showDetail.bind(this)} style={{width:'920px',height:height,display:'inline-block',margin:'5px',cursor:'pointer'}}>
                    <CardHeader style={{padding:'5px 24px'}} title="test" subheader={subTitle}/>
                    <CardContent style={{padding:'5px 24px'}}>
                        <Typography component="p" style={{height:'40px',overflowY:'auto'}}>
                            This impressive paella is a perfect party dish and a fun meal to cook together with
                            your guests. Add 1 cup of frozen peas along with the mussels, if you like.
                        </Typography>
                        {this.renderContact()}
                    </CardContent>
                    {this.renderActions()}
                </Card>
                {this.renderDetail()}
            </div>
        )
    }
}