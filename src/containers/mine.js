import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

import RecommandItem from './recommandItem';
import RequestItem from './requestItem'

import eventBus from '../utils/eventBus'
import stateManager from '../utils/stateManager'
import * as nebulasUtil from '../utils/nebulasUtils'

export default class Mine extends Component{
    constructor(){
        super()
        this.state = {tag:'list',remmands:[],requests:[]}
    }

    componentDidMount(){
        const {myRecommands,myRequests} = stateManager.state
        this.setState({remmands:myRecommands,requests:myRequests})
        let that = this
        this.setState({tag:stateManager.state.tag})
        eventBus.addListener('updateTag',()=>{
            that.setState({tag:stateManager.state.tag})
        })

        eventBus.addListener('updateMyRecommands',()=>{
            that.setState({remmands:stateManager.state.myRecommands})
        })

        eventBus.addListener('updateMyRequests',()=>{
            that.setState({requests:stateManager.state.myRequests})
        })

        setTimeout(()=>{
            stateManager.showLoading('拉取最新数据...')
            nebulasUtil.getUserDemands().then((res)=>{
                // stateManager.showLoading('数据已更新 50% ...')
                // setTimeout(()=>{
                //     stateManager.hideLoading()
                // },1000)
                stateManager.setMyRecommands(res.items)
                console.log(res.items)
                nebulasUtil.getUserRequests().then(res=>{
                    stateManager.showLoading('数据已更新...')
                    stateManager.setMyRequests(res.items)
                    console.log(res.items)
                    setTimeout(()=>{
                        stateManager.hideLoading()
                    },1000)
                })
                // stateManager.hideLoading()
            })
        },50)
    }

    updateRecommand(title,content,contact,types,id){
        stateManager.showLoading('更新需求...')
        nebulasUtil.updateDemands(title,content,contact,types,id).then(()=>{
            stateManager.showLoading('拉取最新数据...')
            nebulasUtil.getUserDemands().then((res)=>{
                stateManager.showLoading('数据已更新...')
                setTimeout(()=>{
                    stateManager.hideLoading()
                },1000)
                stateManager.setMyRecommands(res.items)
                stateManager.hideLoading()
            })
        })
    }

    renderList(){
        if(this.state.tag == 'list'){
            const {remmands} = this.state
            let items = remmands.map(item=>{
                return <RecommandItem updateRemand={this.updateRecommand.bind(this)} key={item.id} data={item} hideRequst></RecommandItem>
            })
            return (
                <div className="common-container" style={{top:'120px',width:'940px',margin:'auto',overflowY:'auto'}}>
                    {items}
                </div>
            )
        }
    }

    handleRaRe(list){
        let arr = []
        for(let i = 0;i<list.length;i++){
            const {requestArr,address,contact,content,didRequest,hasRequest,id,requestIds,title,types} = list[i]
            let target = {address,contact,content,didRequest,hasRequest,id,requestIds,title,types}
            for(let j=0;j<requestArr.length;i++){
                let item = {...requestArr[i]}
                item.target = target
                arr.push(item)
            }
        }
        return arr
    }

    renderRequest(){
        if(this.state.tag == 'request'){
            const {requests,remmands} = this.state
            let itemRes = requests.filter(item=>{
                return !item.requestAgree
            })
            let items = itemRes.map(item=>{
                return <RequestItem key={item.id} data={item}></RequestItem>
            })
            let items2 = this.handleRaRe(remmands).map((item)=>{
                return <RequestItem key={item.id} data={item}></RequestItem>
            })
            return (
                <div className="common-container" style={{top:'120px',width:'940px',margin:'auto',overflowY:'auto'}}>
                    <h4 style={{padding:'7px'}}>我的请求</h4>
                    {items}
                    <h4 style={{padding:'7px'}}>请求通过</h4>
                    {items2}
                </div>
            )
        }
    }

    renderPassRequest(){
        if(this.state.tag == 'pass'){
            return (
                <div className="common-container" style={{top:'120px',width:'940px',margin:'auto',overflowY:'auto'}}>
                    <h4 style={{padding:'7px'}}>申请通过</h4>
                    <RequestItem pass></RequestItem>
                    <RequestItem pass></RequestItem>
                    <RequestItem pass></RequestItem>
                    <RequestItem pass></RequestItem>
                    <RequestItem pass></RequestItem>
                    <h4 style={{padding:'7px'}}>请求通过</h4>
                    <RequestItem pass></RequestItem>
                    <RequestItem pass></RequestItem>
                    <RequestItem pass></RequestItem>
                    <RequestItem pass></RequestItem>
                    <RequestItem pass></RequestItem>
                </div>
            )
        }
    }

    onButtonClick=(tag)=>{
        console.log(tag,this.state.tag)
        if(tag != this.state.tag){
            stateManager.setTag(tag)
        }
    }

    getColor=(tag)=>{
        if(tag == this.state.tag){
            return 'primary'
        }
        return 'default'
    }

    render(){
        return (
            <div className="common-container" style={{width:'940px',margin:'auto',overflowY:'auto'}}>
                <div>
                    <Button onClick={()=>{this.onButtonClick('list')}} variant="outlined" color={this.getColor('list')}>申请列表</Button>                    
                    <Button onClick={()=>{this.onButtonClick('request')}} variant="outlined" color={this.getColor('request')} style={{marginLeft:'20px'}}>请求列表</Button>

                    <Button onClick={()=>{this.onButtonClick('pass')}} variant="outlined" color={this.getColor('pass')} style={{marginLeft:'20px'}}>通过列表</Button>
                </div>
                <div>
                    {this.renderList()}
                    {this.renderRequest()}
                    {this.renderPassRequest()}
                </div>
            </div>
        )
    }
}