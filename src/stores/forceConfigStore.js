import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {zoomIdentity} from 'd3'

export const useForceConfigStore = defineStore('forceConfig', () => {
  const forceConfig = ref({
    collideRadius: 5,
    collideIterations: 1,
    collideStrength: 1, 
    manyBodyStrength: -30,
    manyBodyStrengDisMin: 1,
    manyBodyStrengDisMax: 300,
  })
  const selectValue = ref("G2")
  const scaleFactor = ref(zoomIdentity)
  const simulation = ref({})

  function updataForceConfig(newForceData){
    forceConfig.value = newForceData
  }

  function updataScaleFactor(newV) {
    scaleFactor.value = newV
  }
  function updataSelectValue(newV) {
    selectValue.value = newV
  }
  function updataSimulation(newV) {
    simulation.value = newV
  }

  return { 
    selectValue,
    forceConfig,
    scaleFactor,
    simulation,
    updataForceConfig,
    updataScaleFactor,
    updataSelectValue,
    updataSimulation
  }
})
