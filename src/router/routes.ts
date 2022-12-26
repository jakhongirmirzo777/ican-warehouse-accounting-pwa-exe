import { ROLES } from '@/utils/constants'

const rawRoutes = [
  {
    path: '/',
    redirect: { name: 'login' },
    public: true,
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
        path: 'dashboard-admin',
        name: 'dashboard-admin',
        component: () => import('@/pages/cabinet/admin/dashboard.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          public: true,
        },
      },
      {
        path: 'reference-units',
        name: 'reference-units',
        component: () => import('@/pages/cabinet/admin/reference-units.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.unites.index'],
        },
      },
      {
        path: 'locations',
        name: 'locations',
        component: () => import('@/pages/cabinet/admin/locations.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.locations.index'],
        },
      },
      {
        path: 'reference-courses',
        name: 'reference-courses',
        component: () => import('@/pages/cabinet/admin/reference-courses.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.system.courses.index'],
        },
      },
      {
        path: 'organisations-admin',
        name: 'organisations-admin',
        component: () => import('@/pages/cabinet/admin/organisations.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.organisation.index'],
        },
      },
      {
        path: 'reference-currencies',
        name: 'reference-currencies',
        component: () =>
          import('@/pages/cabinet/admin/reference-currencies.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.currencies.index'],
        },
      },
      {
        path: 'tariffs',
        name: 'tariffs',
        component: () => import('@/pages/cabinet/admin/tariffs.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.tariffs.index'],
        },
      },
      {
        path: 'roles-admin',
        name: 'roles-admin',
        component: () => import('@/pages/cabinet/admin/roles/index.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.roles.index'],
        },
      },
      {
        path: 'roles-admin-item/:id?',
        name: 'roles-admin-item',
        component: () => import('@/pages/cabinet/admin/roles/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.roles.view'],
        },
      },
      {
        path: 'payments',
        name: 'payments',
        component: () => import('@/pages/cabinet/admin/payments.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.organisation.transactions.index'],
        },
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/pages/cabinet/admin/users.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
          permissions: ['admin.employee.index'],
        },
      },
      {
        path: 'dashboard-organisation',
        name: 'dashboard-organisation',
        component: () => import('@/pages/cabinet/organisation/dashboard.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          public: true,
        },
      },
      {
        path: 'reference-income-outcome',
        name: 'reference-income-outcome',
        component: () =>
          import('@/pages/cabinet/organisation/reference-income-outcome.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['reference.income.index', 'reference.expenses.index'],
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
          permissions: ['organisation.categories.index'],
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
      // {
      //   path: 'reference-characteristics-item/:id?',
      //   name: 'reference-characteristics-item',
      //   component: () =>
      //     import(
      //       '@/pages/cabinet/organisation/reference-characteristics/item.vue'
      //     ),
      //   props: true,
      //   meta: {
      //     roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
      //   },
      // },
      {
        path: 'reference-product-name',
        name: 'reference-product-name',
        component: () =>
          import('@/pages/cabinet/organisation/reference-product-name.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.products.index'],
        },
      },
      {
        path: 'departments',
        name: 'departments',
        component: () => import('@/pages/cabinet/organisation/departments.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['reference.department.index'],
        },
      },
      {
        path: 'positions',
        name: 'positions',
        component: () => import('@/pages/cabinet/organisation/positions.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['reference.position.index'],
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
          permissions: ['counterparty.index'],
        },
      },
      {
        path: 'counterparty-invoices',
        name: 'counterparty-invoices',
        component: () =>
          import('@/pages/cabinet/organisation/counterparty-invoices.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.invoices.index'],
        },
      },
      {
        path: 'organisations',
        name: 'organisations',
        component: () =>
          import('@/pages/cabinet/organisation/organisations.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.index'],
        },
      },
      {
        path: 'counterparty-contracts',
        name: 'counterparty-contracts',
        component: () =>
          import('@/pages/cabinet/organisation/counterparty-contracts.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.contracts.index'],
        },
      },
      {
        path: 'warehouses',
        name: 'warehouses',
        component: () => import('@/pages/cabinet/organisation/warehouses.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.stores.index'],
        },
      },
      {
        path: 'settings-bonus-tariffs',
        name: 'settings-bonus-tariffs',
        component: () =>
          import('@/pages/cabinet/organisation/settings-bonus-tariffs.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['bonuses.index'],
        },
      },
      {
        path: 'settings-balance',
        name: 'settings-balance',
        component: () =>
          import('@/pages/cabinet/organisation/settings-balance.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.transactions.index'],
        },
      },
      {
        path: 'settings-currencies',
        name: 'settings-currencies',
        component: () =>
          import('@/pages/cabinet/organisation/settings-currencies.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.courses.index'],
        },
      },
      {
        path: 'employees',
        name: 'employees',
        component: () => import('@/pages/cabinet/organisation/employees.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.employee.index'],
        },
      },
      {
        path: 'inventory-income',
        name: 'inventory-income',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-income/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.documents.index'],
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
          permissions: ['organisation.documents.view'],
        },
      },
      {
        path: 'inventory-balance',
        name: 'inventory-balance',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-balance/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.entering-products.index'],
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
          permissions: ['organisation.entering-products.view'],
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
          permissions: ['organisation.revaluation.index'],
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
          permissions: ['organisation.revaluation.view'],
        },
      },
      {
        path: 'inventory-inventory',
        name: 'inventory-inventory',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-inventory/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.inventory.index'],
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
          permissions: ['organisation.inventory.view'],
        },
      },
      {
        path: 'inventory-return',
        name: 'inventory-return',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-return/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.returns.index'],
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
          permissions: ['organisation.returns.view'],
        },
      },
      {
        path: 'inventory-write-off',
        name: 'inventory-write-off',
        component: () =>
          import('@/pages/cabinet/organisation/inventory-write-off/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.write.off.index'],
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
          permissions: ['organisation.write.off.view'],
        },
      },
      {
        path: 'reports-stock',
        name: 'reports-stock',
        component: () =>
          import('@/pages/cabinet/organisation/reports-stock.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: [
            'reports.stock.organisation.products',
            'reports.stock.available.products',
            'reports.stock.document.register',
          ],
        },
      },
      {
        path: 'reports-sale',
        name: 'reports-sale',
        component: () =>
          import('@/pages/cabinet/organisation/reports-sale/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: [
            'reports.sale.sale.reports',
            'reports.sale.individuals',
          ],
        },
      },
      {
        path: 'reports-sale-item/:id',
        name: 'reports-sale-item',
        component: () =>
          import('@/pages/cabinet/organisation/reports-sale/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: [
            'reports.sale.sale.reports',
            'reports.sale.individuals',
          ],
        },
      },
      {
        path: 'roles',
        name: 'roles',
        component: () => import('@/pages/cabinet/organisation/roles/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.roles.index'],
        },
      },
      {
        path: 'roles-item/:id?',
        name: 'roles-item',
        component: () => import('@/pages/cabinet/organisation/roles/item.vue'),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['organisation.roles.view'],
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
          permissions: ['account.index'],
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
          permissions: ['organisation.income.index'],
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
          permissions: ['organisation.spending.index'],
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
          permissions: ['finance.accounting.index'],
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
          permissions: ['finance.accounting.index'],
        },
      },
      {
        path: 'cash-direct-sale',
        name: 'cash-direct-sale',
        component: () =>
          import('@/pages/cabinet/organisation/cash-direct-sale.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['cash-box.sell'],
        },
      },
      {
        path: 'cash-entity-sale',
        name: 'cash-entity-sale',
        component: () =>
          import('@/pages/cabinet/organisation/cash-entity-sale.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['cash-box.entity.sell'],
        },
      },
      {
        path: 'cash-revert-product',
        name: 'cash-revert-product',
        component: () =>
          import('@/pages/cabinet/organisation/cash-revert-product/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['cash-box.reverted.checks'],
        },
      },
      {
        path: 'cash-revert-product-reverted/:id',
        name: 'cash-revert-product-reverted',
        component: () =>
          import(
            '@/pages/cabinet/organisation/cash-revert-product/reverted.vue'
          ),
        props: true,
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['cash-box.reverted.checks'],
        },
      },
      {
        path: 'cash-revert-product-item',
        name: 'cash-revert-product-item',
        component: () =>
          import('@/pages/cabinet/organisation/cash-revert-product/item.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['cash-box.revert.sell'],
        },
      },
      {
        path: 'cash-give-bonus',
        name: 'cash-give-bonus',
        component: () =>
          import('@/pages/cabinet/organisation/cash-give-bonus/index.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['cash-box.give.bonus'],
        },
      },
      {
        path: 'cash-give-bonus-item',
        name: 'cash-give-bonus-item',
        component: () =>
          import('@/pages/cabinet/organisation/cash-give-bonus/item.vue'),
        meta: {
          roles: [ROLES.ORGANISATION, ROLES.EMPLOYER],
          permissions: ['cash-box.give.bonus'],
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
  {
    path: '/:catchAll(.*)',
    meta: {
      public: true,
    },
    redirect: { name: 'error' },
  },
]

const generateLocaleSupportedRoutes = () => {
  return rawRoutes.map((route) => ({
    ...route,
    path: '/:locale?' + route.path,
  }))
}

const routes = generateLocaleSupportedRoutes()
export default routes
