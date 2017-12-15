<template>
  <div id="app">
    <pre>{{ $store.state.model | pretty }}</pre>

    <VueFormBuilder :modelNamespace="'model'" :schemaNamespace="'formSchema'" :schema="schema"></VueFormBuilder>
  </div>
</template>

<script>
  import VueFormBuilder from './VueFormBuilder'
  import validator from './validator'
  export default {
    name: 'app',
    components: {
      'VueFormBuilder': VueFormBuilder
    },
    filters: {
      pretty: function (value) {
        return JSON.stringify(value, null, 2)
      }
    },
    data () {
      return {
        schema: {
          fields: [{
            id: 'id1',
            model: 'a',
            disabled: false,
            type: 'input',
            label: 'Field-1',
            placeholder: 'Input Field One',
            validator: [validator.required.locale({fieldIsRequired: 'Invalid Customer Name'})]
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
              dependsOn: ['grp1/id2'],
              watcher: function watchid1 () { console.log('notified grp1-id1', arguments) }
            }, {
              id: 'id2',
              model: 'c',
              items: function (modelCtx, schemaCtx, fieldCtx) {
                console.log('called', fieldCtx.getters['value'])
                let retVal
                if (fieldCtx.getters['value'] === 1) {
                  retVal = [{value: 1, label: 'item1', group: 'Grp1'}, 2]
                } else {
                  retVal = [{value: 1, label: 'item1', group: 'Grp1'}, 2, 3]
                }
                retVal = [{value: 1, label: 'item1', group: 'Grp1'}, 2, 3]
                return retVal
              },
              type: 'check-list',
              inputType: 'password',
              dependsOn: ['id1'],
              unknown: 'id',
              watcher: function watchid1 () { console.log('notified grp1-id2', arguments) }
            }]
          }]

        }
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
