// src/services/masterAuthService.js
import axiosInstance from '@/config/axiosConfig'

export const masterAuthService = {
    /**
     * Login del panel maestro
     * @param {Object} credentials 
     * @returns {Promise<Object>}
     */
    async login(credentials) {
        try {
            const response = await axiosInstance.post('/Auth/Login', {
                email: credentials.email,
                password: credentials.password
            })

            // Validar respuesta exitosa
            if (response.data.success) {
                const { token, usuario, tipo_sesion } = response.data.data

                return {
                    success: true,
                    data: {
                        token: token,
                        user: {
                            id: usuario.usuario_id,
                            nombre: usuario.nombre,
                            email: usuario.email,
                            rol: usuario.rol
                        },
                        sessionType: tipo_sesion
                    },
                    message: response.data.message
                }
            } else {
                return {
                    success: false,
                    error: response.data.message || 'Error al iniciar sesión'
                }
            }
        } catch (error) {
            console.error('Error en masterAuthService.login:', error)
            return {
                success: false,
                error: error.response?.data?.message || 'Error al conectar con el servidor',
                statusCode: error.response?.status
            }
        }
    },

    /**
     * Cierra la sesión del usuario maestro
     */
    logout() {
        localStorage.removeItem('masterToken')
        localStorage.removeItem('masterUser')
    },

    /**
     * Verifica si hay una sesión activa
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = localStorage.getItem('masterToken')
        const user = localStorage.getItem('masterUser')
        return !!(token && user)
    },

    /**
     * Obtiene el token almacenado
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('masterToken')
    },

    /**
     * Obtiene los datos del usuario almacenados
     * @returns {Object|null}
     */
    getUser() {
        const user = localStorage.getItem('masterUser')
        try {
            return user ? JSON.parse(user) : null
        } catch (error) {
            console.error('Error al parsear usuario:', error)
            return null
        }
    },

    /**
     * Guarda el token y usuario en localStorage
     * @param {string} token 
     * @param {Object} user 
     */
    saveAuth(token, user) {
        localStorage.setItem('masterToken', token)
        localStorage.setItem('masterUser', JSON.stringify(user))
    }
}