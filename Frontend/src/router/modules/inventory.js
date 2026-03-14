export default [
  {
    path: 'inventory',
    name: 'Inventory',
    redirect: '/inventory/products',

    children: [
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/inventory/ProductsView.vue'),
        meta: {
          title: 'Productos',

          icon: 'pi pi-box'
        }
      },
      {
        path: 'products/new',
        name: 'ProductNew',
        component: () => import('@/views/inventory/ProductFormView.vue'),
        meta: {
          title: 'Nuevo Producto',

        }
      },
      {
        path: 'batches',
        name: 'Batches',
        component: () => import('@/views/inventory/BatchesView.vue'),
        meta: {
          title: 'Lotes',

          icon: 'pi pi-tags'
        }
      },
      {
        path: 'stock-movements',
        name: 'StockMovements',
        component: () => import('@/views/inventory/StockMovementsView.vue'),
        meta: {
          title: 'Movimientos de Inventario',
          icon: 'pi pi-arrow-right-arrow-left'
        }
      }
    ]
  }
]