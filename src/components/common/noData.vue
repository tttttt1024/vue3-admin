<template>
  <div class="noData">
    <img src="@/assets/image/common/noData.png" alt="">
    <span class="text">暂无数据</span>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped lang="scss">
.noData {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 1;
  text-align: center;

  img {
    object-fit: contain;
    height: 100%;
  }

  .text {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    color: #2470FF;
    font-size: 32px;
    font-weight: bold;
  }
}
</style>