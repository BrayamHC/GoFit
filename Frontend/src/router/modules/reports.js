export default [
  {
    path: 'reports',
    name: 'Reports',
    component: () => import('@/views/reports/ReportsView.vue'),
    meta: {
      title: 'Reportes',
      breadcrumb: [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Reportes' }
      ],
      permissions: ['reports.view'],
      icon: 'pi pi-file-pdf'
    }
  }
]