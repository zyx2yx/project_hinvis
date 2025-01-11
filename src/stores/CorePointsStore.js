// 此处为平行坐标系(详情界面)中圈选出来的点仓库
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useCorePointsStore = defineStore('parallelSelectedPoints', () => {
    const selectPoints = ref([])// 存放选中点
    const corePointsGraph = ref({})// 存放某社区或者团伙的 选中的 核心资产和路径信息

    function updataPoints(points) {
        selectPoints.value = points
    }
    function updataCoreGraph(newV) {
        corePointsGraph.value = newV
    }

    return {selectPoints,corePointsGraph,updataPoints,updataCoreGraph}
})