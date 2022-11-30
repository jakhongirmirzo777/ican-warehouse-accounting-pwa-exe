<template>
  <VCard>
    <VRow>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('numberForDocument') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.number }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('date') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.date }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('organisation') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.organisation_name }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('counterpart') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.counterparties_company_name }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('agreement') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.contract_number }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('invoice') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.invoice_number }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('warehouse') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.store_name }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('currencyOfDocument') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.currency }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('systemCourse') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.course }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('countOfProducts') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.products_count_sum || 0 }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('incomePrice') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.incoming_price_sum || 0 }}
        </VText>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('sellPrice') }}
        </VText>
        <VText weight="500" size="14" color="#18275D" tag="h4">
          {{ document.selling_price_sum || 0 }}
        </VText>
      </VCol>
    </VRow>
    <VRow>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('status') }}
        </VText>
        <VStatus
          min-width="80px"
          :theme="INVENTORY_DOCUMENTS_COLORED[document.status]?.theme"
          :color="INVENTORY_DOCUMENTS_COLORED[document.status]?.color"
        >
          {{ document.status_text }}
        </VStatus>
      </VCol>
      <VCol class="mb-18" md="2">
        <VText weight="400" class="mb-6" size="12" color="#868EAA" tag="h5">
          {{ t('statusOfFinRecord') }}
        </VText>
        <VStatus
          min-width="80px"
          :theme="
            document.is_fin_post
              ? 'rgba(40, 180, 70, 0.24)'
              : 'rgba(230,168,18,0.24)'
          "
          :color="document.is_fin_post ? '#28B446' : '#E6A812'"
        >
          {{ document.is_fin_post ? t('heldFinRecord') : t('unHeldFinRecord') }}
        </VStatus>
      </VCol>
      <VCol class="mb-18" md="8">
        <div class="h-100 w-100 d-flex align-end justify-end">
          <VBtn
            class="w-100 w-md-unset"
            outlined
            color="primary"
            @click="$emit('edit')"
          >
            <VIcon size="16" icon="pencil-blue" class="mr-8" />
            <span>{{ t('edit') }}</span>
          </VBtn>
        </div>
      </VCol>
    </VRow>
  </VCard>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import VCard from '@/components/ui/VCard.vue'
import VCol from '@/components/ui/VCol.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VText from '@/components/ui/VText.vue'
import VRow from '@/components/ui/VRow.vue'
import VStatus from '@/components/ui/VStatus.vue'
import { INVENTORY_DOCUMENTS_COLORED } from '@/utils/constants'

const { t } = useI18n()

defineProps({
  document: {
    type: Object,
    default: () => ({}),
  },
})

defineEmits(['edit'])
</script>
