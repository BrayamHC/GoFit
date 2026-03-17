import { defineStore } from 'pinia'
import { ref } from 'vue'
import { membresiasService } from '@/services/membresiasService'

export const useMembresiasStore = defineStore('membresias', () => {
  const membresias = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchMembresias(filtros = {}) {
    loading.value = true
    error.value = null

    const result = await membresiasService.obtenerMembresias(filtros)

    if (result.success) {
      membresias.value = result.data
    } else {
      error.value = result.error
    }

    loading.value = false
  }

  async function crearMembresia(payload) {
    loading.value = true
    error.value = null

    const result = await membresiasService.crearMembresia(payload)

    if (result.success) {
      membresias.value.unshift(result.data)
    } else {
      error.value = result.error
    }

    loading.value = false
    return result
  }

  function clearError() {
    error.value = null
  }

  return {
    membresias,
    loading,
    error,
    fetchMembresias,
    crearMembresia,
    clearError,
  }
})
