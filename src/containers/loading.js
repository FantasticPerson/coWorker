import React,{Component} from 'react'

import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CircularProgress from '@material-ui/core/CircularProgress'

export default class loading extends Component{
    constructor(){
        super()
    }

    render(){
        const {msg} = this.props
        return (
            <Snackbar
                anchorOrigin={{ vertical:'top', horizontal:'center' }}
                open={true}
            >
                <SnackbarContent
                    style={{backgroundColor:'#1976d2'}}
                    message={msg}
                    action={[<CircularProgress style={{color:'#FFF'}} key="CircularProgress"/>]}
                />
            </Snackbar>
        )
    }
}