import EventBus from './eventBus'
import * as nebulasUtil from './nebulasUtils'

class StateManager{
    constructor(){
        this.state = {
            nav:'list',
            tag:'list',
            demands:[],
            requests:[],
            myRecommands:[],
            myRequests:[],
            loadingMsg:'',
            showLoading:false
        }

        this.setDemands = (list)=>{
            this.state.demands = list
            EventBus.emit('updateDemands')
        }

        this.setRequests = (list)=>{
            this.state.requests = list
            EventBus.emit('updateRequests')
        }

        this.setMyRecommands = (list)=>{
            this.state.myRecommands = list
            EventBus.emit('updateMyRecommands')
        }

        this.setMyRequests = (list)=>{
            this.state.myRequests = list
            EventBus.emit('updateMyRequests')
        }

        this.setNav = (nav)=>{
            this.state.nav = nav
            EventBus.emit('updateNav')
        }

        this.setTag = (tag)=>{
            this.state.tag = tag
            EventBus.emit('updateTag')
        }
        this.showLoading = (msg)=>{
            this.state.showLoading = true
            this.state.loadingMsg = msg
            EventBus.emit('updateShowLoading')
        }
        this.hideLoading=()=>{
            this.state.showLoading = false
            EventBus.emit('updateShowLoading')
        }

        this.saveDemand=(title,content,contact,types)=>{
            let that = this
            this.showLoading('保存请求...')
            nebulasUtil.saveDemands(title,content,contact,types).then(()=>{
                this.hideLoading()
                nebulasUtil.getAllDemandList
            })
        }
    }
}

const stateManager = new StateManager()

export default stateManager