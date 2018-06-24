let Nebulas = require('nebulas')
let NebPay = require('nebpay')

let nebPay = new NebPay()
let Neb = Nebulas.Neb
var Account = Nebulas.Account;

let neb = new Neb(new Nebulas.HttpRequest("https://testnet.nebulas.io")) //https://mainnet.nebulas.io   https://testnet.nebulas.io

const dappAddress = "n1zzkDYVPCR671Ph8s82nk5r3FyuNTn5yy6" //n1rZsBd7vPrE4R3rEr9pf5S3wvdAnGCHyJ6 test:n1sAsGewgwBtdUnvbCjpPzguX5NPhvfcQgt

function doSaveRequest(callFunction,callArgs,functionName){
    let to = dappAddress;
    let value = "0";
    let tryTimes = 0
    return new Promise((resolve,reject)=>{
        nebPay.call(to,value,callFunction,callArgs,{
            listener:(resp)=>{
                let intervalQuery = setInterval(()=>{
                    tryTimes++;
                    neb.api.getTransactionReceipt({hash: resp["txhash"]})
                    .then((receipt)=>{
                        if(receipt["status"] == 2){
                            console.info(`${functionName} pending......`)
                        } else if(receipt["status"] == 1){
                            clearInterval(intervalQuery)
                            console.info(`${functionName} sucess......`)
                            resolve({'tryTimes':tryTimes})
                        } else {
                            clearInterval(intervalQuery)
                            console.error(`${functionName} save fail.....`)
                            reject('failure')
                        }
                    })
                    .catch(err=>{
                        clearInterval(intervalQuery)
                        console.error(`${functionName} ${JSON.parse(err)}`)
                        reject(err)
                    })
                },5000)
            }
        })
    })
}

function doGetRequest(callFunction,callArgs,functionName){
    let to = dappAddress;
    let value = "0";
    return new Promise((resolve,reject)=>{
        nebPay.simulateCall(to,value,callFunction,callArgs,{
            listener:(res)=>{
                try{
                    let result = res.result
                    if(result){
                        let obj = JSON.parse(result)
                        console.info(`${functionName} ${res.result}`)
                        resolve(obj)
                    } else {
                        reject()
                    }
                } catch(e){
                    console.error(`${functionName} ${JSON.parse(e)}`)
                    reject(e)
                }
            }
        })
    })
}

export function saveDemands(title,content,contact,types){
    let callFunction = "saveDemand";
    let callArgs = `["${title}","${content}","${contact}","${types}"]`;
    return doSaveRequest(callFunction,callArgs,'saveDemand')
}

export function updateDemands(title,content,contact,types,id){
    let callFunction = "updateDemand";
    let callArgs = `["${title}","${content}","${contact}","${types}","${id}"]`;
    return doSaveRequest(callFunction,callArgs,'updateDemand')
}

export function saveRequest(content,contact,title,targetId){
    let callFunction = "saveRequest";
    let callArgs = `["${content}","${contact}","${title}","${targetId}"]`;
    return doSaveRequest(callFunction,callArgs,'saveRequest')
}

export function updateRequest(content,contact,title,id){
    let callFunction = "updateRequest";
    let callArgs = `["${content}","${contact}","${title}","${id}"]`;
    return doSaveRequest(callFunction,callArgs,'updateRequest')
}

export function getAllDemandList(){
    let callFunction = "getAllDemandList";
    let callArgs = `[]`;
    return doGetRequest(callFunction,callArgs,'getAllDemandList')
}

export function getUserDemands(){
    let callFunction = "getUserDemands";
    let callArgs = `[]`;
    return doGetRequest(callFunction,callArgs,'getUserDemands')
}

export function getUserRequests(){
    let callFunction = "getUserRequests";
    let callArgs = `[]`;
    return doGetRequest(callFunction,callArgs,'getUserRequests')
}

export function agreeRequest(id,rId){
    let callFunction = "agreeRequest";
    let callArgs = `["${id}","${rId}"]`;
    return doSaveRequest(callFunction,callArgs,'agreeRequest')
}