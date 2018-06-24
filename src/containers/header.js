import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import eventBus from '../utils/eventBus'
import stateManager from '../utils/stateManager'

export default class Header extends Component{
    constructor(){
        super()
        this.eventBus = eventBus
        this.stateManager = stateManager
        this.state={nav:'list'}
    }

    componentDidMount(){
        let that = this
        this.setState({nav:this.stateManager.state.nav})
        this.eventBus.addListener('updateNav',()=>{
            that.setState({nav:that.stateManager.state.nav})
        })
    }

    getStyle=(nav)=>{
        if(nav == this.state.nav){
            return {color:'#ADFF2F',fontSize:'15px'}
        }
        return {color:'#FFF',fontSize:'15px'}
    }

    onButtonClick=(nav)=>{
        if(nav != this.state.nav){
            this.stateManager.setNav(nav)
        }
    }

    render(){
        return (
            <AppBar position="static">
                <Toolbar>
                    <div className="header-container">
                        <i className="icon iconfont icon-people"></i>
                        <span>合作CP</span>
                    </div>
                    <div className="header-nav">
                        <Button style={this.getStyle('list')} onClick={()=>this.onButtonClick('list')}>需求列表</Button>
                        <Button style={this.getStyle('mine')} onClick={()=>this.onButtonClick('mine')}>我的</Button>
                    </div>
                </Toolbar>
            </AppBar>
        )
    }
}