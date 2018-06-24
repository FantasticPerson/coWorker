'use strict';

var DeMandItem = function(text){
    if(text){
        var obj = JSON.parse(text)
        this.address = obj.address
        this.id = obj.id
        this.contact = obj.contact
        this.content = obj.content
        this.title = obj.title
        this.requestIds = obj.requestIds
        this.types = obj.types
    } else {
        this.address = ''
        this.id = ''
        this.contact = ''
        this.content = ''
        this.title = ''
        this.requestIds = ''
        this.types = ''
    }
}

DeMandItem.prototype = {
    toString:function(){
        return JSON.stringify(this)
    }
}

var RequestItem = function(text){
    if(text){
        var obj = JSON.parse(text)
        this.address = obj.address
        this.content = obj.content
        this.contact = obj.contact
        this.targetId = obj.targetId
        this.title = obj.title
        this.id = obj.id
    } else {
        this.address = ''
        this.content = ''
        this.contact = ''
        this.targetId = ''
        this.title = ''
        this.id = ''
    }
}

RequestItem.prototype = {
    toString:function(){
        return JSON.stringify(this)
    }
}

var nativeConfig = {
    stringify:function(obj){
        return obj
    },
    parse:function(str){
        return str
    }
}

var coWorkerContract = function(){
    LocalContractStorage.defineMapProperty(this,'deMandList',{
        stringify:function(obj){
            return obj.toString()
        },
        parse:function(str){
            return new DeMandItem(str);
        }
    }),
    LocalContractStorage.defineMapProperty(this,'requestList',{
        stringify:function(obj){
            return obj.toString()
        },
        parse:function(str){
            return new RequestItem(str);
        }
    }),
    LocalContractStorage.defineMapProperty(this,'userDemandIds',nativeConfig),
    LocalContractStorage.defineMapProperty(this,'userRequestIds',nativeConfig),
    LocalContractStorage.defineMapProperty(this,'userDemandRequestIds',nativeConfig),
    LocalContractStorage.defineProperties(this,{
        "maxDemandId":null,
        "maxRequestId":null
    })
}

coWorkerContract.prototype = {
    init:function(){
        this.maxDemandId = 0
        this.maxConditionId = 0
        this.maxRequestId = 0
    },

    saveDemand:function(title,content,contact,types){
        var address = Blockchain.transaction.from;
        var item = new DeMandItem()
        var id =  parseInt(this.maxDemandId)+1
        
        item.title = title
        item.content = content
        item.contact = contact
        item.requestIds = ''
        item.types = types
        item.id = id
        item.address = address
 
        this.deMandList.set(id,item)
        this.maxDemandId = id

        var ids = this.userDemandIds.get(address)
        if(!ids){
            ids = ''
        }
        ids = this._addIdToString(ids,id)
        this.userDemandIds.set(address,ids)
    },

    updateDemand:function(title,content,contact,types,id){
        var item = this.deMandList.get(id)
        if(item){
            item.title = title
            item.content = content
            item.contact = contact
            item.types = types
            this.deMandList.set(id,item)
        } else {
            throw new Error('invalid id')
        }
    },

    agreeRequest(id,rid){
        var item = this.deMandList.get(id)
        var requestItem = this.requestList.get(rid)
        if(item && requestItem){
            var rIds = item.requestIds
            var index = this._getIdIndexInStr(rIds,rid)
            if(index == -1){
                rIds = this._addIdToString(rIds,id)
                item.requestIds = rIds
                this.deMandList.set(id,item)
            }
        } else {
            throw new Error('invalid id or requestId')
        }
    },

    deleteDemand:function(id){
        var address = Blockchain.transaction.from;
        var item = this.deMandList.get(id)
        var ids = this.userDemandIds.get(address)
        if(item){
            this.deMandList.delete(id)
        }
        if(ids){
            var index = this._getIdIndexInStr(ids,id)
            if(index >= 0){
                ids = this._deleteIdFromStr(ids,index)
                this.userDemandIds.set(address,ids)
            }
        }
    },
    saveRequest(content,contact,title,targetId){
        var address = Blockchain.transaction.from;
        var item = new RequestItem()
        var id = parseInt(this.maxRequestId)+1
        item.address = address
        item.content = content
        item.contact = contact
        item.title = title
        item.targetId = targetId
        item.id = id

        this.requestList.set(id,item)
        this.maxRequestId = id

        var ids = this.userRequestIds.get(address)
        if(!ids){
            ids = ''
        }
        ids = this._addIdToString(ids,id)
        this.userRequestIds.set(address,ids)
        
        var ids2 = this.userDemandRequestIds.get(targetId)
        if(!ids2){
            ids2 = ''
        }
        ids2 = this._addIdToString(ids2,id)
        this.userDemandRequestIds.set(targetId,ids2)
    },

    updateRequest(content,contact,title,id){
        var item = this.requestList.get(id)
        if(item){
            item.content = content
            item.contact = contact
            item.title = title
            this.requestList.set(id,item)
        } else {
            throw new Error('invalid request id')
        }
    },

    deleteRequest(id){
        var address = Blockchain.transaction.from;
        var item = this.requestList.get(id)
        var ids = this.userRequestIds.get(address)
        if(item){
            this.requestList.delete(id)
        }
        if(ids){
            var index = this._getIdIndexInStr(ids,id)
            if(index >= 0){
                ids = this._deleteIdFromStr(ids,index)
                this.userRequestIds.set(address,ids)
            }
        }
    },
    getAllDemandList(){
        var address = Blockchain.transaction.from;
        var listLength = parseInt(this.maxDemandId)
        var arr = []

        for(var i=0;i<listLength;i++){
            var item = this.deMandList.get(i+1)
            if(item){
                var requestArr = []
                var ids = this.userDemandRequestIds.get(item.id)
                if(ids && ids.length > 0){
                    var idsArr = ids.split(',')
                    for(var j=0;j<idsArr.length;j++){
                        var item1 = this.requestList.get(idsArr[j])
                        if(item1){
                            requestArr.push(item1)
                        }
                    }
                }
                var isUsers = this._getIsYourDemand(i+1)
                var hasRequest = this._getHasRequest(i+1)
                var didRequest = this._getHasCRequest(i+1)
                item.isUsers = isUsers
                item.hasRequest = hasRequest
                item.requestArr = requestArr
                item.didRequest = didRequest
                arr.push(item)
            }
        }
        return {'address':address,'items':arr}
    },
    getUserDemands(){
        var address = Blockchain.transaction.from;
        var ids = this.userDemandIds.get(address)
        var arr = []
        if(ids){
            var idsArr = ids.split(',')
            for(var i=0;i<idsArr.length;i++){
                var item = this.deMandList.get(idsArr[i])
                if(item){
                    var requestArr = []
                    var ids = this.userDemandRequestIds.get(item.id)
                    if(ids){
                        var idsArr2 = ids.split(',')
                        for(var j=0;j<idsArr2.length;j++){
                            var item1 = this.requestList.get(idsArr2[j])
                            if(item1){
                                item1.target = item
                                requestArr.push(item1)
                            }
                        }
                    }
                    item.requestArr = requestArr
                    arr.push(item)
                }
            }
        }
        return {'address':address,'items':arr}
    },
    getUserRequests(){
        var address = Blockchain.transaction.from;
        var ids = this.userRequestIds.get(address)
        var arr = []
        if(ids){
            var idsArr = ids.split(',')
            for(var i=0;i<idsArr.length;i++){
                var item = this.requestList.get(idsArr[i])
                if(item){
                    var itemTarget = this.deMandList.get(item.targetId)
                    
                    if(itemTarget){
                        var hasRequest = this._getHasRequest(itemTarget.id)
                        var isAgree = this._getRequestAgree(itemTarget.id,idsArr[i])
                        item.target = itemTarget
                        item.hasRequest = hasRequest
                        item.requestAgree = isAgree
                        arr.push(item)
                    }
                }
            }
        }
        return {'address':address,'items':arr}
    },
    _getIsYourDemand(id){
        var address = Blockchain.transaction.from;
        var item = this.deMandList.get(id)
        if(item && item.address == address){
            return true
        }
        return false
    },
    _getHasRequest(id){
        var address = Blockchain.transaction.from;
        var item = this.deMandList.get(id)
        var rIds = this.userRequestIds.get(address)
        if(item && rIds){
            var rIds2 = item.requestIds
            var arr1 = rIds2.length > 0 ? rIds2.split(',') : []
            var arr2 = rIds.split(',')
            for(var i=0;i<arr1.length;i++){
                if(arr2.indexOf(arr1[i]) >= 0){
                    return true
                }
            }
            return false
        }
        return false
    },
    _getHasCRequest(id){
        var address = Blockchain.transaction.from;
        var rIds = this.userRequestIds.get(address)
        var rIds2 = this.userDemandRequestIds.get(id)
        if(rIds && rIds2){
            var arr1 = rIds.length > 0 ? rIds.split(',') : []
            var arr2 = rIds2.length>0 ? rIds2.split(',') : []
            for(var i=0;i<arr1.length;i++){
                if(arr2.indexOf(arr1[i]) >= 0){
                    return true
                }
            }
            return false
        }
        return false
    },
    _getRequestAgree(id,rid){
        var item = this.deMandList.get(id)
        if(item && item.requestIds.length > 0){
            var index = this._getIdIndexInStr(item.requestIds,rid)
            return index >= 0
        }
        return false
    },
    _addIdToString:function(str,id){
        if(str.length == 0){
            return id+''
        } else {
            var arr = str.split(',')
            arr.push(id)

            return arr.join(',')
        }
    },
    _getIdIndexInStr:function(str,id){
        var arr = str.split(',')
        return arr.indexOf(id+'')
    },
    _deleteIdFromStr:function(str,index){
        var arr = str.split(',')
        arr.splice(index,1)
        return arr.join(',')
    }
}

module.exports = coWorkerContract;