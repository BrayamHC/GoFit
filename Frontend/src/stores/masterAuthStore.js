// src/stores/masterAuthStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { masterAuthService } from '@/services/masterAuthService'

export const useMasterAuthStore = defineStore('masterAuth', () => {
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const currentUser = computed(() => user.value)

  const userRole = computed(() => user.value?.rol || null)

  const isSuperAdmin = computed(() => user.value?.rol === 'superadmin')

  const pendingToast = ref(null)

  /**
   * Inicializa el estado desde localStorage
   */
  function initializeAuth() {
    const savedToken = masterAuthService.getToken()
    const savedUser = masterAuthService.getUser()

    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
    }
  }

  /**
   * Login del usuario maestro
   * @param {Object} credentials - { email, password }
   */
  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      const result = await masterAuthService.login(credentials)

      if (result.success) {
        token.value = result.data.token
        user.value = result.data.user

        masterAuthService.saveAuth(result.data.token, result.data.user)

        pendingToast.value = {
          message: result.message || '¡Bienvenido a Go Fit!',
          color: 'success',
        }

        return {
          success: true,
          message: result.message,
          pendingToast,
        }
      } else {
        error.value = result.error
        return {
          success: false,
          error: result.error,
        }
      }
    } catch (err) {
      console.error('Error en login store:', err)
      error.value = 'Error inesperado al iniciar sesión'
      return {
        success: false,
        error: 'Error inesperado al iniciar sesión',
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Cierra sesión del usuario maestro
   */
  function logout() {
    token.value = null
    user.value = null
    error.value = null
    masterAuthService.logout()
  }

  /**
   * Limpia errores
   */
  function clearError() {
    error.value = null
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   * @param {string} permission
   * @returns {boolean}
   */
  function hasPermission(permission) {
    if (isSuperAdmin.value) return true

    return false
  }

  // Inicializar al crear el store
  initializeAuth()

  return {
    // Estado
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    userRole,
    isSuperAdmin,
    // Actions
    login,
    logout,
    clearError,
    initializeAuth,
    hasPermission,
    pendingToast
  }
})
