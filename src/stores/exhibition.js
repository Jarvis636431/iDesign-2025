import { defineStore } from 'pinia'

export const useExhibitionStore = defineStore('exhibition', {
  state: () => ({
    currentExhibition: null,
    exhibitions: [],
    loading: false,
    error: null
  }),
  
  actions: {
    setCurrentExhibition(exhibition) {
      this.currentExhibition = exhibition
    },
    
    setExhibitions(exhibitions) {
      this.exhibitions = exhibitions
    },
    
    setLoading(status) {
      this.loading = status
    },
    
    setError(error) {
      this.error = error
    }
  },
  
  getters: {
    getCurrentExhibition: (state) => state.currentExhibition,
    getExhibitions: (state) => state.exhibitions,
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  }
}) 