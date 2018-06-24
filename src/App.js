import React, { Component } from 'react';

import Header from './containers/header'
import Recommands from './containers/recommands'
import Mine from './containers/mine'
import Loading from './containers/loading'

import stateManger from './utils/stateManager'
import eventBus from './utils/eventBus'
import * as nebulasUtil from './utils/nebulasUtils'

class App extends Component {
  constructor(){
    super()
    this.state = {nav:'list',showLoading:false,loadingMsg:''}
  }

  componentDidMount(){
    let that = this
    const {nav,showLoading} = stateManger.state
    this.setState({nav:nav,showLoading:showLoading})

    eventBus.addListener('updateNav',()=>{
      that.setState({nav:stateManger.state.nav})
    })

    eventBus.addListener('updateShowLoading',()=>{
      const {showLoading,loadingMsg} = stateManger.state
      that.setState({showLoading:showLoading,loadingMsg:loadingMsg})
    })
    // nebulasUtil.saveDemands('1','1','1','1')

    // nebulasUtil.getAllDemandList()
    // nebulasUtil.getUserRequests()
    // nebulasUtil.getUserDemands()

    // nebulasUtil.updateDemands('2','content','contact','types','1')

    // nebulasUtil.saveRequest("content","contact","title",'1')

    // nebulasUtil.updateRequest("23","23","23",'1')

    // nebulasUtil.agreeRequest('1','1')

    // nebulasUtil.getUserRequests()
  }

  renderRecommendList(){
    if(this.state.nav == 'list'){
      return <Recommands></Recommands>
    }
  }

  renderMine(){
    if(this.state.nav == 'mine'){
      return <Mine></Mine>
    }
  }

  renderLoading(){
    if(this.state.showLoading){
      return <Loading msg={this.state.loadingMsg}></Loading>
    }
  }

  render() {
    return (
      <div className="App">
        <Header></Header>
        <div className="app-content">
          {this.renderRecommendList()}
          {this.renderMine()}
        </div>
        {this.renderLoading()}
      </div>
    );
  }
}

export default App;
