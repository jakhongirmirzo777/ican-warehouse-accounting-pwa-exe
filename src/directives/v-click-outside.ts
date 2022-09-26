interface BindingInterface {
  value: (_event: { event: Event; el: ElementInterface }) => unknown
}

interface ElementInterface extends HTMLElement {
  clickOutsideEvent: () => unknown
}

const clickOutsideHandler =
  (el: ElementInterface, binding?: BindingInterface) => (event: Event) => {
    if (!(el === event.target || el.contains(event.target as Node))) {
      binding?.value({ event, el })
    }
  }

export const clickOutside = {
  mounted(el: ElementInterface, binding: BindingInterface) {
    document.body.addEventListener('click', clickOutsideHandler(el, binding))
  },
  unmounted(el: ElementInterface) {
    document.body.removeEventListener('click', clickOutsideHandler(el))
  },
}
