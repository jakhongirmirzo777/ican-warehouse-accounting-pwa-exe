export interface FormState {
  // any error messages
  errors: Record<string, string>
  // touched meta flags
  touched: Record<string, boolean>
  // Form Values
  values: Record<string, any>
  // The form submit attempts count
  submitCount: number
}

export interface ActionInterface {
  // eslint-disable-next-line no-unused-vars
  setErrors: (fields: Record<string, string | string[]>) => void
  // eslint-disable-next-line no-unused-vars
  resetForm: (state?: Partial<FormState>) => void
}
