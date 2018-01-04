<template>
  <div id="app" class="container-fluid">
    <pre>{{ $store.state.model | pretty }}</pre>

    <VueFormBuilder :modelNamespace="'model'" :schemaNamespace="'formSchema'" :schema="schema">

    </VueFormBuilder>
  </div>
</template>

<script>
  // import VueFormBuilder from './VueFormBuilder'
  import VueFormBuilder from './VueFormBuilder'
  import fieldWrapper from './fields/fieldWrapper'
  import validator from './validator'

  export default {
    name: 'app',
    components: {
      'VueFormBuilder': VueFormBuilder,
      'fieldWrapper': fieldWrapper
    },
    filters: {
      pretty: function (value) {
        return JSON.stringify(value, null, 2)
      }
    },
    data () {
      return {
        schema: {
          validateOnLoad: true,
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
              rowClasses: 'col-md-12 edit-row',
              inputGroupClasses: ['input-group'],
              type: 'input-dropdown',
              inputType: 'text',
              dependsOn: ['id1'],
              watcher (modelCtx, storeCtx, fieldCtx) {
                console.log('watcher')
              },
              buttons: [{
                onClick: function (modelCtx, storeCtx, fieldCtx) {
                  this.hide = !this.hide
                  console.log(this.hide, 'hide')
                  if (this.hide) {
                    storeCtx.dispatch({
                      type: 'id1/hide'
                    })
                  } else {
                    storeCtx.dispatch({
                      type: 'id1/show'
                    })
                  }
                },
                classes: 'btn-default',
                html: '<span class="glyphicon glyphicon-search" aria-hidden="true"></span>'
              }]
            }, {
              id: 'id1',
              type: 'empty',
              model: 'b'
              // dependsOn: ['grp1/id2'],
              // watcher: function watchid1 () { console.log('notified grp1-id1', arguments) }
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
