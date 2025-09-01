<template>
  <div :id="id" class="common-content-wrap">
    <div class="content-title flex">
      <div class="header-left">
        <slot name="title" :title="title">{{ title }}</slot>
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
    <div class="content-body" v-show="!isFold">
      <slot>
        <noData/>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import noData from '@/components/common/noData.vue';

import { ref } from "vue";

const isFold = ref(false);

const props = withDefaults(
  defineProps<{
    id?: string;
    title?: string;
    showFold?: boolean;
    doLayout?: Function;
    offset?: number;
  }>(),
  {
    id: "CommonContentWrap",
    title: "",
    showFold: false,
    doLayout: () => {},
    offset: 20,
  }
);

function arrowClick() {
  isFold.value = !isFold.value;
  isFold.value && props.doLayout();
}

const offsetGap = computed(() => {
  return `${props.offset}px`;
});

const contentTitleOffset = computed(() => {
  return `calc(${offsetGap.value} + 1.2rem)`;
});
</script>

<style scoped lang="scss">
.common-content-wrap {
  .content-title {
    position: relative;
    padding-left: v-bind("contentTitleOffset");
    padding-right: 10px;
    font-size: 16px;
    font-weight: bold;
    line-height: 3;
    border-bottom: 1.6px solid;
    color: #2d3237;
    border-color: $--cas-table-border;
    background-color: rgb(247, 251, 255);
    justify-content: space-between;
    &::before {
      content: "";
      position: absolute;
      left: v-bind("offsetGap");
      top: 50%;
      transform: translateY(-50%);
      width: 7px;
      height: 20px;
      background-color: $--cas-color1;
      border-radius: 2px;
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
    position: relative;
  }
}

.common-content-wrap + .common-content-wrap {
  margin-top: 12px;
}
</style>
