<template>
  <div class="input-group wrapper" :class="fieldClasses">
    <input class="form-control upload-filename" :value="file" disabled="disabled" type="text">
    <!-- don't give a name === doesn't send on POST/GET -->
    <span class="input-group-btn">

      <template v-if="file">
        <button type="button" @click="uploadFile" class="btn btn-default file-upload" style="display:none;">
          <span class="fa fa-upload"></span> Upload
        </button>
        <button type="button" class="btn btn-default file-clear" style="display:none;">
          <span class="fa fa-times"></span> Clear
       </button>
      </template>
      <template v-else>
        <div  class="btn btn-default file-input">
          <span class="fa fa-folder-open"></span>
          <span class="file-input-title">Browse</span>
          <input :accept="this.$storeCtx.accept || ''" type="file">
        </div>
      </template>
    </span>
  </div>
</template>

<script>
  export default {
    name: 'field-file-chooser',
    data () {
      return {
        file: ''
      }
    },
    methods: {
      uploadFile () {
        this.value = this.file
      }
    }
  }
</script>

<style scoped>

</style>
