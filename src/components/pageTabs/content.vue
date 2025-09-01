<template>
  <div class="page-tabs_content shadow-content">
    <template v-for="item in list" :key="item[1].code">
      <base-iframe
        v-show="item[0] === current"
        :src="
          urlParamsMerge(item[1].iframeSrc, router.currentRoute.value.fullPath)
        "
        :micro-app-code="item[1].code"
        :state="item[1]"
      ></base-iframe>
    </template>
  </div>
</template>

<script lang="ts" setup>
import useStore from "@/store";
import { computed, toRefs } from "vue";
import { urlParamsMerge } from "@/lib/tool";
import { useRouter } from "vue-router";
import BaseIframe from "@/components/iframe/index.vue";

const props = defineProps<{
  current: string;
}>();
const router = useRouter();
const { current } = toRefs(props);
const store = useStore();
const list = computed(() => {
  return store.page.chache;
});

function refreshByIndex(index: number) {
  list.value[index][1].code += new Date().getTime();
}

defineExpose({
  refreshByIndex,
});
</script>

<style lang="scss" scoped>
.page-tabs_content {
  height: calc(100% - 50px);
  margin-top: 10px;
  padding: 6px;
}
</style>
