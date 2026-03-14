export default [
  {
    path: 'admin',
    name: 'Admin',
    redirect: '/admin/users',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: {
      minRole: 'admin',
      permissions: ['admin.access']
    },
    children: [
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/admin/UsersView.vue'),
        meta: {
          title: 'Usuarios',
          breadcrumb: [
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Administración' },
            { label: 'Usuarios' }
          ],
          permissions: ['admin.users.view'],
          icon: 'pi pi-users'
        }
      },
      {
        path: 'branches',
        name: 'Branches',
        component: () => import('@/views/admin/BranchesView.vue'),
        meta: {
          title: 'Sucursales',
          breadcrumb: [
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Administración' },
            { label: 'Sucursales' }
          ],
          permissions: ['admin.branches.view'],
          minRole: 'superadmin',
          icon: 'pi pi-building'
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/admin/SettingsView.vue'),
        meta: {
          title: 'Configuración General',
          breadcrumb: [
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Administración' },
            { label: 'Configuración' }
          ],
          permissions: ['admin.settings.view'],
          minRole: 'admin',
          icon: 'pi pi-cog'
        }
      }
    ]
  }
]