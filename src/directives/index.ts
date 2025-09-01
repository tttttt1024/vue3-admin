import { Directive } from 'vue'

export const height: Directive = (el, bind) => {
  let value = bind.value
  let height = value === 0 || value ? `calc(${bind.arg || '100%'} - ${value}px)` : bind.arg
  el.style.height = height
}

export const width: Directive = (el, bind) => {
  let value = bind.value
  let width = value === 0 || value ? `calc(${bind.arg || '100%'} - ${value}px)` : bind.arg
  el.style.width = width
}
