<template>
  <span :id="$storeCtx.state.id" :class="$storeCtx.state.fieldClasses">{{ value }}</span>
</template>

<script>
  import AbstractFieldMixin from '@/mixin/abstract-field'

  export default {
    name: 'field-label',
    mixins: [AbstractFieldMixin]
  }
</script>

<style scoped>

</style>
