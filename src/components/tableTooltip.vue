<template>
  <div
    v-if="isShowTooltip"
    class="text-overflow"
    @mouseover="inputOnMouseOver($event)"
    :title="props.customTitle || text"
  >
    {{ text }}
  </div>
  <div v-else class="text-overflow" @mouseover="inputOnMouseOver($event)">
    {{ text || "--" }}
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
type IProps = {
  title?: any;
  transform?: {
    list: any[];
    field?: {
      value: string;
      label: string;
    };
  };
  customTitle?: string;
};
const props = defineProps<IProps>();

const text = computed(() => {
  if (props.transform && props.transform.list && props.transform.list.length) {
    const label = props.transform?.field?.label || "label";
    const value = props.transform?.field?.value || "value";
    const item = props.transform.list.find(
      (item) => item[value] == props.title
    );
    if (item) return item[label];
  }
  return props.title;
});

// 文字超出容器宽度时显示tooltip
const isShowTooltip = ref(false);
// 判断是否开启tooltip功能
function inputOnMouseOver(e: MouseEvent) {
  // 容器宽度 HTMLElement
  const target = e.target as HTMLTextAreaElement;
  let boxWidth = target.offsetWidth;
  let testWidth =
    target?.value?.length * 14 || target?.innerText.length * 14 || 0;
  // 比较文字宽度和容器宽度
  if (testWidth > boxWidth) {
    isShowTooltip.value = true;
  } else {
    isShowTooltip.value = false;
  }
}
</script>

<style scoped lang="scss"></style>
