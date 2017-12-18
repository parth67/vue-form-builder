import component from './VueFormBuilder'
import fieldWrapper from './fields/fieldWrapper'
export { default as VueFormBuilderSlotted } from './VueFormBuilderSlotted'
export { default as fieldWrapper } from './fields/fieldWrapper'
export { default as abstractField } from './mixin/abstract-field'
export { default as validators } from './validator'

const VueFormBuilder = component

export default VueFormBuilder

export function addField (name, def) {
  fieldWrapper.components['field-' + name] = def
}
