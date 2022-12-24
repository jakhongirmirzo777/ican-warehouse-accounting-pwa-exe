<template>
  <div class="sidebar">
    <div class="sidebar__list" :class="[{ 'sidebar__list--mini': isMini }]">
      <div class="sidebar__list__header">
        <VIcon
          icon="x-mark"
          size="30"
          color="#fff"
          class="mr-20 cursor-pointer"
          @click="$emit('toggle-mini')"
        />
        <TheProfileDropdown class="sidebar__list__profile-dropdown" theme />
        <VSpacer />
        <TheHeaderLang white class="sidebar__list__lang" />
      </div>
      <div v-if="role !== ROLES.SUPER_ADMIN" class="sidebar__list__subheader">
        <TheHeaderCourse white />
        <VIcon
          v-show="theme === THEME.LIGHT"
          class="mr-3 header__setting-icons__setting cursor-pointer"
          size="100%"
          icon="theme-icon-white"
          @click="toggleTheme"
        />
        <VIcon
          v-show="theme === THEME.DARK"
          class="mr-3 header__setting-icons__setting cursor-pointer"
          size="100%"
          icon="theme-icon-dark"
          @click="toggleTheme"
        />
      </div>
      <div
        v-for="(list, i) in listFrom"
        :key="`list-${i}`"
        class="sidebar__list__block"
      >
        <component
          v-if="
            list.hasOwnProperty('permission') ? $can(list.permission) : true
          "
          :is="
            list.path && (!list.children || !list.children.length)
              ? 'router-link'
              : 'div'
          "
          :class="[
            'sidebar__list__item',
            { 'sidebar__list__item--is-open': list.isOpen },
          ]"
          :to="{ name: list.path, params: { locale } }"
          active-class="sidebar__list__item__link--active"
          @click="childToggleMenu(list, $refs[`menuItemRef${i}`], i)"
        >
          <span class="sidebar__list__item__icon">
            <VIcon :icon="list.icon" size="24" />
          </span>
          <div
            v-if="!miniIsMini"
            class="sidebar__list__item__wrapper"
            :class="{ sidebar__list__item__hover: miniIsMini }"
          >
            <span class="sidebar__list__item__name">{{ list.name }}</span>
            <VSpacer />
          </div>
          <VIcon
            v-if="list.children && list.children.length && !isMini"
            :class="[
              'sidebar__list__item__open-icon',
              { 'sidebar__list__item__open-icon--is-open': list.isOpen },
              { 'sidebar__list__item__open-icon--yes-is-open': !miniIsMini },
            ]"
            icon="chevron_bottom"
          />
        </component>
        <div
          v-if="!miniIsMini"
          :class="[
            'sidebar__list__block__children',
            { 'sidebar__list__block__children--is-open': list.isOpen },
            { 'sidebar__list__block__children--yes-is-open': miniIsMini },
          ]"
          :ref="`menuItemRef${i}`"
        >
          <template v-for="(child, childIndex) in list.children">
            <router-link
              v-if="
                child.hasOwnProperty('permission')
                  ? $can(child.permission)
                  : true
              "
              class="sidebar__list__block__children__link"
              :key="`child-${childIndex}`"
              :to="{ name: child.path, params: { locale } }"
              active-class="sidebar__list__block__children__link--active"
            >
              <img
                class="mr-7"
                width="10"
                height="10"
                src="../../assets/icons/circle.svg"
                alt=""
              />
              <span
                v-if="nameIsVisible"
                class="sidebar__list__block__children__link__text"
              >
                {{ child.name }}
              </span>
            </router-link>
          </template>
        </div>
      </div>
    </div>
    <div class="sidebar__main" :class="[{ 'sidebar__main--mini': isMini }]">
      <slot />
    </div>
    <span
      @click="$emit('toggle-mini')"
      :class="[{ 'sidebar__shadow--active': !isMini }, 'sidebar__shadow']"
    />
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import TheProfileDropdown from '@/components/layouts/TheProfileDropdown.vue'
import TheHeaderCourse from '@/components/layouts/TheHeaderCourse.vue'
import TheHeaderLang from '@/components/layouts/TheHeaderLang.vue'

import { computed, onMounted, ref, watch } from 'vue'
import type { ListTypes } from '@/types/components/ListTypes'
import { useRoute } from 'vue-router'
import {
  MINI_MENU_MEDIA_WIDTH,
  MEDIUM_MENU_MEDIA_WIDTH,
  ROLES,
} from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { useUserService } from '@/plugins/user-service'
import { useThemeService } from '@/plugins/theme-service'

const { theme, THEME, toggleTheme } = useThemeService()
const { t, locale } = useI18n()
const { user, role } = useUserService()
const route = useRoute()

const props = defineProps({
  isMini: { type: Boolean, default: true },
  windowWidth: { type: Number, default: 0 },
})
const listFrom: any = ref([])
const miniIsMini = ref(false)
const nameIsVisible = ref(true)
const oldRef = ref([]) as any

watch(
  () => props.isMini,
  (val) => {
    if (val) {
      miniIsMini.value = val
      if (oldRef.value && oldRef.value.length) {
        oldRef.value[0].style.height = 0
      }
    } else {
      setTimeout(() => {
        nameIsVisible.value = true
        miniIsMini.value = val
        closeAndAddIsOpen()
      }, 150)
    }
  }
)

watch(
  () => route.path,
  () => {
    if (props.windowWidth < MEDIUM_MENU_MEDIA_WIDTH) {
      emits('toggle-mini')
      closeAndAddIsOpen()
    }
  }
)

const emits = defineEmits(['toggle-mini'])
onMounted(() => {
  closeAndAddIsOpen()
})

const closeAndAddIsOpen = () => {
  listFrom.value = menus.value.map((p: ListTypes) => {
    p.isOpen = false
    return p
  })
}

const childToggleMenu = (list: ListTypes, refs: any) => {
  if (!list.isOpen) {
    listFrom.value.forEach((p: ListTypes) => {
      p.isOpen = false
    })
  }
  if (props.isMini && props.windowWidth > MINI_MENU_MEDIA_WIDTH) {
    nameIsVisible.value = false
    miniIsMini.value = false
    closeAndAddIsOpen()
  }
  if (oldRef.value && oldRef.value.length) {
    oldRef.value[0].style.height = 0
  }
  if (props.isMini) {
    setTimeout(() => {
      afterOpenMenu(refs, list)
    }, 200)
  } else {
    afterOpenMenu(refs, list)
  }
  oldRef.value = refs
}

const afterOpenMenu = (refs: any, list: ListTypes) => {
  let blockHeight = 0
  if (refs && refs[0].children && Object.keys(refs[0].children).length) {
    Object.keys(refs[0].children).forEach((p: any) => {
      if (refs[0].children[p]) {
        blockHeight += refs[0].children[p].clientHeight
      }
    })
  }
  if (list.children && list.children.length) {
    list.isOpen = !list.isOpen
    if (blockHeight && list.isOpen) {
      refs[0].style.height = `${blockHeight}px`
    } else {
      refs[0].style.height = 0
    }
  }
}

const menus = computed(() => {
  if (user.value?.type === ROLES.SUPER_ADMIN) {
    return [
      {
        name: t('main'),
        icon: 'home-icon',
        path: 'dashboard-admin',
      },
      {
        name: t('placeList'),
        icon: 'location',
        path: 'locations',
        permission: 'admin.locations.index',
      },
      {
        name: t('clientControlling'),
        icon: 'clients',
        permission: [
          'admin.organisation.index',
          'admin.organisation.transactions.index',
        ],
        children: [
          {
            name: t('organisations'),
            path: 'organisations-admin',
            permission: 'admin.organisation.index',
          },
          {
            name: t('payments'),
            path: 'payments',
            permission: 'admin.organisation.transactions.index',
          },
        ],
      },
      {
        name: t('reference'),
        icon: 'info-square',
        permission: [
          'admin.currencies.index',
          'admin.system.courses.index',
          'admin.unites.index',
        ],
        children: [
          {
            name: t('currencies'),
            path: 'reference-currencies',
            permission: 'admin.currencies.index',
          },
          {
            name: t('systemCourse'),
            path: 'reference-courses',
            permission: 'admin.system.courses.index',
          },
          {
            name: t('units'),
            path: 'reference-units',
            permission: 'admin.unites.index',
          },
        ],
      },
      {
        name: t('employees'),
        icon: 'employees',
        permission: ['admin.roles.index', 'admin.employee.index'],
        children: [
          {
            name: t('roles'),
            path: 'roles-admin',
            permission: 'admin.roles.index',
          },
          {
            name: t('users'),
            path: 'users',
            permission: 'admin.employee.index',
          },
        ],
      },
      {
        name: t('setting'),
        icon: 'setting-icon',
        permission: ['admin.tariffs.index'],
        children: [
          {
            name: t('tariffs'),
            path: 'tariffs',
            permission: 'admin.tariffs.index',
          },
        ],
      },
    ]
  }
  if (
    user.value?.type === ROLES.ORGANISATION ||
    user.value?.type === ROLES.EMPLOYER
  ) {
    return [
      {
        name: t('main'),
        icon: 'home-icon',
        path: 'dashboard-organisation',
      },
      {
        name: t('inventoryControl'),
        icon: 'document',
        permission: [
          'organisation.documents.index',
          'organisation.entering-products.index',
          'organisation.revaluation.index',
          'organisation.inventory.index',
          'organisation.returns.index',
          'organisation.write.off.index',
        ],
        children: [
          {
            name: t('incoming'),
            path: 'inventory-income',
            permission: 'organisation.documents.index',
          },
          {
            name: t('enteringBalances'),
            path: 'inventory-balance',
            permission: 'organisation.entering-products.index',
          },
          {
            name: t('rePricing'),
            path: 'inventory-revaluation',
            permission: 'organisation.revaluation.index',
          },
          {
            name: t('inventory'),
            path: 'inventory-inventory',
            permission: 'organisation.inventory.index',
          },
          {
            name: t('returnToSupplier'),
            path: 'inventory-return',
            permission: 'organisation.returns.index',
          },
          {
            name: t('writeOff'),
            path: 'inventory-write-off',
            permission: 'organisation.write.off.index',
          },
        ],
      },
      {
        name: t('organisationsAndWarehouse'),
        icon: 'home',
        permission: ['organisation.index', 'organisation.stores.index'],
        children: [
          {
            name: t('organisations'),
            path: 'organisations',
            permission: 'organisation.index',
          },
          {
            name: t('warehouses'),
            path: 'warehouses',
            permission: 'organisation.stores.index',
          },
        ],
      },
      {
        name: t('financialAccounting'),
        icon: 'financial-accounting',
        permission: [
          'account.index',
          'organisation.income.index',
          'organisation.spending.index',
          'finance.accounting.index',
        ],
        children: [
          {
            name: t('counterpartyAccounts'),
            path: 'financial-accounting-accounts',
            permission: 'account.index',
          },
          {
            name: t('income'),
            path: 'financial-accounting-income',
            permission: 'organisation.income.index',
          },
          {
            name: t('outcome'),
            path: 'financial-accounting-spending',
            permission: 'organisation.spending.index',
          },
          {
            name: t('mutualSettlements'),
            path: 'financial-accounting-settlements',
            permission: 'finance.accounting.index',
          },
        ],
      },
      {
        name: t('cashRegister'),
        icon: 'cash',
        permission: [
          'cash-box.sell',
          'cash-box.entity.sell',
          'cash-box.reverted.checks',
          'cash-box.give.bonus',
        ],
        children: [
          {
            name: t('directSale'),
            path: 'cash-register',
            permission: 'cash-box.sell',
          },
          {
            name: t('entitySell'),
            path: 'entity-sell',
            permission: 'cash-box.entity.sell',
          },
          {
            name: t('revertProduct'),
            path: 'reverted-checks-list',
            permission: 'cash-box.reverted.checks',
          },
          {
            name: t('saleInBonus'),
            path: 'give-bonus',
            permission: 'cash-box.give.bonus',
          },
        ],
      },
      {
        name: t('reference'),
        icon: 'info-square',
        permission: [
          'reference.income.index',
          'reference.expenses.index',
          'organisation.categories.index',
          'organisation.products.index',
        ],
        children: [
          {
            name: t('incomeAndOutcome'),
            path: 'reference-income-outcome',
            permission: ['reference.income.index', 'reference.expenses.index'],
          },
          {
            name: t('categoryProducts'),
            path: 'reference-category-products',
            permission: 'organisation.categories.index',
          },
          // { name: t('characteristics'), path: 'reference-characteristics' },
          {
            name: t('productName'),
            path: 'reference-product-name',
            permission: 'organisation.products.index',
          },
        ],
      },
      {
        name: t('counterparties'),
        icon: 'work',
        permission: [
          'counterparty.index',
          'organisation.contracts.index',
          'organisation.invoices.index',
        ],
        children: [
          {
            name: t('counterparties'),
            path: 'counterparty-counterparties',
            permission: 'counterparty.index',
          },
          {
            name: t('agreements'),
            path: 'counterparty-contracts',
            permission: 'organisation.contracts.index',
          },
          {
            name: t('invoices'),
            path: 'counterparty-invoices',
            permission: 'organisation.invoices.index',
          },
        ],
      },
      {
        name: t('reports'),
        icon: 'list',
        permission: [
          'reports.stock.organisation.products',
          'reports.stock.available.products',
          'reports.stock.document.register',
          'reports.sale.sale.reports',
          'reports.sale.individuals',
        ],
        children: [
          {
            name: t('reportsByStock'),
            path: 'reports-stock',
            permission: [
              'reports.stock.organisation.products',
              'reports.stock.available.products',
              'reports.stock.document.register',
            ],
          },
          {
            name: t('salesReport'),
            path: 'reports-sales',
            permission: [
              'reports.sale.sale.reports',
              'reports.sale.individuals',
            ],
          },
        ],
      },
      {
        name: t('workersControlling'),
        icon: 'users',
        permission: [
          'organisation.roles.index',
          'reference.position.index',
          'reference.department.index',
          'organisation.employee.index',
        ],
        children: [
          {
            name: t('roles'),
            path: 'roles',
            permission: 'organisation.roles.index',
          },
          {
            name: t('positions'),
            path: 'positions',
            permission: 'reference.position.index',
          },
          {
            name: t('departments'),
            path: 'departments',
            permission: 'reference.department.index',
          },
          {
            name: t('employees'),
            path: 'employees',
            permission: 'organisation.employee.index',
          },
        ],
      },
      {
        name: t('setting'),
        icon: 'setting-icon',
        permission: [
          'bonuses.index',
          'organisation.transactions.index',
          'organisation.courses.index',
        ],
        children: [
          {
            name: t('bonusTariff'),
            path: 'settings-bonus-tariffs',
            permission: 'bonuses.index',
          },
          {
            name: t('balance'),
            path: 'settings-balance',
            permission: 'organisation.transactions.index',
          },
          {
            name: t('systemCourse'),
            path: 'settings-currencies',
            permission: 'organisation.courses.index',
          },
        ],
      },
    ]
  }
  return []
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-sidebar';
</style>
