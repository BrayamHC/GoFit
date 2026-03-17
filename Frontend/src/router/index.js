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

  document.title = to.meta.title ? `${to.meta.title} | Go Fit` : 'Go Fit'

  // ── Master routes ──
  if (to.matched.some((record) => record.meta.requiresMasterAuth)) {
    if (!masterAuthStore.isAuthenticated) {
      return next({ name: 'MasterLogin', query: { redirect: to.fullPath } })
    }
    return next()
  }

  if (to.name === 'MasterLogin' && masterAuthStore.isAuthenticated) {
    return next('/core/dashboard')
  }

  // ── Rutas normales (nunca aplica a rutas master) ──
  const requiresAuth =
    to.matched.some((record) => record.meta.requiresAuth !== false) &&
    !to.matched.some((record) => record.meta.requiresMasterAuth)  // ← línea clave

  if (requiresAuth && !authStore.isAuthenticated) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  if (to.name === 'Login' && authStore.isAuthenticated) {
    return next('/dashboard')
  }

  next()
})


export default router
