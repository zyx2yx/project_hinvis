import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useComIdStore = defineStore('comIdStore', () => {
  const clubId = ref(225)
  function updataClubId(newId) {
    clubId.value = newId
  }

  return { clubId, updataClubId }
})
