import axiosInstance from '@/config/axiosConfig'

export const membresiasService = {
  async obtenerMembresias(filtros = {}) {
    try {
      const response = await axiosInstance.get('/Membresias', { params: filtros })
      return { success: true, data: response.data.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener membresías',
      }
    }
  },

  async crearMembresia(payload) {
    try {
      const response = await axiosInstance.post('/Membresias', payload)
      return { success: true, data: response.data.data, message: response.data.message }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al crear membresía',
      }
    }
  },
}
