<template>
  <div class="content-container cas_page_padding">
    <div v-if="title" class="header-title">
      <div>
        {{ props.title }}
      </div>
      <div>
        <slot name="header-right"></slot>
      </div>
    </div>
    <div class="content-body">
      <slot>
        <noData></noData>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import noData from '@/components/common/noData.vue';

const props = withDefaults(defineProps<{ title?: string }>(), {
  title: "",
});
</script>

<style lang="scss" scoped>
$color-primary: #2470ff;
.content-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  .content-body {
    flex: 1;
    // padding: 0 12px;
    height: calc(100% - 52px);
    position: relative;
  }
  .header-title {
    position: relative;
    // margin: 6px 0 !important;
    color: $color-primary;
    font-size: 16px;
    padding-left: 24px;
    line-height: 40px;
    z-index: 1;
    font-family: "微软雅黑 Bold", "微软雅黑", sans-serif;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &::before {
      content: "";
      display: inline-block;
      width: 330px;
      height: 40px;
      background: linear-gradient(to right, #ecf3ff, transparent);
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      z-index: -1;
    }

    &::after {
      content: "";
      display: inline-block;
      width: 8px;
      height: 24px;
      background-color: $color-primary;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}
</style>
