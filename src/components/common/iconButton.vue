<template>
  <a-button v-if="btnType == 'icon'" :class="`icon-btn icon-${props.type}-btn`" v-bind="$attrs">
    <template v-if="ICON[props.type]" #icon>
      <img :src="ICON[props.type]" :class="`${props.type}-icon`" alt="" />
    </template>
    <slot></slot>
  </a-button>
  <a-button v-else :type="btnType" v-bind="$attrs" :class="`default-btn default-${props.type}-btn`">
    <template v-if="ICON[props.type]" #icon>
      <img :src="ICON[props.type]" :class="`${props.type}-icon`" alt="" />
    </template>
    <slot></slot>
  </a-button>
</template>

<script setup lang="ts" name="iconButton">


import deleteIcon from "@/assets/image/common/iconButton/u157.png";
import detail from "@/assets/image/common/iconButton/u175.png";
import detail2 from "@/assets/image/common/iconButton/u234.png";
import history from "@/assets/image/common/iconButton/u258.png"
import view from "@/assets/image/common/iconButton/u473.png";
import edit from "@/assets/image/common/iconButton/u533.png";
import set from "@/assets/image/common/iconButton/u615.png";
import reset from "@/assets/image/common/iconButton/u618.png";
import audit from "@/assets/image/common/iconButton/u662.png"
import add from "@/assets/image/common/iconButton/u2017.png";


const ICON = {
  edit,
  delete: deleteIcon,
  add,
  view,
  reset,
  set,
  detail,
  detail2,
  history,
  audit
};
const props = withDefaults(
  defineProps<{
    type: keyof typeof ICON;
    btnType: string;
  }>(),
  { type: "edit", btnType: "icon" }
);


</script>

<style lang="scss" scoped>
.icon-btn {
  min-width: 79px;
  height: 25px;
  font-size: 14px;
  color: #2470ff;
  background-color: #e7efff;
  font-family: "Arial Normal", "Arial", sans-serif;
  font-weight: 400;
  font-style: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 20px;
  border: none;

  img {
    width: 15px;
    height: 15px;
  }

  .add-icon {
    width: 15px;
    height: 15px;
  }
}

.icon-delete-btn {
  color: #f53618 !important;
  background-color: #fff4f2 !important;
}

.default-btn {
  min-width: 79px;
  height: 36px;
  font-size: 16px;
  color: #fff;
  background-color: #2470ff;
  font-family: "微软雅黑", sans-serif;
  font-weight: 400;
  font-style: normal;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
  border: none;

  &:not(:disabled):hover {
    background-color: #2470ff;
    color: #fff;
    opacity: 0.8;
  }

  img {
    width: 20px;
    height: 20px;
  }
}

.default-reset-btn {
  color: #999 !important;
  background-color: #fff !important;
  border: 1px solid #cccccc !important;

  &:not(:disabled):hover {
    // background-color: #eff4ff !important;
    // color: #2470ff !important;
    // opacity: 0.8;
    // border: 1px solid #2470ff !important;
  }
}
</style>
