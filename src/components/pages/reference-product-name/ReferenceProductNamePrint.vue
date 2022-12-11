<template>
  <div class="print"></div>
</template>

<style lang="scss" scoped>
.print {
  visibility: hidden;
}

@media only print {
  .print {
    visibility: visible;
  }
}
</style>
