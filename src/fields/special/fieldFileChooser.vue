<template>
  <div class="input-group wrapper" :class="inputClasses">
    <input class="form-control upload-filename" :value="fileName" disabled="disabled" type="text">
    <!-- don't give a name === doesn't send on POST/GET -->
    <span class="input-group-btn">

      <template v-if="file">
        <button type="button" @click="uploadFile" class="btn btn-default file-upload">
          <span class="fa fa-upload"></span> Upload
        </button>
        <button type="button" @click="file = null" class="btn btn-default file-clear">
          <span class="fa fa-times"></span> Clear
        </button>
      </template>
      <template v-else>
        <div class="btn btn-default file-input">
          <span class="fa fa-folder-open"></span>
          <span class="file-input-title">Browse</span>
          <input @change="file = $event.target.files[0]" :accept="this.$storeCtx.accept || ''" type="file">
        </div>
      </template>
    </span>
  </div>
</template>

<script>
  import AbstractFieldMixin from '../../mixin/abstract-field'

  export default {
    name: 'field-file-chooser',
    mixins: [AbstractFieldMixin],
    data () {
      return {
        file: null
      }
    },
    computed: {
      fileName () {
        if (this.file && this.file.name) {
          return this.file.name
        }
        return null
      }
    },
    methods: {
      uploadFile () {
        this.$storeCtx.dispatch({
          type: 'triggerOnchange',
          newVal: this.file,
          oldVal: this.file
        })
      }
    }
  }
</script>

<style scoped>

</style>
