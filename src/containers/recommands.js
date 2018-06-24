import React, { Component } from 'react';

import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';

import RecommandItem from './recommandItem'
import RecommandItemDetail from './recommandDetail'
import CreateRecommand from './createRecommand'
import CreateRequest from './createRequest'
import stateManager from '../utils/stateManager'
import * as nebulasUtil from '../utils/nebulasUtils'
import eventBus from '../utils/eventBus'

export default class Recommands extends Component{
    constructor(){
        super()
        this.state = {showCreate:false,list:[]}
    }

    

    componentDidMount(){
        let that = this
        this.setState({list:stateManager.state.demands})
        eventBus.addListener('updateDemands',()=>{
            console.log(stateManager.state.demands)
            that.setState({list:stateManager.state.demands})
        })

        setTimeout(()=>{
            stateManager.showLoading('拉取最新数据...')
        
            nebulasUtil.getAllDemandList().then((res)=>{
                stateManager.showLoading('数据已更新...')
                setTimeout(()=>{
                    stateManager.hideLoading()
                },2000)
                stateManager.setDemands(res.items)
                stateManager.hideLoading()
            })
        },50)
    }

    createDemand(title,content,contact,types){
        stateManager.showLoading('保存需求...')
        nebulasUtil.saveDemands(title,content,contact,types).then(()=>{
            stateManager.showLoading('拉取最新数据...')
            nebulasUtil.getAllDemandList().then((res)=>{
                stateManager.showLoading('数据已更新...')
                setTimeout(()=>{
                    stateManager.hideLoading()
                },1000)
                stateManager.setDemands(res.items)
                stateManager.hideLoading()
            })
        })
    }

    onShowCreate(){
        this.setState({showCreate:true})
    }

    onHideCreate(){
        this.setState({showCreate:false})
    }

    renderCreate(){
        if(this.state.showCreate){
            return (
                <CreateRecommand oncreate={this.createDemand.bind(this)} onCancel={this.onHideCreate.bind(this)}></CreateRecommand>
            )
        }
    }

    createRequest(content,contact,title,targetId){
        stateManager.showLoading('提交请求...')
        nebulasUtil.saveRequest(content,contact,title,targetId).then(()=>{
            stateManager.showLoading('拉取最新数据...')
            nebulasUtil.getAllDemandList().then((res)=>{
                stateManager.showLoading('数据已更新...')
                setTimeout(()=>{
                    stateManager.hideLoading()
                },1000)
                stateManager.setDemands(res.items)
                stateManager.hideLoading()
            })
        })
    }

    render(){
        const {list} = this.state
        let listRes = list.filter((item)=>{
            return !item.isUsers
        })
        let items = listRes.map((item)=>{
            return <RecommandItem createRequest={this.createRequest.bind(this)} key={item.id} data={item}></RecommandItem>
        })
        return (
            <div>
                <div className="common-container" style={{width:'940px',margin:'auto',overflowY:'auto'}}>
                    <div>
                        {items}
                    </div>
                    {this.renderCreate()}
                </div>
                <Button onClick={this.onShowCreate.bind(this)} style={{position:'fixed',top:'80px',right:'80px'}} variant="fab" color="primary">
                    <AddIcon />
                </Button>
            </div>
        )
    }
}