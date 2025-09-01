<template>
  <div class="wzx-header-layout-container">
    <div class="flex flex_item_mid">
      <slot name="header">
        <img class="header-icon" src="@/assets/image/u61.svg" alt="" />
        <p class="header-title">{{ props.title }}</p>
      </slot>
    </div>
    <div class="flex flex_item_mid">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ title?: string }>(), {
  title: "",
});
</script>

<style lang="scss" scoped>
.wzx-header-layout-container {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .header-icon {
    width: 28px;
    height: 10px;
    transform: rotate(90deg);
  }

  .header-title {
    font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 22px;
    color: $--cas-color1;
    margin-left: 12px;
  }
}
</style>
