// src/stores/despachosStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { despachosService } from '@/services/despachosService'

export const useDespachosStore = defineStore('despachos', () => {
    // ==================== ESTADO ====================
    const despachos = ref([])
    const zonasHorarias = ref([])
    const planes = ref([])
    const usuariosGlobales = ref([])
    const despachoActual = ref(null)
    const loading = ref(false)
    const error = ref(null)

    // ==================== GETTERS ====================
    const despachosActivos = computed(() => despachos.value.filter(d => d.status === 'activo'))
    const despachosInactivos = computed(() => despachos.value.filter(d => d.status === 'inactivo'))
    const despachosEliminados = computed(() => despachos.value.filter(d => d.status === 'eliminado'))

    const totalDespachos = computed(() => despachos.value.length)
    const totalActivos = computed(() => despachosActivos.value.length)
    const totalInactivos = computed(() => despachosInactivos.value.length)
    const totalEliminados = computed(() => despachosEliminados.value.length)

    // Planes
    const planesActivos = computed(() => planes.value.filter(p => p.status === 'activo'))
    const planesInactivos = computed(() => planes.value.filter(p => p.status === 'inactivo'))

    // ==================== ACTIONS ====================

    async function fetchDespachos(filters = {}) {
        loading.value = true
        error.value = null
        try {
            const result = await despachosService.getDespachos(filters)
            if (result.success) {
                if (!result.data) {
                    error.value = 'La respuesta del servidor no contiene datos'
                    return { success: false, error: error.value }
                }
                despachos.value = result.data.despachos || []
                zonasHorarias.value = result.data.zonasHorarias || []
                planes.value = result.data.planes || []
                usuariosGlobales.value = result.data.usuariosGlobales || []
                return { success: true }
            } else {
                error.value = result.error
                return { success: false, error: result.error }
            }
        } catch (err) {
            error.value = 'Error inesperado al cargar despachos: ' + err.message
            return { success: false, error: error.value }
        } finally {
            loading.value = false
        }
    }

    async function getUsuariosActivos() {
        try {
            const result = await despachosService.getUsuariosActivos()
            if (result.success) {
                usuariosGlobales.value = result.data.usuarios || result.data || []
                return { success: true, data: result.data }
            } else {
                error.value = result.error
                return { success: false, error: result.error }
            }
        } catch (err) {
            error.value = 'Error inesperado al cargar usuarios: ' + err.message
            return { success: false, error: error.value }
        }
    }

    async function fetchDespachoById(despachoId) {
        loading.value = true
        error.value = null
        try {
            const result = await despachosService.getDespachoById(despachoId)
            if (result.success) {
                despachoActual.value = result.data
                return { success: true, data: result.data }
            } else {
                error.value = result.error
                return { success: false, error: result.error }
            }
        } catch (err) {
            error.value = 'Error inesperado'
            return { success: false, error: 'Error inesperado' }
        } finally {
            loading.value = false
        }
    }

    async function createDespacho(despachoData) {
        loading.value = true
        error.value = null
        try {
            const result = await despachosService.createDespacho(despachoData)
            if (result.success) {
                await fetchDespachos()
                return { success: true, message: result.message }
            } else {
                error.value = result.error
                return { success: false, error: result.error }
            }
        } catch (err) {
            error.value = 'Error inesperado al crear despacho'
            return { success: false, error: 'Error inesperado' }
        } finally {
            loading.value = false
        }
    }

    async function updateDespacho(despachoId, despachoData) {
        loading.value = true
        error.value = null
        try {
            const result = await despachosService.updateDespacho(despachoId, despachoData)
            if (result.success) {
                const index = despachos.value.findIndex(d => d.despacho_id === despachoId)
                if (index !== -1) {
                    despachos.value[index] = {
                        ...despachos.value[index],
                        nombre_corto: despachoData.nombre_corto,
                        admin_despacho: despachoData.nombre_completo,
                        telefono_admin: despachoData.telefono,
                        email_admin: despachoData.email,
                        nota: despachoData.nota
                    }
                }
                if (despachoActual.value?.despacho_id === despachoId) {
                    despachoActual.value = {
                        ...despachoActual.value,
                        nombre_corto: despachoData.nombre_corto,
                        admin_despacho: despachoData.nombre_completo,
                        telefono_admin: despachoData.telefono,
                        email_admin: despachoData.email,
                        nota: despachoData.nota
                    }
                }
                return { success: true, message: result.message || 'Despacho actualizado correctamente' }
            } else {
                error.value = result.error
                return { success: false, error: result.error }
            }
        } catch (err) {
            error.value = 'Error inesperado al actualizar despacho'
            return { success: false, error: 'Error inesperado' }
        } finally {
            loading.value = false
        }
    }

    async function deleteDespacho(despachoId) {
        loading.value = true
        error.value = null
        try {
            const result = await despachosService.deleteDespacho(despachoId)
            if (result.success) {
                despachos.value = despachos.value.filter(d => d.despacho_id !== despachoId)
                return { success: true, message: result.message }
            } else {
                error.value = result.error
                return { success: false, error: result.error }
            }
        } catch (err) {
            error.value = 'Error inesperado al eliminar despacho'
            return { success: false, error: 'Error inesperado' }
        } finally {
            loading.value = false
        }
    }

    async function createUsuarioGlobal(userData) {
        loading.value = true
        error.value = null
        try {
            const result = await despachosService.createUsuarioGlobal(userData)
            if (result.success) {
                if (result.data?.usuario) {
                    usuariosGlobales.value.push(result.data.usuario)
                }
                return { success: true, message: result.message, data: result.data }
            } else {
                error.value = result.error
                return { success: false, error: result.error }
            }
        } catch (err) {
            error.value = 'Error inesperado al crear usuario global'
            return { success: false, error: 'Error inesperado al crear usuario global' }
        } finally {
            loading.value = false
        }
    }

    // ── Planes ───────────────────────────────────────────────────────────────

    async function createPlan(planData) {
        loading.value = true
        error.value = null
        try {
            const result = await despachosService.createPlan(planData)
            if (result.success) {
                // Agregar el nuevo plan a la lista local si viene en la respuesta
                if (result.data) {
                    planes.value.push(result.data)
                }
                return { success: true, message: result.message, data: result.data }
            } else {
                error.value = result.error
                return { success: false, error: result.error }
            }
        } catch (err) {
            error.value = 'Error inesperado al crear plan'
            return { success: false, error: 'Error inesperado al crear plan' }
        } finally {
            loading.value = false
        }
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    function getZonaNombre(zonaIdONombre) {
        if (typeof zonaIdONombre === 'string') return zonaIdONombre
        if (!zonaIdONombre) return 'No especificado'
        const zona = zonasHorarias.value.find(z => z.zona_id === zonaIdONombre)
        return zona ? `${zona.descripcion} (${zona.utc_offset})` : 'No especificado'
    }

    function getPlanNombre(planId) {
        if (!planId) return 'No especificado'
        const plan = planes.value.find(p => p.plan_id === planId)
        return plan ? plan.nombre_plan : 'No especificado'
    }

    function clearDespachoActual() {
        despachoActual.value = null
    }

    function clearError() {
        error.value = null
    }

    return {
        // Estado
        despachos,
        zonasHorarias,
        planes,
        usuariosGlobales,
        despachoActual,
        loading,
        error,
        // Getters
        despachosActivos,
        despachosInactivos,
        despachosEliminados,
        totalDespachos,
        totalActivos,
        totalInactivos,
        totalEliminados,
        planesActivos,
        planesInactivos,
        // Actions
        fetchDespachos,
        fetchDespachoById,
        createDespacho,
        updateDespacho,
        deleteDespacho,
        createUsuarioGlobal,
        getUsuariosActivos,
        createPlan,
        // Helpers
        getZonaNombre,
        getPlanNombre,
        clearDespachoActual,
        clearError
    }
})