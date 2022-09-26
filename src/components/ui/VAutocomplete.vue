<!--<template>-->
<!--  <Field-->
<!--    validate-on-input-->
<!--    :model-value="modelValue"-->
<!--    :name="vid || name || label"-->
<!--    :label="name || label"-->
<!--    :rules="rules"-->
<!--    v-slot="{ errors, validate, meta, setTouched }"-->
<!--  >-->
<!--    <div-->
<!--      class="v-autocomplete"-->
<!--      :class="$attrs.class"-->
<!--      v-click-outside="clickedOutside(validate, meta)"-->
<!--    >-->
<!--      <div-->
<!--        class="v-autocomplete__box"-->
<!--        :class="{ 'hidden-details': hideDetails }"-->
<!--      >-->
<!--        <div-->
<!--          class="d-flex align-center v-autocomplete__text-input"-->
<!--          @click="inOpen"-->
<!--          :class="[style]"-->
<!--        >-->
<!--          <div class="v-autocomplete__text-input__main-text">-->
<!--            <template v-if="multiple">-->
<!--              <div-->
<!--                class="d-flex align-center v-autocomplete__text-input__selected-text"-->
<!--                v-for="(item, i) in multipleShowClient"-->
<!--                :key="`key-${i}`"-->
<!--              >-->
<!--                {{ item[itemText] }}-->
<!--                <span-->
<!--                  @click="deleteItemSelected(i)"-->
<!--                  class="v-autocomplete__text-input__selected-text__delete d-flex align-center justify-center"-->
<!--                >-->
<!--                  <VIcon icon="x-mark" color="#868EAA" size="16" />-->
<!--                </span>-->
<!--              </div>-->
<!--            </template>-->

<!--            <input-->
<!--              ref="autocompleteRef"-->
<!--              v-show="isShow"-->
<!--              type="text"-->
<!--              @keydown.down="keydownSelect"-->
<!--              @keydown.up="keydownSelect"-->
<!--              @keyup.enter="keyupSelect"-->
<!--              @input="searchList"-->
<!--              @focus="isOpen = true"-->
<!--              @blur="setTouched(true)"-->
<!--              :value="search"-->
<!--              :readonly="!autocomplete"-->
<!--              class="v-autocomplete__text-input__input"-->
<!--              :class="[-->
<!--                inputClasses,-->
<!--                {-->
<!--                  'v-autocomplete__text-input__input-is-multiple':-->
<!--                    !isMultipleShow,-->
<!--                },-->
<!--              ]"-->
<!--            />-->
<!--            <span-->
<!--              class="v-autocomplete__label"-->
<!--              :class="{-->
<!--                error: errors && errors[0],-->
<!--                has__value: !!modelValue,-->
<!--              }"-->
<!--            >-->
<!--              {{ label }}-->
<!--            </span>-->
<!--          </div>-->
<!--          <div class="v-autocomplete__text-input__append-icons d-flex">-->
<!--            <span-->
<!--              @click="clearInputValue"-->
<!--              v-if="clearable && modelValue"-->
<!--              class="v-autocomplete__text-input__selected-text__delete d-flex align-center justify-center"-->
<!--            >-->
<!--              <VIcon icon="x-mark" color="#868EAA" size="16" />-->
<!--            </span>-->
<!--            <span-->
<!--              :class="[-->
<!--                { 'v-autocomplete__text-input__rotate-start': isOpen },-->
<!--                'v-autocomplete__text-input__rotate-icon',-->
<!--              ]"-->
<!--            >-->
<!--              <VIcon icon="triangle" color="#868EAA" size="8" />-->
<!--            </span>-->
<!--          </div>-->
<!--        </div>-->
<!--        <VTransition>-->
<!--          <div-->
<!--            class="v-autocomplete__error-message"-->
<!--            v-if="!hideDetails && errors && errors[0]"-->
<!--          >-->
<!--            <span>{{ errors[0] }}</span>-->
<!--          </div>-->
<!--        </VTransition>-->
<!--      </div>-->
<!--      <VTransition>-->
<!--        <div-->
<!--          v-if="isOpen"-->
<!--          :class="[-->
<!--            {-->
<!--              'v-autocomplete__list-has-no-error':-->
<!--                errors && !errors[0] && !hideDetails,-->
<!--            },-->
<!--            'v-autocomplete__list',-->
<!--          ]"-->
<!--          ref="autocompleteListRef"-->
<!--          @scroll="scrollEvent"-->
<!--        >-->
<!--          <template v-if="selectList.length">-->
<!--            <div-->
<!--              v-for="(item, i) in selectList"-->
<!--              :key="item[itemValue] || i"-->
<!--              @click="selectItem(item, i)"-->
<!--              :class="{ 'v-autocomplete__list__hover-effect': i === isKeyUp }"-->
<!--              class="v-autocomplete__list__item"-->
<!--            >-->
<!--              <input-->
<!--                :ref="`inputRef_${i}`"-->
<!--                v-if="multiple"-->
<!--                v-model="multipleSelectItem"-->
<!--                :value="item[itemValue]"-->
<!--                type="checkbox"-->
<!--                class="v-autocomplete__list__item__checkbox"-->
<!--              />-->
<!--              {{ item[itemText] }}-->
<!--            </div>-->
<!--            <div v-if="bodyLoading">-->
<!--              <VLoadingMini />-->
<!--            </div>-->
<!--          </template>-->
<!--          <div v-else class="v-autocomplete__list__no-data-text">No data</div>-->
<!--        </div>-->
<!--      </VTransition>-->
<!--    </div>-->
<!--  </Field>-->
<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import { computed, ref, watch } from 'vue'-->
<!--import VTransition from '@/components/ui/VTransition.vue'-->
<!--import VLoadingMini from '@/components/ui/VLoadingMini.vue'-->
<!--import VIcon from '@/components/ui/VIcon.vue'-->

<!--const props = defineProps({-->
<!--  items: {-->
<!--    type: Array,-->
<!--    default: () => [],-->
<!--  },-->
<!--  itemValue: {-->
<!--    type: String,-->
<!--    default: 'id',-->
<!--  },-->
<!--  itemText: {-->
<!--    type: String,-->
<!--    default: 'name',-->
<!--  },-->
<!--  modelValue: {-->
<!--    type: [Array, String, Number],-->
<!--    default: '',-->
<!--  },-->
<!--  multiple: {-->
<!--    type: Boolean,-->
<!--    default: false,-->
<!--  },-->
<!--  autocomplete: {-->
<!--    type: Boolean,-->
<!--    default: false,-->
<!--  },-->
<!--  clearable: {-->
<!--    type: Boolean,-->
<!--    default: false,-->
<!--  },-->
<!--  hideDetails: {-->
<!--    type: Boolean,-->
<!--    default: false,-->
<!--  },-->
<!--  bodyLoading: {-->
<!--    type: Boolean,-->
<!--    default: false,-->
<!--  },-->
<!--  vid: {-->
<!--    type: String,-->
<!--    default: '',-->
<!--  },-->
<!--  name: {-->
<!--    type: String,-->
<!--    default: '',-->
<!--  },-->
<!--  rules: {-->
<!--    type: [String, Object],-->
<!--    default: '',-->
<!--  },-->
<!--  label: {-->
<!--    type: String,-->
<!--    required: true,-->
<!--  },-->
<!--})-->

<!--const search: any = ref(null)-->
<!--const isOpen = ref(false)-->
<!--const isKeyUp = ref()-->
<!--const autocompleteListRef = ref()-->
<!--const autocompleteRef = ref()-->
<!--const multipleSelectItem = ref<string[]>([])-->
<!--const multipleShowClient = ref([]) as any-->

<!--const emits = defineEmits(['update:modelValue', 'is-bottom'])-->

<!--const isShow = computed(() => {-->
<!--  return !(!props.autocomplete && multipleShowClient.value.length)-->
<!--})-->

<!--const isMultipleShow = computed(-->
<!--  () => !!(props.autocomplete && multipleShowClient.value.length)-->
<!--)-->

<!--const selectList = computed(() => {-->
<!--  const list = [...props.items]-->
<!--  if (search.value && props.autocomplete) {-->
<!--    return list.filter((item: any) => {-->
<!--      return item[props.itemText]-->
<!--        .toLowerCase()-->
<!--        .includes(search.value.toLowerCase().trim())-->
<!--    })-->
<!--  } else {-->
<!--    return list-->
<!--  }-->
<!--})-->

<!--const style = computed(() => {-->
<!--  return {-->
<!--    'v-autocomplete__text-input-multiple': props.multiple,-->
<!--  }-->
<!--})-->

<!--const inputClasses = computed(() => {-->
<!--  return {-->
<!--    'v-autocomplete__text-input__input-multiple': props.multiple,-->
<!--  }-->
<!--})-->

<!--watch(isOpen, (val) => {-->
<!--  if (!val) {-->
<!--    isKeyUp.value = ''-->
<!--  }-->
<!--})-->

<!--const clickedOutside = (-->
<!--  validate: () => unknown,-->
<!--  meta: { touched: boolean }-->
<!--) => {-->
<!--  return () => {-->
<!--    if (meta.touched) validate()-->
<!--    isOpen.value = false-->
<!--  }-->
<!--}-->

<!--const scrollEvent = (val: Event): void => {-->
<!--  const target = val.target as HTMLDivElement-->
<!--  if (target.scrollHeight - target.scrollTop < target.offsetHeight) {-->
<!--    emits('is-bottom')-->
<!--  }-->
<!--}-->

<!--const selectItem = (val: any, i?: number) => {-->
<!--  if (!props.multiple) {-->
<!--    emits('update:modelValue', val[props.itemValue])-->
<!--    isOpen.value = false-->
<!--    search.value = val[props.itemText]-->
<!--  } else {-->
<!--    if (i || i === 0) {-->
<!--      const isHave = multipleSelectItem.value.indexOf(val[props.itemValue])-->
<!--      if (isHave < 0) {-->
<!--        multipleSelectItem.value.push(val[props.itemValue])-->
<!--        multipleShowClient.value.push(val)-->
<!--      } else {-->
<!--        multipleSelectItem.value.splice(isHave, 1)-->
<!--        multipleShowClient.value.splice(isHave, 1)-->
<!--      }-->
<!--      emits('update:modelValue', multipleSelectItem.value)-->
<!--    }-->
<!--  }-->
<!--}-->

<!--const deleteItemSelected = (i: number) => {-->
<!--  multipleSelectItem.value.splice(i, 1)-->
<!--  multipleShowClient.value.splice(i, 1)-->
<!--}-->

<!--const searchList = (event: Event) => {-->
<!--  const target = event.target as HTMLTextAreaElement-->
<!--  search.value = target.value-->
<!--}-->

<!--const clearInputValue = () => {-->
<!--  if (props.multiple) {-->
<!--    emits('update:modelValue', [])-->
<!--    multipleSelectItem.value = []-->
<!--    multipleShowClient.value = []-->
<!--  } else {-->
<!--    emits('update:modelValue', null)-->
<!--    search.value = null-->
<!--  }-->
<!--}-->

<!--const inOpen = () => {-->
<!--  if (!isShow.value) {-->
<!--    isOpen.value = true-->
<!--  }-->
<!--}-->

<!--const keyupSelect = () => {-->
<!--  autocompleteRef.value.blur()-->
<!--  selectItem(selectList.value[isKeyUp.value], isKeyUp.value)-->
<!--}-->

<!--const keydownSelect = (event: KeyboardEvent) => {-->
<!--  if (selectList?.value.length) {-->
<!--    if (event.code === 'ArrowDown') {-->
<!--      if (selectList?.value.length - 1 > isKeyUp.value) {-->
<!--        isKeyUp.value++-->
<!--      } else {-->
<!--        isKeyUp.value = 0-->
<!--      }-->
<!--    } else if (event.code === 'ArrowUp') {-->
<!--      if (isKeyUp.value === 0) {-->
<!--        isKeyUp.value = selectList?.value.length - 1-->
<!--      } else if (isKeyUp.value > 0) {-->
<!--        isKeyUp.value&#45;&#45;-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="scss" scoped>-->
<!--@import '../../assets/styles/ui/v-autocomplete';-->
<!--</style>-->
