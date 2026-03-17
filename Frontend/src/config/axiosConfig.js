// src/config/axiosConfig.js
import axios from 'axios'

// CONFIGURACIÓN PANEL MAESTRO
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.10.179:3000'

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const masterToken = localStorage.getItem('masterToken')
    if (masterToken) {
      config.headers.Authorization = `Bearer ${masterToken}`
    }
    if (import.meta.env.DEV) {
      console.log('Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullURL: `${config.baseURL}${config.url}`,
        hasToken: !!masterToken,
      })
    }

    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    console.error('Response error:', {
      status,
      message,
      url: error.config?.url,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
    })

    // Token expirado o inválido (401)
    if (status === 401) {
      localStorage.removeItem('masterToken')
      localStorage.removeItem('masterUser')

      const isMasterRoute = window.location.pathname.startsWith('/core') // ← /core no /master
      const loginPath = isMasterRoute ? '/core/login' : '/login' // ← /core/login

      if (!window.location.pathname.includes('/login')) {
        window.location.href = loginPath
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance

// CONFIGURACIÓN PARA USUARIOS NORMALES
const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://delta.192.168.10.179.nip.io:3000'

export const axiosUser = axios.create({
  baseURL: USER_API_URL,

  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosUser.interceptors.request.use(
  (config) => {
    //  USAR LA CLAVE CORRECTA: authToken (no userToken)
    const userToken = localStorage.getItem('authToken')
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`
    }
    if (import.meta.env.DEV) {
      console.log('User Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        fullURL: `${config.baseURL}${config.url}`,
        hasToken: !!userToken,
      })
    }

    return config
  },
  (error) => {
    console.error('User Request error:', error)
    return Promise.reject(error)
  },
)

axiosUser.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message || error.message

    console.error('User Response error:', {
      status,
      message,
      url: error.config?.url,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
    })

    // Token expirado o inválido (401)
    if (status === 401) {
      //  LIMPIAR CON LAS CLAVES CORRECTAS
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      localStorage.removeItem('authBranch')

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
