<template>
  <Select
    optionFilterProp="name"
    placeholder="请选择"
    allow-clear
    :field-names="{
      label: 'orgName',
      value: 'orgCode',
    }"
    v-bind="$attrs"
    v-on="$attrs"
    :options="dataList"
  >
  </Select>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const pageUrl = `/pipeModify/pipeLine/getOrgList`;
import { Select } from "ant-design-vue";
import request from "@/lib/request";

const dataList = ref([]);
const loading = ref(false);
const props = defineProps({
  url: {
    type: String,
    default: pageUrl,
  },
  params: {
    type: Object,
    default: () => {
      return {};
    },
  },
});
async function getData() {
  try {
    if (!props.url) {
      return;
    }
    loading.value = true;
    const params = Object.values(props.params).join("/");
    const q = params ? `/${params}` : "";
    const { data } = await request({
      url: props.url + q,
      method: "GET",
    });
    dataList.value = dataList.value.concat(data || []);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

getData();
</script>

<style scoped lang="scss"></style>
