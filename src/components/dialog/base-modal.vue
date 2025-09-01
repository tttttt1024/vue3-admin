
<template>
  <a-modal
    centered
    :mask-closable="false"
    :closable="false"
    class="common-modal"
    :body-style="{
      'max-height': 'calc(90vh - 40px)',
      overflow: 'auto',
      padding: '16px',
    }"
  >
    <template #title>
      <div class="title" style="background: #2470ff">
        <div>{{ title }}</div>
        <div class="icon" @click="emits('close')">
          <CloseOutlined />
        </div>
      </div>
    </template>

    <template v-for="(_, name) in $slots" #[name]="slotProps">
      <slot v-if="$slots[name]" :name="name" v-bind="slotProps"></slot>
    </template>
  </a-modal>
</template>
<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
});

const emits = defineEmits(["close"]);
</script>
<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;

  .icon {
    padding: 10px;
    margin-right: -14px;
    font-size: 18px;
    opacity: 0.8;

    &:hover {
      cursor: pointer;
      opacity: 1;
    }
  }
}
</style>
<style lang="scss">
.common-modal {
  .ant-modal-content {
    padding: 0;
    .ant-modal-title {
      padding: 0 !important;
      width: 100%;
      .title {
        display: flex;
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    .ant-modal-body {
      background-color: #fff !important;
      &::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      // 轨道
      &::-webkit-scrollbar-track {
        width: 6px;
        background: rgba(144, 147, 153, 0);
        border-radius: 3px;
      }

      // 滑条
      &::-webkit-scrollbar-thumb {
        min-height: 20px;
        cursor: pointer;
        background: rgba(144, 147, 153, 0.5);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: rgba(144, 147, 153, 0.5);
      }
    }

    .ant-modal-footer {
      padding-bottom: 10px;
      text-align: center;
      border-top: none !important;
    }
  }
}
</style>
