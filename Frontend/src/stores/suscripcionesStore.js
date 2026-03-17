import { defineStore } from 'pinia'
import { ref } from 'vue'
import { suscripcionesService } from '@/services/suscripcionesService'

export const useSuscripcionesStore = defineStore('suscripciones', () => {
    const suscripciones = ref([])
    const loading       = ref(false)
    const error         = ref(null)

    async function getSuscripciones(filtros = {}) {
        loading.value = true
        error.value   = null
        try {
            const result = await suscripcionesService.getSuscripciones(filtros)
            if (result.success) {
                suscripciones.value = result.data || []
                return { success: true, data: result.data }
            }
            error.value = result.error
            return { success: false, error: result.error }
        } catch (err) {
            error.value = 'Error inesperado al cargar suscripciones'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    async function getSuscripcionesPorCliente(clienteId) {
        loading.value = true
        error.value   = null
        try {
            const result = await suscripcionesService.getSuscripcionesPorCliente(clienteId)
            if (result.success) {
                return { success: true, data: result.data }
            }
            error.value = result.error
            return { success: false, error: result.error }
        } catch (err) {
            error.value = 'Error inesperado'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    return { suscripciones, loading, error, getSuscripciones, getSuscripcionesPorCliente }
})
