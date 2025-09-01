<template>
  <!-- <stepList orderId='1689166143399837698' id="StepList"></stepList> -->
  <div class="flow-container shadow-content" :style="{ height: bodyHeight + 'px' }">
    <stepItem
      v-show="props.flowDataList.length > 0 && !isFoldStepList"
      :flowDataList="props.flowDataList"
      :current="props.current"
      @handleClickStep="handleClickStep"
    >
    </stepItem>
  </div>
  <div class="flow-fold" @click="toggle" v-show="isShowFold">
    <div class="fold-btn" v-show="!isFoldStepList"><UpOutlined /></div>
    <div class="fold-btn" v-show="isFoldStepList"><DownOutlined /></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, defineEmits } from 'vue'
import stepItem from '@/components/stepList/stepItem.vue'
const props = defineProps(['flowDataList', 'current'])

const emit = defineEmits(['handleClick', 'getToggle'])

let isFoldStepList = ref<boolean>(false)
let isShowFold = ref<boolean>(true)
const toggle = () => {
  isFoldStepList.value = !isFoldStepList.value
  sessionStorage.setItem('toggle', isFoldStepList.value.toString())
  emit('getToggle', isFoldStepList.value)
}

const handleClickStep = (index) => {
  emit('handleClick', index)
}
const bodyHeight = computed(() => {
  const h = isFoldStepList.value ? 10 : 68
  return h
})
</script>
<style lang="scss" scoped>
.flow-container {
  transition: height 0.15s ease-in-out;
}

.flow-fold {
  width: 100%;
  height: 10px;
  position: relative;
  color: #333;
  cursor: pointer;
  border-radius: 5px;

  &::after,
  .fold-btn {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  &::after {
    content: '';
    top: -1px;
    width: 60px;
    height: 20px;
    border-radius: 3px;
    transform: translate(-50%, -51%);
    background-color: #ffffff;
    box-shadow: 0px 6px 5px -3px rgba(127, 127, 127, 0.35);
  }

  .fold-btn {
    top: -9px;
    z-index: 1;
    font-size: 18px;
    font-weight: bold;
  }
}
</style>
