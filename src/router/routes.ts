import { ROLES } from '@/utils/constants'

const rawRoutes = [
  {
    path: '/',
    redirect: { name: 'login' },
  },
  {
    path: '/auth',
    component: () => import('@/layouts/auth.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('@/pages/auth/login.vue'),
        meta: {
          public: true,
        },
      },
    ],
  },
  {
    path: '/cabinet',
    component: () => import('@/layouts/cabinet.vue'),
    children: [
      {
        path: 'dashboard-organisation',
        name: 'dashboard-organisation',
        component: () => import('@/pages/cabinet/organisation/dashboard.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'reference-income-outcome',
        name: 'reference-income-outcome',
        component: () =>
          import('@/pages/cabinet/organisation/reference-income-outcome.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'reference-category-products',
        name: 'reference-category-products',
        component: () =>
          import(
            '@/pages/cabinet/organisation/reference-category-products.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'reference-characteristics',
        name: 'reference-characteristics',
        component: () =>
          import(
            '@/pages/cabinet/organisation/reference-characteristics/index.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'reference-characteristics-item/:id?',
        name: 'reference-characteristics-item',
        component: () =>
          import(
            '@/pages/cabinet/organisation/reference-characteristics/item.vue'
          ),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'reference-product-name',
        name: 'reference-product-name',
        component: () =>
          import('@/pages/cabinet/organisation/reference-product-name.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'workers-controlling-departments',
        name: 'workers-controlling-departments',
        component: () =>
          import(
            '@/pages/cabinet/organisation/workers-controlling-departments.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'workers-controlling-positions',
        name: 'workers-controlling-positions',
        component: () =>
          import(
            '@/pages/cabinet/organisation/workers-controlling-positions.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'counterparty-counterparties',
        name: 'counterparty-counterparties',
        component: () =>
          import(
            '@/pages/cabinet/organisation/counterparty-counterparties.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'counterparty-invoice',
        name: 'counterparty-invoice',
        component: () =>
          import('@/pages/cabinet/organisation/counterparty-invoice.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'mko-organisations',
        name: 'mko-organisations',
        component: () =>
          import('@/pages/cabinet/organisation/mko-organisations.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'contracts',
        name: 'contracts',
        component: () =>
          import('@/pages/cabinet/organisation/counterparty-contracts.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'warehouses',
        name: 'warehouses',
        component: () => import('@/pages/cabinet/organisation/warehouses.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'settings-bonus-tariffs',
        name: 'settings-bonus-tariffs',
        component: () =>
          import('@/pages/cabinet/organisation/settings-bonus-tariffs.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'settings-balance',
        name: 'settings-balance',
        component: () =>
          import('@/pages/cabinet/organisation/settings-balance.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'settings-currencies',
        name: 'settings-currencies',
        component: () =>
          import('@/pages/cabinet/organisation/settings-currencies.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'employees',
        name: 'employees',
        component: () => import('@/pages/cabinet/organisation/employees.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'inventory-income',
        name: 'inventory-income',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-income/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'inventory-income-item/:id',
        name: 'inventory-income-item',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-income/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'inventory-balance',
        name: 'inventory-balance',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-balance/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'inventory-balance-item/:id',
        name: 'inventory-balance-item',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-balance/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'reports-stock',
        name: 'reports-stock',
        component: () =>
          import('@/pages/cabinet/organisation/reports-stock.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'dashboard-admin',
        name: 'dashboard-admin',
        component: () => import('@/pages/cabinet/admin/dashboard.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'reference-units',
        name: 'reference-units',
        component: () => import('@/pages/cabinet/admin/reference-units.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'locations',
        name: 'locations',
        component: () => import('@/pages/cabinet/admin/locations.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'reference-courses',
        name: 'reference-courses',
        component: () => import('@/pages/cabinet/admin/reference-courses.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'mko-organisations-admin',
        name: 'mko-organisations-admin',
        component: () => import('@/pages/cabinet/admin/mko-organisations.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'reference-currencies',
        name: 'reference-currencies',
        component: () =>
          import('@/pages/cabinet/admin/reference-currencies.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'tariffs',
        name: 'tariffs',
        component: () => import('@/pages/cabinet/admin/tariffs.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'roles-admin',
        name: 'roles-admin',
        component: () => import('@/pages/cabinet/admin/roles/index.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'roles-admin-item/:id?',
        name: 'roles-admin-item',
        component: () => import('@/pages/cabinet/admin/roles/item.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/pages/cabinet/organisation/roles/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'roles-item/:id?',
        name: 'roles-item',
        component: () => import('@/pages/cabinet/organisation/roles/item.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'payments',
        name: 'payments',
        component: () => import('@/pages/cabinet/admin/payments.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/cabinet/admin/users.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'dashboard-employer',
        name: 'dashboard-employer',
        component: () => import('@/pages/cabinet/employer/dashboard.vue'),
        meta: {
          roles: [ROLES.EMPLOYER],
        },
      },
      {
        path: 'financial-account-settlement',
        name: 'financial-account-settlement',
        component: () =>
          import(
            '@/pages/cabinet/organisation/financial-accounting-settlement.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'financial-account-income',
        name: 'financial-account-income',
        component: () =>
          import(
            '@/pages/cabinet/organisation/financial-accounting-income.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
      {
        path: 'financial-account-spending',
        name: 'financial-account-spending',
        component: () =>
          import('@/pages/cabinet/organisation/financial-account-spending.vue'),
        meta: {
          roles: [ROLES.ORGANISATION],
        },
      },
    ],
  },
  {
    path: '/404',
    name: 'error',
    component: () => import('@/layouts/error.vue'),
    meta: {
      public: true,
    },
  },
  { path: '/:catchAll(.*)', redirect: { name: 'error' } },
]

const generateLocaleSupportedRoutes = () => {
  return rawRoutes.map((route) => ({
    ...route,
    path: '/:locale?' + route.path,
  }))
}

const routes = generateLocaleSupportedRoutes()
export default routes
