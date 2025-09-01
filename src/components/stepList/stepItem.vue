<template>
  <div class="container">
    <a-steps :current="props.current" label-placement="vertical" @change="handleClickStep">
      <a-step v-for="(e, i) in props.flowDataList" :key="i" :status="e.status == 3 ? 'error' : ''">
        <template #title>
          <div>{{ e.executePersonName }}</div>
        </template>
        <template #subTitle
          ><div>{{ e.stepName }}</div>
        </template>
        <template #description>
          <div>{{ e.completeTime }}</div>
        </template>
      </a-step>
    </a-steps>
  </div>

  <!-- </div> -->
</template>

<script lang="ts" setup>
import { onMounted, ref, defineEmits } from 'vue'
const props = defineProps(['flowDataList', 'current'])
const emit = defineEmits(['handleClickStep'])
const handleClickStep = (index) => {
  emit('handleClickStep', index)
}
onMounted(() => {
  console.log(props.flowDataList, 'props.flowDataList')
})
</script>
<style lang="scss" scoped>
:deep(.ant-steps-item) {
  min-width: 270px;
}
:deep(.ant-steps-item):nth-child(2) {
  .ant-steps-item-content {
    //  margin-left: -20px;
  }
}
:deep(.ant-steps-item-title) {
  line-height: 15px;
}
:deep(.ant-steps-item-description) {
  div {
    min-width: 180px;
  }
}
:deep(.ant-steps-item-title) {
  // width: 180px !important;
  white-space: nowrap;
}

.container {
  overflow: auto;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 10px;
}
</style>
