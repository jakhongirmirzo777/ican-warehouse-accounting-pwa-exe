<template>
  <img
    ref="imageRef"
    v-bind="$attrs"
    class="v-img"
    :class="{ loaded: imageLoaded }"
    :src="placeholderSrc"
    :alt="alt"
    :data-src="src"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    default: 'image',
  },
  placeholder: {
    type: String,
    default: 'placeholder.png',
  },
  static: {
    type: Boolean,
    default: false,
  },
})

const imageLoaded = ref(false)
const imageRef = ref<HTMLImageElement | null>(null)
const placeholderSrc = new URL(
  `../../assets/images/${props.placeholder}`,
  import.meta.url
).href

const io = new IntersectionObserver((entries: any) => {
  entries.forEach((entry: any) => {
    // set image source only when it is in the viewport
    if (entry.isIntersecting) {
      const image = entry.target as HTMLImageElement
      const imageSrc = !props.static
        ? image.dataset.src
        : new URL(`../../assets/images/${props.src}`, import.meta.url).href
      checkImage(imageSrc || '', image)
      // when image is loaded, we do not need to observe it anymore
      io.unobserve(image)
    }
  })
})

const checkImage = (URL: string, imageElement: HTMLImageElement) => {
  const image = new Image()
  image.onload = onLoadImage.bind(null, imageElement, URL)
  image.src = URL
  imageLoaded.value = true
}

const onLoadImage = (imageElement: HTMLImageElement, url: string) => {
  imageElement.src = url || ''
}

onMounted(() => {
  if (imageRef.value) io.observe(imageRef.value as Element)
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/ui/v-img';
</style>
