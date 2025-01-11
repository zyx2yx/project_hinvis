
// 显示在详情界面平行坐标轴的核心资产节点
import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useGroupPoints = defineStore('groupPointsStore',() => {

    let groupPoints = ref({})
    
    function getGroupPoints(){
        return groupInfo.value
    }

    function setGroupPoints(value){
      groupPoints.value= value
    }

    return {
      groupPoints,
      setGroupPoints,
      getGroupPoints
    } 
})