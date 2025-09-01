<template>
  <div class="step-page-box" :class="`${isShadow ? 'shadow-content' : ''}`">
    <div>
      <a-steps :current="current" @change="stepsChange">
        <template #progressDot="{ index, status }">
          <div class="step-dot" :class="getCurrentClass(status)">
            {{ index + 1 }}
          </div>
        </template>
        <a-step v-for="(item, index) in stepList" :key="index">
          <template #title>
            <p class="step-title">{{ item.title }}</p>
          </template>
        </a-step>
      </a-steps>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    stepList: Array<any>
    current: number
    isShadow: boolean
  }>(),
  {
    isShadow: true,
  }
)
const getCurrentClass = (status: string): string => {
  let className = 'other-dot'
  if (status === 'wait') {
    className = 'wait-dot'
  }
  return className
}
const stepsChange = (current: number): void => {
  upFei(current)
}
const emits = defineEmits(['currentChange'])
const upFei = (val: number) => {
  emits('currentChange', val)
}
</script>

<style scoped lang="scss">
.step-page-box {
  height: 66px;
  padding-top: 10px;
  background-color: #fff;

  &:deep(.ant-steps-dot .ant-steps-item-tail),
  &:deep(.ant-steps-dot.ant-steps-small .ant-steps-item-tail) {
    &::after {
      width: calc(100% - 26px);
      height: 3px;
      margin-left: 26px;
      margin-top: 12px;
    }
  }

  &:deep(.ant-steps-label-vertical .ant-steps-item-content) {
    margin-top: 20px;
    margin-left: 12px;
  }

  &:deep(.ant-steps-item-active) {
    .ant-steps-item-icon {
      margin-bottom: 0;
    }
  }

  &:deep(.ant-steps-item-icon) {
    margin-bottom: 2px;
  }

  .step-title {
    font-weight: 700;
    font-size: 14px;
  }
}

.step-dot {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 100%;
  font-size: 13px;
}

.other-dot {
  background-color: #1890ff;
  color: #fff;
}

.wait-dot {
  border: 2px solid #ccc;
}
</style>
