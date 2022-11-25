import { defineRule, configure } from 'vee-validate'
import {
  required,
  email,
  min,
  max,
  size,
  length,
  confirmed,
  min_value,
  max_value,
} from '@vee-validate/rules'
import { $translate } from '@/plugins/i18n'

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('max', max)
defineRule('size', size)
defineRule('confirmed', confirmed)
defineRule('length', length)
defineRule('min_value', min_value)
defineRule('max_value', max_value)
defineRule('phone', (value: string) => {
  return value.length >= 13
})
defineRule('passport', (value: string) => {
  const passport = /A([AB])\d{7}/gi
  return passport.test(value)
})
// Write custom rules here
// Custom rule lar shu yerga yozilsin

configure({
  generateMessage: ({ field, rule }) => {
    const ruleName = rule?.name || ''
    const params: { [index: string]: any } = rule?.params || []
    return $translate(`validation.${ruleName}`, {
      field,
      params: params[0],
      max: params[0],
      max_value: params[0],
    })
  },
})
