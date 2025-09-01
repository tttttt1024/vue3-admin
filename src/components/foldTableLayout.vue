<template>
  <div :id="id" class="common-content-wrap">
    <div class="content-title flex">
      <div class="header-left">
        <slot name="title">
          <div :style="titleStyle">{{ title }}</div>
        </slot>
        <div class="left-tip">
          <slot name="left"></slot>
        </div>
      </div>
      <div class="header-right f-r">
        <slot name="headerRight"></slot>
        <em
          v-if="showFold"
          :class="isFold ? 'reverse' : 'above'"
          @click="arrowClick()"
        ></em>
      </div>
    </div>
    <transition name="fade">
      <div class="content-body" v-show="!isFold">
        <slot> <a-empty /> </slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const isFold = ref(false);

const props = withDefaults(
  defineProps<{
    id?: string;
    title?: string;
    titleStyle?: string;
    showFold?: boolean;
    doLayout?: Function;
  }>(),
  {
    id: "CommonContentWrap",
    title: "",
    showFold: false,
    doLayout: () => {},
    titleStyle: "",
  }
);

const $emit = defineEmits(["foldChange"])

function arrowClick() {
  isFold.value = !isFold.value;
  isFold.value && props.doLayout();
  $emit("foldChange", isFold.value);
}
</script>

<style scoped lang="scss">
.common-content-wrap {
  height: 100%;
  width: 100%;
  .content-title {
    position: relative;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 16px;
    font-weight: bold;
    line-height: 3;
    color: #333;
    justify-content: space-between;
    border: none;
    &::before {
      content: "";
      display: inline-block;
      width: 11px;
      height: 22px;
      background-color: #0b79df;
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }

    .header-left {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 5px;
      flex: 1;
      .left-tip {
        margin-left: 10px;
        font-size: 12px;
        color: #2d3237;
        flex: 1;
      }
    }

    .header-right {
      em {
        display: inline-block;
        width: 17px;
        height: 10px;
        margin-left: 10px;
        background: url("/src/assets/image/arrow.svg") no-repeat;
        cursor: pointer;
        transition: transform 0.3s;
      }

      .above {
        transform: rotate(0deg);
      }

      .reverse {
        transform: rotate(180deg);
      }
    }
  }

  .content-body {
    height: calc(100% - 50px);
  }
}
</style>
