export default [
  {
    path: 'sales',
    name: 'Sales',
    component: () => import('@/views/sales/SalesView.vue'),
    meta: {
      title: 'Ventas',
      breadcrumb: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Ventas' }
      ],
      permissions: ['sales.view'],
      icon: 'pi pi-chart-line'
    }
  },
  {
    path: 'sales/:id',
    name: 'SaleDetail',
    component: () => import('@/views/sales/SaleDetailView.vue'),
    meta: {
      title: 'Detalle de Venta',
      breadcrumb: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Ventas', to: '/sales' },
        { label: 'Detalle' }
      ],
      permissions: ['sales.view']
    }
  }
]