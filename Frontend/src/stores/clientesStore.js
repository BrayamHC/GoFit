import { defineStore } from 'pinia'
import { ref } from 'vue'
import { clientesService } from '@/services/clientesService'

export const useClientesStore = defineStore('clientes', () => {
    const clientes = ref([])
    const loading  = ref(false)
    const error    = ref(null)

    async function getClientes(filtros = {}) {
        loading.value = true
        error.value   = null
        try {
            const result = await clientesService.getClientes(filtros)
            if (result.success) {
                clientes.value = result.data || []
                return { success: true, data: result.data }
            }
            error.value = result.error
            return { success: false, error: result.error }
        } catch (err) {
            error.value = 'Error inesperado al cargar clientes'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    async function crearCliente(payload) {
        loading.value = true
        error.value   = null
        try {
            const result = await clientesService.crearCliente(payload)
            if (result.success) {
                clientes.value.push(result.data)
                return { success: true, data: result.data, message: result.message }
            }
            error.value = result.error
            return { success: false, error: result.error }
        } catch (err) {
            error.value = 'Error inesperado al crear cliente'
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    return { clientes, loading, error, getClientes, crearCliente }
})
