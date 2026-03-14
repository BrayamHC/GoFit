// src/services/despachosService.js
import axiosInstance from '@/config/axiosConfig'

export const despachosService = {

    async getDespachos(filters = {}) {
        try {
            const response = await axiosInstance.get('/PanelMaestro/ListarDespachos', {
                params: filters
            })
            if (response.data.success === false) {
                return {
                    success: false,
                    error: response.data.message || 'Error al cargar despachos'
                }
            } else {
                return {
                    success: true,
                    data: response.data
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Error al conectar con el servidor'
            }
        }
    },

    async getDespachoById(despachoId) {
        try {
            const response = await axiosInstance.get(`/PanelMaestro/${despachoId}`)
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al cargar el despacho'
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al conectar con el servidor'
            }
        }
    },

    async createDespacho(despachoData) {
        try {
            const response = await axiosInstance.post('/PanelMaestro/CrearDespacho', despachoData)
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Despacho creado exitosamente'
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al crear el despacho'
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al conectar con el servidor'
            }
        }
    },

    async updateDespacho(despachoId, despachoData) {
        try {
            const response = await axiosInstance.patch(
                `/PanelMaestro/ActualizarDespacho`,
                despachoData
            )
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Despacho actualizado exitosamente'
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al actualizar el despacho'
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al conectar con el servidor'
            }
        }
    },

    async deleteDespacho(despachoId) {
        try {
            const response = await axiosInstance.delete(`/PanelMaestro/${despachoId}`)
            if (response.data.success) {
                return {
                    success: true,
                    message: response.data.message || 'Despacho eliminado exitosamente'
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al eliminar el despacho'
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al conectar con el servidor'
            }
        }
    },

    async getUsuariosActivos() {
        try {
            const response = await axiosInstance.get('/PanelMaestro/ListarUsuariosGlobales')
            if (response.data.success === false) {
                return {
                    success: false,
                    error: response.data.message || 'Error al cargar usuarios'
                }
            } else {
                return {
                    success: true,
                    data: response.data
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Error al conectar con el servidor'
            }
        }
    },

    async createUsuarioGlobal(userData) {
        try {
            const response = await axiosInstance.post('/PanelMaestro/CrearUsuarioGlobal', {
                nombre: userData.nombre,
                email: userData.email,
                password: userData.password
            })
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Usuario global creado exitosamente'
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al crear el usuario global'
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al conectar con el servidor',
                statusCode: error.response?.status
            }
        }
    },

    // ── Planes ──────────────────────────────────────────────────────────────

    async createPlan(planData) {
        try {
            const response = await axiosInstance.post('/PanelMaestro/CrearPlan', {
                nombrePlan: planData.nombrePlan,
                descripcionPlan: planData.descripcionPlan,
                costo: planData.costo,
                moneda: planData.moneda,
                limiteUsuarios: planData.limiteUsuarios,
                limiteAlmacenamientoMb: planData.limiteAlmacenamientoMb,
                diasDuracion: planData.diasDuracion,
                totalTimbres: planData.totalTimbres,
                caracteristicas: planData.caracteristicas ?? []
            })
            if (response.data.success) {
                return {
                    success: true,
                    data: response.data.data,
                    message: response.data.message || 'Plan creado exitosamente'
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al crear el plan'
                }
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Error al conectar con el servidor'
            }
        }
    }
}