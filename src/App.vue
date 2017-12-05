<template>
  <div id="app">
    <router-view/>
    <VueFormBuilder></VueFormBuilder>
  </div>
</template>

<script>
  import VueFormBuilder from './VueFormBuilder'

  export default {
    name: 'app',
    components: {
      'VueFormBuilder': VueFormBuilder
    },
    provide: {
      schema: {
        fields: [{
          id: 'id1',
          model: 'a',
          disabled: false
          // formatValueToField: (value) => {
          //   if (value) {
          //     return (value + '').replace(' VAL', '')
          //   } else {
          //     return value
          //   }
          //
          // },
          // formatValueToModel: (value) => {
          //   return value + ' VAL'
          // }
        }],
        groups: [{
          id: 'grp1',
          fields: [{
            id: 'id1',
            model: 'a',
            dependsOn: ['id1'],
            watcher: function watchid1 () { console.log('notified', arguments) }
          }, {
            id: 'id2',
            model: 'a',
            dependsOn: ['id1'],
            unknown: 'id',
            watcher: function watchid1 () { console.log('notified', arguments) }
          }]
        }]

      },
      schemaNamespace: 'formSchema',
      modelNamespace: 'model'
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
