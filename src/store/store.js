import { defineStore } from 'pinia'

export const useStore = defineStore('appStore', {
  state: () => {
    return {
      sellersData: [],
      ganador: false,
      factura: false
    }
  },
  getters: {
    sortedData(state) {
      let copy=[...state.sellersData]
      copy.sort((a,b)=>b.puntuacion-a.puntuacion)
      return copy
    }
  },
  actions: {
    setsellersData(payload) {
      this.sellersData = payload.map((x) => {
        return {
          name: x.name,
          id: x.id,
          puntuacion: 0,
          observations: x.observations || 'Sin observaciones'
        }
      })
    },
    puntuar(payload) {
      const index = this.sellersData.findIndex((x) => x.id === payload)
      this.sellersData[index].puntuacion += 3
      if (this.sellersData[index].puntuacion >= 20) {
        this.ganador = true
      }
    },
    facturaCreada() {
      this.factura = true
    }
  }
})
