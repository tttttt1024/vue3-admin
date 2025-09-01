<template>
  <div :id="id" class="common-content-wrap">
    <div class="content-title flex">
      <div class="header-left">
        {{ title }}
        <span class="left-tip">
          <slot name="left"></slot>
        </span>
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
    showFold?: boolean;
    doLayout?: Function;
  }>(),
  {
    id: "CommonContentWrap",
    title: "",
    showFold: false,
    doLayout: () => {},
  }
);

function arrowClick() {
  isFold.value = !isFold.value;
  isFold.value && props.doLayout();
}
</script>

<style scoped lang="scss">
.common-content-wrap {
  .content-title {
    position: relative;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 16px;
    font-weight: bold;
    line-height: 3;
    border-bottom: 1.6px solid;
    color: #0b79df;
    background-color: rgb(247, 251, 255);
    justify-content: space-between;
    border-bottom: 1px solid;
    border-color: rgba(221, 236, 253, 1);

    &::before {
      content: "";
      display: inline-block;
      width: 3px;
      height: 20px;
      background-color: #0b79df;
      position: absolute;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }

    .header-left {
      display: inline-block;

      .left-tip {
        margin-left: 10px;
        font-size: 12px;
        color: #2d3237;
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
