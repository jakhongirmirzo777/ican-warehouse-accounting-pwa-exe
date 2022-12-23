<template>
  <div class="header__course">
    <div
      v-for="(course, index) in filteredCourses"
      :key="course.id || index"
      class="header__course__box"
      :class="{ white: white }"
    >
      {{ course.symbol }} {{ course.amount }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserService, type CoursesInterface } from '@/plugins/user-service'
import { computed } from 'vue'

defineProps({
  white: {
    type: Boolean,
  },
})

const { user } = useUserService()
const filteredCourses = computed(() => {
  const courses: CoursesInterface[] = user.value?.courses || []
  return courses.filter((item) => item.key !== 'UZS')
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-header-course';
</style>
