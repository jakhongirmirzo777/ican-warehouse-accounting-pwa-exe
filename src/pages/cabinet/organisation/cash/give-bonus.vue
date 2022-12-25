<template>
  <div>
    <VBreadcrumb class="mb-18" :list="breadcrumbs" />
    <VText class="mb-24" tag="h2" weight="600" color="#0E1E56">
      {{ t('saleInBonus') }}
    </VText>
    <VCard class="direct-sale__body">
      <Form ref="cashRegisterRef">
        <VRow>
          <VCol md="12">
            <form @submit.prevent="startFilter">
              <VRow>
                <VCol md="3" class="direct-sale__search">
                  <VSelect
                    :label="$t('clientType')"
                    :items="clientTypeList"
                    item-text="title"
                    item-value="value"
                    clearable
                    @change="changeClientType"
                    autocomplete
                    v-model="params.client_type"
                  />
                </VCol>
                <VCol
                  md="3"
                  class="direct-sale__search"
                  v-if="params.client_type === CLIENT_TYPES.credit"
                >
                  <VSelect
                    :label="$t('clientType')"
                    :items="clientTypeListForCredits"
                    item-text="title"
                    item-value="value"
                    clearable
                    autocomplete
                    v-model="params.client_type_credit"
                  />
                </VCol>
                <VCol
                  md="3"
                  v-if="
                    params.client_type === CLIENT_TYPES.entity ||
                    (params.client_type === CLIENT_TYPES.credit &&
                      params.client_type_credit === CLIENT_TYPES.entity)
                  "
                  class="direct-sale__search"
                >
                  <VSelect
                    :items="counterpartyList"
                    item-text="company_name"
                    item-value="id"
                    rules="required"
                    vid="counterparty_id"
                    autocomplete
                    :label="$t('counterparties')"
                    v-model="params.counterparty_id"
                    clearable
                  />
                  <VTransition>
                    <v-card
                      v-if="checkChooseList.length"
                      class="direct-sale__search__body"
                    >
                      <VTable
                        :items="checkChooseList"
                        :headers="headersForSelectableResponse"
                        clickable
                      >
                        <template #item.choose="{ item }">
                          <VCheckbox
                            :value="item.check_number"
                            v-model="selectedChecks"
                          />
                        </template>
                      </VTable>
                      <VCardAction>
                        <VSpacer />
                        <VBtn
                          @click="cancelChoseSearchResponse"
                          color="primary"
                          class="mr-10"
                          >{{ $t('save') }}</VBtn
                        >
                      </VCardAction>
                    </v-card>
                  </VTransition>
                </VCol>
                <VCol
                  md="3"
                  v-if="params.client_type === CLIENT_TYPES.individual"
                >
                  <VInput
                    :label="$t('checkNumber')"
                    type="number"
                    v-model="params.check_number"
                    clearable
                  />
                </VCol>
                <VCol
                  md="3"
                  v-if="
                    params.client_type === CLIENT_TYPES.credit &&
                    params.client_type_credit === CLIENT_TYPES.individual
                  "
                >
                  <VInput
                    :label="$t('PNFL')"
                    counter="14"
                    :pattern="'##############'"
                    type="number"
                    v-model="params.pnfl"
                    clearable
                  />
                </VCol>
                <VCol
                  md="3"
                  v-if="
                    params.client_type === CLIENT_TYPES.individual ||
                    (params.client_type === CLIENT_TYPES.credit &&
                      params.client_type_credit === CLIENT_TYPES.individual)
                  "
                >
                  <VInput :label="$t('fio')" v-model="full_name" clearable />
                </VCol>
                <VCol sm="12" md="1">
                  <VBtn
                    style="display: flex"
                    min-width="40px"
                    color="primary"
                    class="mb-20 mb-md-0 justify-center align-center w-100"
                    type="submit"
                    :disabled="isDisabled"
                  >
                    <VIcon size="24" icon="search-solid" />
                  </VBtn>
                </VCol>
              </VRow>
            </form>
          </VCol>
        </VRow>
      </Form>
      <VLine class="mb-20" />
      <VTable :headers="headers" :items="items">
        <template #item.actions="{ item, iy }">
          <VBtn
            :class="['ml-2', { disabled: item.is_bonus }]"
            small
            @click="deleteItem(iy)"
          >
            <VIcon size="12" icon="delete" />
          </VBtn>
        </template>
        <template #item.client_type="{ item }">
          <span>{{ $t(`${item.client_type}`) }}</span>
        </template>
        <template #item.amount_sum="{ item }">
          {{ $moneyFormatWithComma(item.amount_sum) }}
        </template>
      </VTable>
      <div class="mt-10 mb-15 direct-sale__body__payment-text">
        {{ $t('totalPayable') }}:
        <b class="direct-sale__body__payment-text__amount">{{
          allPriceWithFormat
        }}</b>
      </div>
      <VLine class="my-20" />
      <div class="d-flex">
        <VSpacer />
        <VBtn color="primary" :disabled="!items.length" @click="nextStep">
          {{ $t('productSelection') }}
          <VIcon color="white" size="14" class="ml-10" icon="arrow-right" />
        </VBtn>
      </div>
    </VCard>
  </div>
</template>

<script setup lang="ts">
import VTable from '@/components/ui/VTable.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VSelect from '@/components/ui/VSelect.vue'
import VLine from '@/components/ui/VLine.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VSpacer from '@/components/ui/VSpacer.vue'
import VBreadcrumb from '@/components/ui/VBreadcrumb.vue'
import VText from '@/components/ui/VText.vue'
import VCardAction from '@/components/ui/VCardAction.vue'
import VCheckbox from '@/components/ui/VCheckbox.vue'
import VTransition from '@/components/ui/VTransition.vue'

import { computed, ref, onBeforeUnmount, defineProps } from 'vue'
import { CLIENT_TYPES, GIVE_BONUS } from '@/utils/constants'
import { useI18n } from 'vue-i18n'
import { searchCheck } from '@/services/cabinet/CashService'
import { useErrorActions } from '@/composables/set-errors'
import { useNotificationService } from '@/plugins/notification-service'
import { useLoadingService } from '@/plugins/loading-service'
import { useQuery } from '@/composables/router-query'
import { $moneyFormatWithComma } from '@/utils/pure-functions'
import { $localePath } from '@/plugins/i18n'
import { useRouter } from 'vue-router'
import { useStorageService } from '@/plugins/storage-service'
import type {
  GiveBonusParamsType,
  GiveBonusDataTypes,
} from '@/types/cabinet/CashTypes'
import type { CounterpartyListWitContractType } from '@/types/cabinet/CounterpertyContractsTypes'
import { fetchCounterpartyWithContract } from '@/services/cabinet/CounterpartyContractsServices'

const { $setResponseErrors } = useErrorActions()
const { $showLoading, $clearLoading } = useLoadingService()
const { $successMessage, $errorMessage } = useNotificationService()
const { $addQuery, $getQuery, $clearQuery } = useQuery()
const { $set, $get } = useStorageService()
const router = useRouter()

const { t } = useI18n()

$clearQuery([
  'client_type',
  'check_number',
  'counterparty_id',
  'pnfl',
  'client_type_credit',
])
const queries = $getQuery([
  'client_type',
  'check_number',
  'counterparty_id',
  'pnfl',
  'client_type_credit',
])

defineProps({
  steps: {
    type: Object,
  },
})

//static variables

const breadcrumbs = [
  {
    name: t('cashRegister'),
  },
  {
    name: t('saleInBonus'),
  },
]

const params = ref<GiveBonusParamsType>({
  client_type: queries.client_type || '',
  check_number: +queries.check_number || null,
  counterparty_id: +queries.counterparty_id || null,
  client_type_credit: queries.client_type_credit || '',
  pnfl: +queries.pnfl || null,
})

const full_name = ref('')
const items = ref<GiveBonusDataTypes[]>([])
const counterpartyList = ref<Array<CounterpartyListWitContractType>>([])
const checkChooseList = ref<GiveBonusDataTypes[]>([])
const selectedChecks = ref<Array<string | number>>([])

const clientTypeList = computed(() => {
  const result: Array<Record<string, string>> = []
  Object.keys(CLIENT_TYPES).forEach((p: string) => {
    result.push({
      title: t(p),
      value: p,
    })
  })
  return result
})

const clientTypeListForCredits = computed(() => {
  const result: Array<Record<string, string>> = []
  Object.keys(CLIENT_TYPES).forEach((p: string) => {
    if (p !== CLIENT_TYPES.credit) {
      result.push({
        title: t(p),
        value: p,
      })
    }
  })
  return result
})

//refs
const cashRegisterRef = ref()

const allPriceWithFormat = computed(() => {
  let amount = 0
  items.value.forEach((p) => {
    amount += p.amount_sum
  })
  return $moneyFormatWithComma(amount)
})

const isDisabled = computed(() => {
  if (
    params.value.client_type === CLIENT_TYPES.individual &&
    params.value.check_number
  )
    return false
  else if (
    params.value.client_type === CLIENT_TYPES.entity &&
    params.value.counterparty_id
  )
    return false
  else if (
    params.value.client_type === CLIENT_TYPES.credit &&
    params.value.client_type_credit === CLIENT_TYPES.entity &&
    params.value.counterparty_id
  )
    return false
  else if (
    params.value.client_type === CLIENT_TYPES.credit &&
    params.value.client_type_credit === CLIENT_TYPES.individual &&
    params.value.check_number
  )
    return false
  return true
})

const startFilter = async () => {
  $showLoading()
  try {
    await fetchData()
    if (params.value.client_type === CLIENT_TYPES.individual)
      params.value.check_number = null
    $addQuery(params.value)
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const fetchData = async () => {
  try {
    let { data } = await searchCheck(params.value)
    data = data.map((p: GiveBonusDataTypes, i: number) => {
      p.id = items.value.length + i + 1
      return p
    })
    if (params.value.client_type === CLIENT_TYPES.individual) {
      const isNotUnique = items.value.filter(
        (p) => p.check_number === data[0].check_number
      )
      if (
        !isNotUnique.length &&
        params.value.client_type === CLIENT_TYPES.individual
      )
        items.value.push(...data)
      else $errorMessage(t('selectedCheckAvailableList'))
    } else {
      checkChooseList.value.push(...data)
      return
    }
    SET_ITEMS()
  } catch (err) {
    $setResponseErrors(err)
  }
}

const cancelChoseSearchResponse = () => {
  let counter = 0
  checkChooseList.value.forEach((p) => {
    const inst = items.value.map((q) => q.check_number).indexOf(p.check_number)
    if (selectedChecks.value.includes(p.check_number) && inst === -1) {
      items.value.push(p)
    }
    if (inst > -1) {
      counter++
    }
  })
  if (counter) {
    $errorMessage(t('selectedCheckAvailableList'))
  }
  SET_ITEMS()
  checkChooseList.value = []
  selectedChecks.value = []
}

const nextStep = async () => {
  await SET_ITEMS()
  await router.push($localePath('/cabinet/give-bonus-choose-product'))
}

const deleteItem = (index: number) => {
  items.value.splice(index, 1)
  $successMessage(t('notifications.deletedSuccessfully'))
}

const getCounterPartyList = async (id: number | null) => {
  try {
    const { data } = await fetchCounterpartyWithContract(id)
    counterpartyList.value = data
  } catch (err) {
    $setResponseErrors(err)
  }
}

const changeClientType = () => {
  params.value.client_type_credit = ''
  params.value.check_number = null
  params.value.counterparty_id = null
  params.value.pnfl = null
  items.value = []
  checkChooseList.value = []
  selectedChecks.value = []
  $addQuery(params.value)
}

onBeforeUnmount(() => {
  items.value = []
})

const SET_ITEMS = async () => {
  const check_numbers = [] as Array<string>
  items.value.forEach((p) => {
    if (p.check_number) {
      check_numbers.push(p.check_number)
    }
  })
  const result = {
    client_type: params.value.client_type,
    products: items.value,
    total_amount: allPriceWithFormat.value,
  } as Record<string, any>
  if (params.value.counterparty_id)
    result.counterparty_id = params.value.counterparty_id
  if (params.value.pnfl) result.pnfl = params.value.pnfl
  if (check_numbers.length) result.check_numbers = check_numbers
  if (full_name.value) result.full_name = full_name.value
  $set(GIVE_BONUS, result)
}

const useFetchData = async () => {
  $showLoading()
  await getCounterPartyList(null)
  const data = $get(GIVE_BONUS)
  if (data) {
    items.value = data?.products
  }
  $clearLoading()
}

useFetchData()

const headers = ref([
  {
    text: '№',
    value: 'id',
    width: '30px',
  },
  { text: t('amount'), value: 'amount_sum' },
  { text: t('buyer'), value: 'buyer' },
  { text: t('checkNumber'), value: 'check_number' },
  { text: t('clientType'), value: 'client_type' },
  { text: t('salesDate'), value: 'sale_date' },
  {
    text: t('delete'),
    value: 'actions',
    width: '150px',
  },
])
const headersForSelectableResponse = ref([
  { text: t('amount'), value: 'amount_sum' },
  { text: t('checkNumber'), value: 'check_number' },
  { text: t('salesDate'), value: 'sale_date' },
  { text: t('choose'), value: 'choose' },
])
</script>

<style lang="scss" scoped>
@import '../../../../assets/styles/pages/direct-sale.scss';
</style>
