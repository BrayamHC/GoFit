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
        redirect: '/master/dashboard'
      },
      {
        path: 'dashboard',
        name: 'MasterDashboard',
        component: () => import('@/views/master/MasterDashboardView.vue'),
        meta: {
          title: 'Dashboard - Panel Maestro'
        }
      },
      {
        path: 'despachos',
        name: 'MasterDespachos',
        component: () => import('@/views/master/DespachosView.vue'),
        meta: {
          title: 'Despachos - Panel Maestro'
        }
      },
      {
        path: 'crear-despachos',
        name: 'MasterCrearDespachos',
        component: () => import('@/views/master/CrearDespacho.vue'),
        meta: {
          title: 'Crear Despacho - Panel Maestro'
        }
      },
      {
        path: 'planes',
        name: 'MasterCrearPlanes',
        component: () => import('@/views/master/CrearPlanes.vue'),
        meta: {
          title: 'Crear Planes - Panel Maestro'
        }
      },
      {
        path: 'usuarios',
        name: 'MasterCrearUsuarios',
        component: () => import('@/views/master/CrearUsuariosView.vue'),
        meta: {
          title: 'Crear Usuarios - Panel Maestro'
        }
      },
      {
        path: 'suscripciones',
        name: 'MasterVerSuscripciones',
        component: () => import('@/views/master/Suscripciones.vue'),
        meta: {
          title: 'Ver Suscripciones - Panel Maestro'
        }
      }
    ]
  }
]

export default masterRoutes
