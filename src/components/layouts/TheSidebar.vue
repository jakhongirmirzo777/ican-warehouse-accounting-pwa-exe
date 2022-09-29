<template>
  <div class="sidebar">
    <div class="sidebar__list" :class="[{ 'sidebar__list--mini': isMini }]">
      <div class="sidebar__list__header">
        <VIcon
          icon="x-mark"
          size="30"
          color="#AFCBEF"
          class="mr-20"
          @click="$emit('toggleMini')"
        />
        <ProfileDropdown class="sidebar__list__profile-dropdown" theme />
      </div>
      <VLine />
      <div
        v-for="(list, i) in listFrom"
        :key="`list-${i}`"
        class="sidebar__list__block"
      >
        <component
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
          <router-link
            class="sidebar__list__block__children__link"
            v-for="(child, childIndex) in list.children"
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
            <span class="sidebar__list__block__children__link__text">{{
              child.name
            }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <div class="sidebar__main" :class="[{ 'sidebar__main--mini': isMini }]">
      <slot />
    </div>
    <span
      @click="$emit('toggleMini')"
      :class="[{ 'sidebar__shadow--active': !isMini }, 'sidebar__shadow']"
    />
  </div>
</template>

<script lang="ts" setup>
import VIcon from '@/components/ui/VIcon.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import VLine from '@/components/ui/VLine.vue'
import ProfileDropdown from '@/components/layouts/ProfileDropdown.vue'

import { computed, onMounted, ref, watch } from 'vue'
import type { ListTypes } from '@/types/components/ListTypes'
import { useRoute } from 'vue-router'
import { MINI_MENU_MEDIA_WIDTH } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { useUserService } from '@/plugins/user-service'

const { t, locale } = useI18n()
const { user } = useUserService()
const route = useRoute()

const props = defineProps({
  isMini: { type: Boolean, default: true },
  windowWidth: { type: Number, default: 0 },
})
const listFrom: any = ref([])
const miniIsMini = ref(false)
const oldRef = ref([]) as any

watch(props, (val) => {
  if (val.isMini) {
    miniIsMini.value = val.isMini
    if (oldRef.value && oldRef.value.length) {
      oldRef.value[0].style.height = 0
    }
  } else {
    setTimeout(() => {
      miniIsMini.value = val.isMini
      closeAndAddIsOpen()
    }, 150)
  }
})

watch(route, () => {
  if (props.windowWidth < MINI_MENU_MEDIA_WIDTH) {
    emits('toggleMini')
    closeAndAddIsOpen()
  }
})

const emits = defineEmits(['toggleMini'])
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
  let blockHeight = 0
  if (!list.isOpen) {
    listFrom.value.forEach((p: ListTypes) => {
      p.isOpen = false
    })
  }
  if (oldRef.value && oldRef.value.length) {
    oldRef.value[0].style.height = 0
  }
  if (refs && refs[0].children && Object.keys(refs[0].children).length) {
    Object.keys(refs[0].children).forEach((p: any) => {
      if (refs[0].children[p]) {
        blockHeight += refs[0].children[p].clientHeight
      }
    })
  }
  if (props.isMini && props.windowWidth > MINI_MENU_MEDIA_WIDTH) {
    emits('toggleMini')
    closeAndAddIsOpen()
  }
  if (list.children && list.children.length) {
    list.isOpen = !list.isOpen
    if (blockHeight && list.isOpen) {
      refs[0].style.height = `${blockHeight}px`
    } else {
      refs[0].style.height = 0
    }
  }
  oldRef.value = refs
}

const menus = computed(() => {
  if (user.value?.type === 'superAdmin') {
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
      },
      {
        name: t('clientControlling'),
        icon: 'clients',
        children: [
          { name: t('organisations'), path: 'mko-organisations-admin' },
        ],
      },
      {
        name: t('reference'),
        icon: 'info-square',
        children: [
          { name: t('currencies'), path: 'reference-system-courses' },
          { name: t('units'), path: 'reference-units' },
        ],
      },
    ]
  }
  if (user.value?.type === 'organisation') {
    return [
      {
        name: t('main'),
        icon: 'home-icon',
        path: 'dashboard-organisation',
      },
      // {
      //   name: 'Складской учет',
      //   icon: 'document',
      //   children: [
      //     { name: 'Приход', path: 'dashboard-admin' },
      //     { name: 'Ввод остатков', path: 'credits-admin' },
      //     { name: 'Переоценка', path: 'dashboard' },
      //     { name: 'Инвентаризация', path: 'credits' },
      //     { name: 'Перемещение между складами', path: 'dashboard-admin' },
      //     { name: 'Возврат поставщику', path: 'credits' },
      //     { name: 'Списание', path: 'dashboard' },
      //   ],
      // },
      // {
      //   name: 'Учет основных средств',
      //   icon: 'graph',
      //   children: [
      //     { name: 'Приход', path: 'dashboard-admin' },
      //     { name: 'Ввод остатков', path: 'credits-admin' },
      //   ],
      // },
      {
        name: t('organisationsAndWarehouse'),
        icon: 'home',
        children: [{ name: t('organisations'), path: 'mko-organisations' }],
      },
      // {
      //   name: 'Финансовый учет',
      //   icon: 'activity',
      //   children: [
      //     { name: 'Приход', path: 'dashboard-admin' },
      //     { name: 'Ввод остатков', path: 'credits-admin' },
      //   ],
      // },
      // {
      //   name: 'Касса',
      //   icon: 'terminal',
      //   children: [
      //     { name: 'Приход', path: 'dashboard-admin' },
      //     { name: 'Ввод остатков', path: 'credits-admin' },
      //   ],
      // },
      {
        name: t('reference'),
        icon: 'info-square',
        children: [
          { name: t('incomeAndOutcome'), path: 'reference-income-outcome' },
          { name: t('categoryProducts'), path: 'reference-category-products' },
          { name: t('characteristics'), path: 'reference-characteristics' },
          { name: t('productName'), path: 'reference-product-name' },
        ],
      },
      {
        name: t('counterparties'),
        icon: 'work',
        children: [
          { name: t('organisations'), path: 'counterparty-organisations' },
          { name: t('invoices'), path: 'counterparty-invoice' },
          // { name: 'Ввод остатков', path: 'credits-admin' },
        ],
      },
      // {
      //   name: 'Отчеты',
      //   icon: 'list',
      //   children: [
      //     { name: 'Приход', path: 'dashboard-admin' },
      //     { name: 'Ввод остатков', path: 'credits-admin' },
      //   ],
      // },
      {
        name: t('workersControlling'),
        icon: 'users',
        children: [
          { name: t('positions'), path: 'workers-controlling-positions' },
          { name: t('departments'), path: 'workers-controlling-departments' },
        ],
      },
      // {
      //   name: 'Настройки',
      //   icon: 'setting-icon',
      //   children: [
      //     { name: 'Приход', path: 'dashboard-admin' },
      //     { name: 'Ввод остатков', path: 'credits-admin' },
      //   ],
      // },
    ]
  }
  return [
    {
      name: t('main'),
      icon: 'home-icon',
      path: 'dashboard-employer',
    },
  ]
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-sidebar';
</style>
