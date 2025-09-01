<template>
  <slot :dictList="dictList">
    <tableTooltip
      :title="props.title"
      v-bind="$attrs"
      :transform="{
        list: dictList,
        field: props.field || { value: 'code', label: 'name' },
      }"
    ></tableTooltip>
  </slot>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import useStore from "@/store";

const props = defineProps<{
  title: any;
  dictName?: string;
  dicts?: any[];
  field?: { value: string; label: string };
}>();

const store = useStore(); // 获取store
const dict = store.dict;
import tableTooltip from "./tableTooltip.vue";
props.title=='1'&&console.log({props});
const dictList = computed(() => {
  if (props.dicts) {
    return props.dicts;
  }
  return dict.dictMap[props.dictName] || [];
});
</script>

<style scoped lang="scss"></style>
