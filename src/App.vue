<template>
  <div id="app">
    <pre>{{ $store.state.model | pretty }}</pre>

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
          disabled: false,
          type: 'input',
          label: 'Field-1'
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
          label: 'LBL1',
          fields: [{
            id: 'id1',
            type: 'input',
            model: 'b',
            dependsOn: ['id1'],
            watcher: function watchid1 () { console.log('notified', arguments) }
          }, {
            id: 'id2',
            model: 'c',
            type: 'checkbox',
            inputType: 'password',
            dependsOn: ['id1'],
            unknown: 'id',
            watcher: function watchid1 () { console.log('notified', arguments) }
          }]
        }]

      },
      schemaNamespace: 'formSchema',
      modelNamespace: 'model'
    },
    filters: {
      pretty: function (value) {
        return JSON.stringify(value, null, 2)
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
