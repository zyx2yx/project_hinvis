import {ref} from 'vue'
import {json} from 'd3'
import {defineStore} from 'pinia'

export const useEmbedStore = defineStore('groupEmbedStore',() => {
  const embedData = ref([])

  const asyncGetEmbedData = async club => {
    try {
      const data = await json(`src/data/text/Club${club}.json`)
      embedData.value = data
    } catch (error) {
      console.log('文件不存在，',error);
    }
    
  }

  return {embedData,asyncGetEmbedData}
})