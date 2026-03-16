const masterRoutes = [
  {
    path: '/core/login',
    name: 'MasterLogin',
    component: () => import('@/views/master/auth/MasterLoginView.vue'),
    meta: {
      requiresAuth: false,
      requiresMasterAuth: false,
      title: 'Login - Panel Maestro'
    }
  },
  {
    path: '/core',
    component: () => import('@/layouts/MasterLayout.vue'),
    meta: { requiresMasterAuth: true },
    children: [
      {
        path: '',
        redirect: '/core/dashboard'
      },
      {
        path: 'dashboard',
        name: 'MasterDashboard',
        component: () => import('@/views/master/MasterDashboardView.vue'),
        meta: {
          requiresMasterAuth: true,
          title: 'Dashboard - Panel Maestro'
        }
      },
      {
        path: 'despachos',
        name: 'MasterDespachos',
        component: () => import('@/views/master/DespachosView.vue'),
        meta: {
          requiresMasterAuth: true,
          title: 'Despachos - Panel Maestro'
        }
      },
      {
        path: 'crear-despachos',
        name: 'MasterCrearDespachos',
        component: () => import('@/views/master/CrearDespacho.vue'),
        meta: {
          requiresMasterAuth: true,
          title: 'Crear Despacho - Panel Maestro'
        }
      },
      {
        path: 'membresias',
        name: 'MasterCrearMembresias',
        component: () => import('@/views/master/CrearMembresias.vue'),
        meta: {
          requiresMasterAuth: true,
          title: 'Crear Membresías - Panel Maestro'
        }
      },
      {
        path: 'usuarios',
        name: 'MasterCrearUsuarios',
        component: () => import('@/views/master/CrearUsuariosView.vue'),
        meta: {
          requiresMasterAuth: true,
          title: 'Crear Usuarios - Panel Maestro'
        }
      },
      {
        path: 'suscripciones',
        name: 'MasterVerSuscripciones',
        component: () => import('@/views/master/Suscripciones.vue'),
        meta: {
          requiresMasterAuth: true,
          title: 'Ver Suscripciones - Panel Maestro'
        }
      }
    ]
  }
]

export default masterRoutes
