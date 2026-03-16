// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useMasterAuthStore } from '@/stores/masterAuthStore'

// Importar módulos de rutas
import posRoutes from './modules/pos'
import inventoryRoutes from './modules/inventory'
import salesRoutes from './modules/sales'
import adminRoutes from './modules/admin'
import reportsRoutes from './modules/reports'
import masterRoutes from './modules/master'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: {
      requiresAuth: false,
      title: 'Iniciar Sesión',
    },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Dashboard',
          breadcrumb: [{ label: 'Dashboard' }],
          permissions: ['dashboard.view'],
        },
      },
      ...posRoutes,
      ...inventoryRoutes,
      ...salesRoutes,
      ...adminRoutes,
      ...reportsRoutes,
    ],
  },
  // Rutas del panel maestro
  ...masterRoutes,
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: () => import('@/views/AccessDeniedView.vue'),
    meta: {
      title: 'Acceso Denegado',
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      title: 'Página No Encontrada',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// ==================== GUARDIAS DE NAVEGACIÓN ====================
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const masterAuthStore = useMasterAuthStore()

  // Actualizar título de la página
  document.title = to.meta.title ? `${to.meta.title} | Go Fit` : 'Go Fit'

  // ========== RUTAS DEL PANEL MAESTRO ==========
  if (to.matched.some((record) => record.meta.requiresMasterAuth)) {
    if (!masterAuthStore.isAuthenticated) {
      return next({
        name: 'MasterLogin',
        query: { redirect: to.fullPath },
      })
    }

    // Verificar permisos del panel maestro
    if (to.meta.permissions) {
      const hasPermission = to.meta.permissions.some((permission) =>
        masterAuthStore.hasPermission(permission),
      )
      if (!hasPermission) {
        return next({ name: 'AccessDenied' })
      }
    }

    return next()
  }

  // ========== SI ESTÁ EN LOGIN MAESTRO Y YA ESTÁ AUTENTICADO ==========
  if (to.name === 'MasterLogin' && masterAuthStore.isAuthenticated) {
    return next('/core/dashboard')
  }

  // ========== RUTAS NORMALES (USUARIOS REGULARES) ==========
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false)

  if (requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath },
      })
    }

    /*  // Verificar permisos
         if (to.meta.permissions) {
             const hasPermission = authStore.hasAnyPermission(to.meta.permissions)
             if (!hasPermission) {
                 return next({ name: 'AccessDenied' })
             }
         }
  */
    /*  // Verificar rol mínimo
         if (to.meta.minRole) {
             const hasRole = authStore.hasMinRole(to.meta.minRole)
             if (!hasRole) {
                 return next({ name: 'AccessDenied' })
             }
         } */

    // Verificar módulo de sucursal
    if (to.meta.requiresModule) {
      const hasModule = authStore.branchHasModule(to.meta.requiresModule)
      if (!hasModule) {
        return next({
          name: 'Dashboard',
          query: { error: 'module_not_available' },
        })
      }
    }
  }

  // Si está en login normal y ya está autenticado
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next('/dashboard')
  }
  next()
})

export default router
