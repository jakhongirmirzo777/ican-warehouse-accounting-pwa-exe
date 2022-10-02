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
        path: 'counterparty-organisations',
        name: 'counterparty-organisations',
        component: () =>
          import('@/pages/cabinet/organisation/counterparty-organisations.vue'),
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
        path: 'reference-system-courses',
        name: 'reference-system-courses',
        component: () =>
          import('@/pages/cabinet/admin/reference-system-courses.vue'),
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
        path: 'reference-courses',
        name: 'reference-courses',
        component: () => import('@/pages/cabinet/admin/courses.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
        },
      },
      {
        path: 'tariffs',
        name: 'tariffs',
        component: () => import('@/pages/cabinet/admin/admin-tariff.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
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
        path: 'dashboard-employer',
        name: 'dashboard-employer',
        component: () => import('@/pages/cabinet/employer/dashboard.vue'),
        meta: {
          roles: [ROLES.SUPER_ADMIN],
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
