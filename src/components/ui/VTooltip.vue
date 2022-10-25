<template>
  <div class="v-tooltip__container" v-bind="$attrs" ref="tooltipContainerRef">
    <div class="v-tooltip__box" ref="tooltipBoxRef">
      <slot />
    </div>
    <div
      class="v-tooltip__label"
      v-if="showTooltip"
      :class="classes"
      :style="styles"
      ref="tooltipContentRef"
    >
      <slot name="tooltip" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import type { PropType } from 'vue'

interface Tooltip {
  position?: 'left' | 'right' | 'top' | 'bottom'
  bgColor?: string
}

type TooltipKey = 'position' | 'bgColor'

const props = defineProps({
  tooltip: {
    type: Object as PropType<Tooltip>,
    default: (): Record<TooltipKey, string> => ({
      position: 'top',
      bgColor: '#333',
    }),
  },
})

const showTooltip = ref(true)
const tooltipContainerRef = ref(null)
const tooltipBoxRef = ref(null)
const tooltipContentRef = ref(null)

const styles = computed(() => ({
  '--bgColor': props.tooltip.bgColor || '#333',
}))

const classes = computed(() => {
  const className = 'v-tooltip__label'
  const classes: string[] = []
  if (props.tooltip.position === 'top') classes.push(`${className}--top`)
  if (props.tooltip.position === 'left') classes.push(`${className}--left`)
  if (props.tooltip.position === 'right') classes.push(`${className}--right`)
  if (props.tooltip.position === 'bottom') classes.push(`${className}--bottom`)
  if (!props.tooltip.position) classes.push(`${className}--top`)
  return classes
})

const detectUserDevice = () => {
  if (
    /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/gi.test(
      navigator.userAgent
    )
  ) {
    showTooltip.value = false
  }
}

// const changeClassName = () => {
//   const className = 'v-tooltip__label';
//   const tooltipContainer = tooltipContainerRef.value! as HTMLDivElement;
//   const tooltipContent = tooltipContentRef.value! as HTMLDivElement;
//   const tooltipBox = tooltipBoxRef.value! as HTMLDivElement;
//   const untilTooltipDistance = tooltipContainer.getBoundingClientRect().top;
//   const leftTooltipDistance = tooltipContainer.getBoundingClientRect().left;
//   const boxWidth = tooltipBox.getBoundingClientRect().width;
//   const tooltipHeight = tooltipContent.offsetHeight + 30;
//   const tooltipWidth = tooltipContent.offsetWidth;
//   if (props.tooltip.position === 'top' && tooltipHeight <= untilTooltipDistance && tooltipContent.className.includes(`${className}--bottom`)) {
//     tooltipContent.classList.remove(`${className}--bottom`);
//     tooltipContent.classList.add(`${className}--top`);
//   }
//   if (props.tooltip.position === 'top' && tooltipHeight > untilTooltipDistance && tooltipContent.className.includes(`${className}--top`)) {
//     tooltipContent.classList.remove(`${className}--top`);
//     tooltipContent.classList.add(`${className}--bottom`);
//   }
//   if (props.tooltip.position === 'left' && tooltipWidth <= leftTooltipDistance && tooltipContent.className.includes(`${className}--right`)) {
//     tooltipContent.classList.remove(`${className}--right`);
//     tooltipContent.classList.add(`${className}--left`);
//   }
//   if (props.tooltip.position === 'left' && tooltipWidth > leftTooltipDistance && tooltipContent.className.includes(`${className}--left`)) {
//     tooltipContent.classList.remove(`${className}--left`);
//     tooltipContent.classList.add(`${className}--right`);
//   }
//   tooltipContent.style.cssText = `--tooltipContentWidth: ${boxWidth + 20}px; --bgColor: ${props.tooltip.bgColor ? props.tooltip.bgColor : '#333'}`;
// };

// window.addEventListener('scroll', changeClassName);
//
// onUnmounted(() => {
//   window.removeEventListener('scroll', changeClassName);
// });

onMounted(() => {
  // changeClassName();
  detectUserDevice()
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-tooltip';
</style>
