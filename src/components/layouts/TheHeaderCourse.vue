<template>
  <div class="header__course">
    <div
      v-for="(course, index) in filteredCourses"
      :key="course.id || index"
      class="header__course__box"
      :class="{ white: white || theme === THEME.DARK }"
    >
      {{ course.symbol }} {{ $moneyFormat(course.amount) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserService, type CoursesInterface } from '@/plugins/user-service'
import { computed } from 'vue'
import { useThemeService } from '@/plugins/theme-service'
const { theme, THEME } = useThemeService()
defineProps({
  white: {
    type: Boolean,
  },
})

const { user } = useUserService()
const filteredCourses = computed(() => {
  const courses: CoursesInterface[] = user.value?.courses || []
  const allCourses = courses.filter((item) => item.key !== 'UZS')
  return allCourses.length
    ? allCourses
    : [
        {
          symbol: '$',
          amount: 0,
        },
        {
          symbol: '₽',
          amount: 0,
        },
      ]
})
</script>

<style lang="scss" scoped>
@import '../../assets/styles/layouts/the-header-course';
</style>
