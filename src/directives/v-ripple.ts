const clickHandler = (event: any) => {
  const button = event.currentTarget
  const circle = document.createElement('span')
  const diameter = Math.max(button.clientWidth, button.clientHeight)
  const radius = diameter / 2
  circle.style.width = circle.style.height = `${diameter}px`
  circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`
  circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`
  circle.classList.add('ripple')
  const ripple = button.getElementsByClassName('ripple')[0]
  if (ripple) ripple.remove()
  button.appendChild(circle)
}

export const ripple = {
  mounted(el: HTMLElement) {
    el.style.position = 'relative'
    el.style.overflow = 'hidden'
    el.style.transition = 'all 0.3s'
    el.style.cursor = 'pointer'

    el.addEventListener('click', clickHandler)
  },
  unmounted(el: HTMLElement) {
    el.removeEventListener('click', clickHandler)
  },
}
