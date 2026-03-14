// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', () => {
  // ==================== ESTADO ====================
  const user = ref(null)
  const token = ref(null)
  const currentBranch = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // ==================== JERARQUÍA DE ROLES ====================
  const roleHierarchy = {
    'cashier': 1,
    'pharmacist': 2,
    'supervisor': 3,
    'admin': 4,
    'superadmin': 5
  }

  // ==================== GETTERS ====================
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const userRole = computed(() => {
    return user.value?.role || user.value?.rol || null
  })

  const userName = computed(() => {
    return user.value?.name || user.value?.nombre || user.value?.email || ''
  })

  const userEmail = computed(() => user.value?.email || '')

  const userPermissions = computed(() => {
    return []
  })

  // ==================== ACTIONS ====================

  function initializeAuth() {

    const savedToken = authService.getToken()
    const savedUser = authService.getUser()
    const savedBranch = authService.getBranch()



    if (savedToken && savedUser) {
      token.value = savedToken
      user.value = savedUser
      currentBranch.value = savedBranch

    } else {
    }

    console.groupEnd()
  }

  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      const result = await authService.login(credentials)


      if (result.success) {

        // Guardar en el estado (SIN permisos)
        token.value = result.data.token
        user.value = result.data.user
        currentBranch.value = result.data.branch


        // Guardar en localStorage (SIN permisos)
        authService.saveAuth(
          result.data.token,
          result.data.user,
          result.data.branch
        )



        console.groupEnd()

        return {
          success: true,
          message: result.message
        }
      } else {
        error.value = result.error
        console.groupEnd()
        return {
          success: false,
          error: result.error
        }
      }
    } catch (err) {
      console.groupEnd()
      error.value = 'Error inesperado al iniciar sesión'
      return {
        success: false,
        error: 'Error inesperado al iniciar sesión'
      }
    } finally {
      loading.value = false
    }
  }

  /**
   * Cierra sesión del usuario
   */
  async function logout() {
    loading.value = true

    try {
      await authService.logout()

      // Limpiar estado
      token.value = null
      user.value = null
      currentBranch.value = null
      error.value = null

      return { success: true }
    } catch (err) {
      console.error('Error en logout:', err)
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  /**
   * Limpia errores
   */
  function clearError() {
    error.value = null
  }

  // Todos retornan true para permitir el acceso mientras desarrollas


  function hasPermission(permission) {
    return true
  }


  function hasAnyPermission(permissionList) {
    return true
  }


  function hasAllPermissions(permissionList) {
    return true
  }


  function hasMinRole(minRole) {
    const currentRole = userRole.value

    if (!currentRole) {
      return false
    }

    const userRoleLevel = roleHierarchy[currentRole] || 0
    const minRoleLevel = roleHierarchy[minRole] || 0

    const has = userRoleLevel >= minRoleLevel

    return has
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * (ESTE SÍ FUNCIONA - basado en roles)
   */
  function hasRole(role) {
    return userRole.value === role
  }

  /**
   * Verifica si la sucursal actual tiene un módulo específico
   */
  function branchHasModule(moduleName) {
    if (!currentBranch.value) {
      console.warn(`branchHasModule('${moduleName}'): No hay sucursal actual`)
      return false
    }

    const branchModules = currentBranch.value.modules ||
      currentBranch.value.modulos ||
      []
    const has = branchModules.includes(moduleName)


    return has
  }

  /**
   * Cambia la sucursal actual
   */
  function changeBranch(branch) {
    currentBranch.value = branch
    localStorage.setItem('authBranch', JSON.stringify(branch))
    console.log('🔄 Sucursal cambiada a:', branch.name || branch.nombre)
  }


  function debugAuth() {
    authService.debugStorage()
    console.groupEnd()
  }

  // Inicializar al crear el store
  initializeAuth()

  return {
    // Estado
    user,
    token,
    currentBranch,
    loading,
    error,
    // Getters
    isAuthenticated,
    userRole,
    userName,
    userEmail,
    userPermissions,
    // Actions
    login,
    logout,
    clearError,
    initializeAuth,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasMinRole,
    hasRole,
    branchHasModule,
    changeBranch,
    debugAuth
  }
})