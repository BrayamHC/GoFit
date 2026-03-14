// src/services/authService.js
import { axiosUser } from '@/config/axiosConfig'

// ==================== CLAVES CONSISTENTES ====================
const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'
const BRANCH_KEY = 'authBranch'

export const authService = {
    /**
     * Login de usuarios normales
     * @param {Object} credentials - { email, password }
     * @returns {Promise<Object>}
     */
    async login(credentials) {
        try {

            const response = await axiosUser.post('/Auth/Login', {
                email: credentials.email,
                password: credentials.password,
            })


            // Validar respuesta exitosa
            if (response.data.success) {
                // Extraer datos (SIN permisos)
                const userData = response.data.data.usuario || response.data.data.user


                const result = {
                    success: true,
                    data: {
                        token: response.data.data.token,
                        user: userData,
                        branch: response.data.data.sucursal || response.data.data.branch || null,
                        sessionType: response.data.data.tipo_sesion || 'normal'
                    },
                    message: response.data.message
                }

                console.groupEnd()

                return result
            } else {
                console.groupEnd()
                return {
                    success: false,
                    error: response.data.message || 'Error al iniciar sesión'
                }
            }
        } catch (error) {
            console.groupEnd()
            return {
                success: false,
                error: error.response?.data?.message || 'Error al conectar con el servidor',
                statusCode: error.response?.status
            }
        }
    },

    /**
     * Cierra la sesión del usuario normal
     */
    async logout() {
        try {



            this.clearAuth()

            return { success: true }
        } catch (error) {
            console.error('Error en logout:', error)
            // Limpiar localStorage de todas formas
            this.clearAuth()

            return { success: false, error: error.message }
        }
    },

    /**
     * Limpia todos los datos de autenticación
     */
    clearAuth() {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(BRANCH_KEY)
    },

    /**
     * Verifica si hay una sesión activa
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = this.getToken()
        const user = this.getUser()
        return !!(token && user)
    },

    /**
     * Obtiene el token almacenado
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem(TOKEN_KEY)
    },

    /**
     * Obtiene los datos del usuario almacenados
     * @returns {Object|null}
     */
    getUser() {
        const userJson = localStorage.getItem(USER_KEY)
        try {
            return userJson ? JSON.parse(userJson) : null
        } catch (error) {
            console.error('Error al parsear usuario:', error)
            return null
        }
    },

    /**
     * Obtiene la sucursal actual
     * @returns {Object|null}
     */
    getBranch() {
        const branchJson = localStorage.getItem(BRANCH_KEY)
        try {
            return branchJson ? JSON.parse(branchJson) : null
        } catch (error) {
            console.error('Error al parsear sucursal:', error)
            return null
        }
    },

    /**
     * Guarda los datos de autenticación en localStorage
     * (SIN permisos por ahora)
     */
    saveAuth(token, user, branch = null) {
        // console.group(' Guardando autenticación en localStorage')

        try {
            localStorage.setItem(TOKEN_KEY, token)
            localStorage.setItem(USER_KEY, JSON.stringify(user))



            if (branch) {
                localStorage.setItem(BRANCH_KEY, JSON.stringify(branch))
            }

        } catch (error) {
        }

        console.groupEnd()
    },


    debugStorage() {
        console.groupEnd()
    }
}