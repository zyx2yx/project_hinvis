
import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useGroupInfo = defineStore('groupInfoStore',() => {

    let groupInfo = ref({})
    
    function getGroupInfo(){
        return groupInfo.value
    }

    function setGroupInfo(value){
        groupInfo.value= value
    }

    return {
        groupInfo,
        getGroupInfo,
        setGroupInfo
    } 
})