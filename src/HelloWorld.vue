<template>
  <div class="hello">
    <h1>{{ msg }} {{getHi()}} {{ $store.state.model}} </h1>
  </div>
</template>

<script>
  import storeMixIn from './mixin/store-namespace'

  export default {
    name: 'HelloWorld',
    mixins: [storeMixIn],
    data () {
      return {
        msg: 'App'
      }
    },
    beforeMount: function () {
      console.log(this.$storeCtx, 'beforeMount')
    },
    methods: {
      getHi: function () {
        return 'hi'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
