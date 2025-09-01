<template>
  <a-spin :spinning="loading" tip="页面加载中...">
    <micro-app ref="microAppRef" v-bind="$attrs"></micro-app>
  </a-spin>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const loading = ref(true)
const microAppRef = ref()

function microAppMounted() {
  loading.value = false
}
onMounted(() => {
  microAppRef.value.$el.onload = microAppMounted
})
</script>

<style lang="scss" scoped>
iframe {
  width: 100%;
  height: 100%;
}
.ant-spin-nested-loading {
  height: 100%;
  width: 100%;
  :deep(.ant-spin-spinning) {
    top: 200px;
  }
  :deep(.ant-spin-container) {
    height: 100%;
    width: 100%;
  }
}
</style>
