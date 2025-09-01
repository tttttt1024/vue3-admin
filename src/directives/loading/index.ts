import { createApp } from 'vue'

const relativeClass = 'loading-relative'
import { Spin as Loading } from "ant-design-vue"

export default {
  name: 'myLoading',
  mounted(el, binding) {
    const tip = el.getAttribute("loading-text") ?? '加载中...'
    const app = createApp(Loading, {
      tip
    })
    const instance = app.mount(document.createElement('div'))
    const name = Loading.name
    if (!el[name]) {
      el[name] = {}
    }
    el[name].instance = instance
    if (binding.value) {
      append(el)
    }
  },
  updated(el, binding) {
    const name = Loading.name
    if (!el[name]) {
      el[name] = {}
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  },
}
function append(el) {
  // const style = getComputedStyle(el)
  const name = Loading.name
  el.classList.add(relativeClass)

  el.appendChild(el[name].instance.$el)
}
function remove(el) {
  const name = Loading.name
  el.classList.remove(relativeClass)
  el.removeChild(el[name].instance.$el)
}