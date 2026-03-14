export default [
  {
    path: 'pos',
    name: 'POS',
    component: () => import('@/views/pos/POSView.vue'),
    meta: {
      title: 'Punto de Venta',
      // breadcrumb: [
      //   { label: 'Dashboard', to: '/dashboard' },
      //   { label: 'Punto de Venta' }
      // ],
      // permissions: ['pos.access'],
      // requiresModule: 'pos',
      icon: 'pi pi-shopping-cart'
    }
  },
  {
    path: 'posh-register',
    name: 'CashRe/casgister',
    component: () => import('@/views/pos/CashRegisterView.vue'),
    meta: {
      title: 'Caja Registradora',
      breadcrumb: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'POS', to: '/pos' },
        { label: 'Caja' }
      ],
      permissions: ['pos.cash_register.access'],
      icon: 'pi pi-wallet'
    }
  }
]