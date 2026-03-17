import axiosInstance from '@/config/axiosConfig'

export const suscripcionesService = {

    async getSuscripciones(filtros = {}) {
        try {
            const response = await axiosInstance.get('/Suscripciones', { params: filtros })
            if (response.data.success === false) {
                return { success: false, error: response.data.message || 'Error al cargar suscripciones' }
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message || 'Error al conectar con el servidor' }
        }
    },

    async getSuscripcionesPorCliente(clienteId) {
        try {
            const response = await axiosInstance.get(`/Suscripciones/cliente/${clienteId}`)
            if (response.data.success === false) {
                return { success: false, error: response.data.message || 'Error al cargar suscripciones' }
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message || 'Error al conectar con el servidor' }
        }
    },
}
