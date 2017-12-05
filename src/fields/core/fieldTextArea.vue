<template>
  <textarea v-model="value"
            :id="$storeCtx.state.id"
            :class="$storeCtx.state.fieldClasses"
            :disabled="disabled"
            :maxlength="$storeCtx.state.max"
            :minlength="$storeCtx.state.min"
            :placeholder="$storeCtx.state.placeholder"
            :readonly="$storeCtx.state.readonly"
            :rows="$storeCtx.state.rows || 2"
            :name="$storeCtx.state.inputName" class="form-control"></textarea>
</template>

<script>
  import AbstractFieldMixin from '@/mixin/abstract-field'

  export default {
    name: 'field-text-area',
    mixins: [AbstractFieldMixin]
  }
</script>

<style scoped>

</style>
