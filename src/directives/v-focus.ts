export const focus = {
  mounted: (el: HTMLElement, binding: { value: boolean }) => {
    if (binding.value) el.focus()
  },
}
