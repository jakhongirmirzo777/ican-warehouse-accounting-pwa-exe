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
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'reference-income-outcome',
        name: 'reference-income-outcome',
        component: () =>
          import('@/pages/cabinet/organisation/reference-income-outcome.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
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
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      // {
      //   path: 'reference-characteristics',
      //   name: 'reference-characteristics',
      //   component: () =>
      //     import(
      //       '@/pages/cabinet/organisation/reference-characteristics/index.vue'
      //     ),
      //   meta: {
      //     roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
      //   },
      // },
      {
        path: 'reference-characteristics-item/:id?',
        name: 'reference-characteristics-item',
        component: () =>
          import(
            '@/pages/cabinet/organisation/reference-characteristics/item.vue'
          ),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'reference-product-name',
        name: 'reference-product-name',
        component: () =>
          import('@/pages/cabinet/organisation/reference-product-name.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'departments',
        name: 'departments',
        component: () => import('@/pages/cabinet/organisation/departments.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'positions',
        name: 'positions',
        component: () => import('@/pages/cabinet/organisation/positions.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
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
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'counterparty-invoices',
        name: 'counterparty-invoices',
        component: () =>
          import('@/pages/cabinet/organisation/counterparty-invoices.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'organisations',
        name: 'organisations',
        component: () =>
          import('@/pages/cabinet/organisation/organisations.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'counterparty-contracts',
        name: 'counterparty-contracts',
        component: () =>
          import('@/pages/cabinet/organisation/counterparty-contracts.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'warehouses',
        name: 'warehouses',
        component: () => import('@/pages/cabinet/organisation/warehouses.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'settings-bonus-tariffs',
        name: 'settings-bonus-tariffs',
        component: () =>
          import('@/pages/cabinet/organisation/settings-bonus-tariffs.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'settings-balance',
        name: 'settings-balance',
        component: () =>
          import('@/pages/cabinet/organisation/settings-balance.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'settings-currencies',
        name: 'settings-currencies',
        component: () =>
          import('@/pages/cabinet/organisation/settings-currencies.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'employees',
        name: 'employees',
        component: () => import('@/pages/cabinet/organisation/employees.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-income',
        name: 'inventory-income',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-income/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-income-item/:id',
        name: 'inventory-income-item',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-income/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-balance',
        name: 'inventory-balance',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-balance/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-balance-item/:id',
        name: 'inventory-balance-item',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-balance/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-revaluation',
        name: 'inventory-revaluation',
        component: () =>
          import(
            '@/pages/cabinet/organisation/inventory-revaluation/index.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-revaluation-item/:id',
        name: 'inventory-revaluation-item',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-revaluation/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-inventory',
        name: 'inventory-inventory',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-inventory/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-inventory-item/:id',
        name: 'inventory-inventory-item',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-inventory/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-return',
        name: 'inventory-return',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-return/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-return-item/:id',
        name: 'inventory-return-item',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-return/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-write-off',
        name: 'inventory-write-off',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-write-off/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'inventory-write-off-item/:id',
        name: 'inventory-write-off-item',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-write-off/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'reports-stock',
        name: 'reports-stock',
        component: () =>
          import('@/pages/cabinet/organisation/reports-stock.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'reports-sales',
        name: 'reports-sales',
        component: () =>
          import('@/pages/cabinet/organisation/report-sales.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'reports-sales-product/:id',
        name: 'reports-sales-product',
        component: () =>
          import('@/pages/cabinet/organisation/report-sale-product.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
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
        path: 'organisations-admin',
        name: 'organisations-admin',
        component: () => import('@/pages/cabinet/admin/organisations.vue'),
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
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'roles-item/:id?',
        name: 'roles-item',
        component: () => import('@/pages/cabinet/organisation/roles/item.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
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
        path: 'financial-accounting-accounts',
        name: 'financial-accounting-accounts',
        component: () =>
          import(
            '@/pages/cabinet/organisation/financial-accounting-accounts.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'financial-accounting-income',
        name: 'financial-accounting-income',
        component: () =>
          import(
            '@/pages/cabinet/organisation/financial-accounting-income.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'financial-accounting-spending',
        name: 'financial-accounting-spending',
        component: () =>
          import(
            '@/pages/cabinet/organisation/financial-accounting-spending.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'financial-accounting-settlements',
        name: 'financial-accounting-settlements',
        component: () =>
          import(
            '@/pages/cabinet/organisation/financial-accounting-settlements/index.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'financial-accounting-settlements-item',
        name: 'financial-accounting-settlements-item',
        component: () =>
          import(
            '@/pages/cabinet/organisation/financial-accounting-settlements/item.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'cash-register',
        name: 'cash-register',
        component: () =>
          import('@/pages/cabinet/organisation/cash/direct-sale.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'entity-sell',
        name: 'entity-sell',
        component: () =>
          import('@/pages/cabinet/organisation/cash/entity-sell.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'reverted-checks-list',
        name: 'reverted-checks-list',
        component: () =>
          import('@/pages/cabinet/organisation/cash/reverted-checks-list.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'revert-check',
        name: 'revert-check',
        component: () =>
          import('@/pages/cabinet/organisation/cash/revert-check.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'give-bonus',
        name: 'give-bonus',
        component: () =>
          import('@/pages/cabinet/organisation/cash/give-bonus.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'give-bonus-choose-product',
        name: 'give-bonus-choose-product',
        component: () =>
          import(
            '@/pages/cabinet/organisation/cash/give-bonus-choose-product.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
        },
      },
      {
        path: 'reverted-check-products/:id',
        name: 'reverted-check-products',
        component: () =>
          import(
            '@/pages/cabinet/organisation/cash/reverted-check-products.vue'
          ),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
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
