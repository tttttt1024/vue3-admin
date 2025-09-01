<template>
  <Select v-bind="$attrs" :options="orgIds" :fieldNames="fieldNames">

  </Select>
</template>

<script lang="ts" setup>
import { Select } from 'ant-design-vue';
import {computed} from "vue"
import useStore from "@/store";
const store = useStore(); // 获取store
const userInfo = store.user.info; // 获取当前用户的信息
const orgIds = computed(()=>{
  return userInfo?.orgIds?.filter((e) => e.orgLevel == 2 && e.orgType == 3) || []; // 获取当前应用的组织机构列表
})
const fieldNames = { label: "orgName", value: "orgCode" }
</script>

<style scoped lang="scss"></style>