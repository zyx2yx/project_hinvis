// 两个核心资产组成的图+选中的两个核心资产
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useKeyGraphStore = defineStore('keyGraph', () => {
    const keyPoints = ref({})
    const keyGraph = ref({})

    function updataKeyPoints(points) {
        keyPoints.value = points
    }
    function updataKeyGraph(newV) {
        keyGraph.value = newV
    }

    return {keyPoints,keyGraph,updataKeyPoints,updataKeyGraph}
})