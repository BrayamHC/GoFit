import axiosInstance from '@/config/axiosConfig'

export const clientesService = {

    async getClientes(filtros = {}) {
        try {
            const response = await axiosInstance.get('/Clientes', { params: filtros })
            if (response.data.success === false) {
                return { success: false, error: response.data.message || 'Error al cargar clientes' }
            }
            return { success: true, data: response.data.data }
        } catch (error) {
            return { success: false, error: error.response?.data?.message || error.message || 'Error al conectar con el servidor' }
        }
    },

    async getClienteById(clienteId) {
        try {
            const response = await axiosInstance.get(`/Clientes/${clienteId}`)
            if (response.data.success) {
                return { success: true, data: response.data.data }
            }
            return { success: false, error: response.data.message || 'Error al obtener cliente' }
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Error al conectar con el servidor' }
        }
    },

    async crearCliente(payload) {
        try {
            const response = await axiosInstance.post('/Clientes', payload)
            if (response.data.success) {
                return { success: true, data: response.data.data, message: response.data.message || 'Cliente creado exitosamente' }
            }
            return { success: false, error: response.data.message || 'Error al crear cliente' }
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Error al conectar con el servidor' }
        }
    },
}
