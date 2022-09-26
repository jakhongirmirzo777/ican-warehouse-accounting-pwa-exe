<template>
  <Form @submit="useCreateOrUpdateCharacteristics">
    <div class="d-flex justify-between align-center mb-24">
      <div class="d-flex align-center">
        <VBackBtn class="mr-16" />
        <VText tag="h2" weight="600" color="#0E1E56">
          {{ paramsId ? t('editCharacteristics') : t('addCharacteristics') }}
        </VText>
      </div>
      <VBtn width="120px" type="submit" color="primary" :loading="loading">
        <VIcon v-if="!paramsId" class="mr-14" size="20" icon="circle-plus" />
        {{ paramsId ? t('edit') : t('add') }}
      </VBtn>
    </div>
    <VRow>
      <VCol md="6">
        <VCard class="h-100">
          <VRow>
            <VCol md="6">
              <VInput
                vid="name"
                :label="t('name')"
                rules="required"
                v-model="formData.name"
              />
            </VCol>
            <VCol md="6">
              <div class="d-flex">
                <VInput
                  class="mb-8 mr-5"
                  vid="values"
                  :label="t('value')"
                  rules="required"
                  v-model="formData.value"
                />
                <VBtn
                  min-width="40px"
                  width="50px"
                  color="primary"
                  @click="formData.values.push(null)"
                >
                  <VIcon size="20" icon="circle-plus" />
                </VBtn>
              </div>
              <TransitionGroup name="list">
                <div v-for="(_, i) in formData.values" :key="i" class="d-flex">
                  <VInput
                    class="mb-8 mr-5"
                    :vid="`values-${i}`"
                    label="Значение"
                    rules="required"
                    v-model="formData.values[i]"
                  />
                  <VBtn
                    min-width="40px"
                    width="50px"
                    color="danger"
                    @click="formData.values.splice(i, 1)"
                  >
                    <VIcon color="#fff" size="20" icon="x-mark" />
                  </VBtn>
                </div>
              </TransitionGroup>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
      <VCol md="6">
        <VCard class="h-100">
          <VText class="mb-10" tag="h3" weight="600" color="#0E1E56">
            {{ t('category') }}
          </VText>
          <ElTree
            class="mb-8"
            ref="treeRef"
            :data="categoryList"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            :props="defaultProps"
            @check="validateTree"
          />
          <Field
            :model-value="formData.categories"
            name="categories"
            :label="t('category')"
            rules="required"
            v-slot="{ errors }"
          >
            <VTransition>
              <span
                v-if="errors && errors[0]"
                class="color-dark-red"
                style="font-size: 12px"
              >
                {{ errors[0] }}
              </span>
            </VTransition>
          </Field>
        </VCard>
      </VCol>
    </VRow>
  </Form>
</template>

<script lang="ts" setup>
import VText from '@/components/ui/VText.vue'
import VCard from '@/components/ui/VCard.vue'
import VRow from '@/components/ui/VRow.vue'
import VCol from '@/components/ui/VCol.vue'
import VInput from '@/components/ui/VInput.vue'
import VBtn from '@/components/ui/VBtn.vue'
import VIcon from '@/components/ui/VIcon.vue'
import VTransition from '@/components/ui/VTransition.vue'
import VBackBtn from '@/components/ui/VBackBtn.vue'
import { ElTree } from 'element-plus'

import {
  fetchCharacteristic,
  fetchCategories,
  createCharacteristics,
  editCharacteristics,
} from '@/services/cabinet/ReferenceCharacteristicsService'
import { useLoadingService } from '@/plugins/loading-service'
import { useErrorActions, useFormActions } from '@/composables/set-errors'
import type { ActionInterface } from '@/types/globals/SetErrorsTypes'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { $localePath } from '@/plugins/i18n'

const router = useRouter()
const route = useRoute()
const { $showLoading, $clearLoading } = useLoadingService()
const { $setResponseErrors } = useErrorActions()
const { t } = useI18n()

const defaultProps = {
  children: 'children',
  label: 'name',
}

const FORM_DATA: {
  name: null | string
  value: null | string
  values: string[]
  categories: number[]
} = {
  name: null,
  value: null,
  values: [],
  categories: [],
}

const characteristicData = ref<Record<string, any>>({})
const treeRef = ref<any>(null)
const formData = ref({ ...FORM_DATA })
const categoryList = ref([])
const loading = ref(false)
const paramsId = computed((): number => {
  return +route.params.id
})

const validateTree = (_: never, values: { checkedKeys: number[] }) => {
  formData.value.categories = values.checkedKeys
}

const getCheckedNodes = () => {
  return treeRef.value?.getCheckedNodes(false, false)
}

const setCheckedKeys = () => {
  const ids = characteristicData.value.categories?.map(
    (item: Record<string, number>) => item.category_id
  )
  treeRef.value?.setCheckedKeys(ids, false)
}

const useFetchCategories = async () => {
  try {
    const {
      data: { data },
    } = await fetchCategories()
    categoryList.value = data
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchCharacteristic = async () => {
  if (!paramsId.value) return
  try {
    const {
      data: { data },
    } = await fetchCharacteristic(paramsId.value)
    characteristicData.value = data
    formData.value.name = data.name
    if (data.values.length && data.values.length > 1) {
      formData.value.value = data.values[0].value
      formData.value.values = data.values
        .slice(1)
        .map((item: { value: string }) => item.value)
    } else if (data.values.length && data.values.length === 1) {
      formData.value.value = data.values[0].value
    }
  } catch (err) {
    return Promise.reject(err)
  }
}

const useFetchData = async () => {
  try {
    $showLoading()
    await useFetchCategories()
    await useFetchCharacteristic()
  } catch (err) {
    $setResponseErrors(err)
  } finally {
    $clearLoading()
  }
}

const useCreateOrUpdateCharacteristics = async (
  _: never,
  actions: ActionInterface
) => {
  const { $setFormErrors } = useFormActions(actions)
  try {
    loading.value = true
    const handledFormData = new FormData()
    handledFormData.append('name', formData.value.name as string)

    const allCategories = getCheckedNodes()
      .filter((item: Record<string, number>) => item.parent_id)
      .map((item: Record<string, number>) => item.id)
    allCategories.forEach((item: string, index: number) => {
      handledFormData.append(`categories[${index}][category_id]`, item)
    })

    const allValues = [
      formData.value.value as string,
      ...(formData.value.values as string[]),
    ]
    allValues.forEach((item: string, index: number) => {
      handledFormData.append(`values[${index}][value]`, item)
    })

    if (paramsId.value) {
      handledFormData.append('_method', 'PUT')
      await editCharacteristics(characteristicData.value.id, handledFormData)
    } else {
      await createCharacteristics(handledFormData)
    }

    await router.push($localePath('/cabinet/reference-characteristics'))
  } catch (err) {
    $setFormErrors(err)
    $setResponseErrors(err)
  } finally {
    loading.value = false
  }
}

useFetchData()

watch(
  () => characteristicData.value,
  (val) => {
    if (val?.id) {
      setCheckedKeys()
    }
  }
)
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
