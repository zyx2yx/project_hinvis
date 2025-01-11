import {ref} from 'vue'
import {defineStore} from 'pinia'

export const useForceStore = defineStore('forceInfo',() => {
    const forceData = ref({})
    const isSimulating = ref(true)

    const updataRawData = newRawData => {
        forceData.value = newRawData
    }

    const updateSimulating = boolV => {
        isSimulating.value = boolV
    }

    return {forceData,isSimulating,updataRawData,updateSimulating}
})