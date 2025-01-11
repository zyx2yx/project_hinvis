// 此处为平行坐标系(主界面)中圈选出来的点仓库
import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useKeyPointsStore = defineStore('keyPoints', () => {
    const selectPointsID = ref([])// 存放嵌入图选中点
    const paraSelectedLen = ref(0)// 存放平行坐标系选中点的个数

    function updataPointsID(points) {
        selectPointsID.value = points
    }
    function updataParaSelectedLen(points) {
        paraSelectedLen.value = points
    }

    return {selectPointsID,paraSelectedLen,updataPointsID, updataParaSelectedLen}
})