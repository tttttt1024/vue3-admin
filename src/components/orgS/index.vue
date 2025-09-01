
<template>
  <div>
    <orgSelectTree v-model:orgs="orgs" v-bind="$attrs" @updateOrgs="updateOrgs"/>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue"
import orgSelectTree from "./orgSelectTree.vue"
const emit = defineEmits<{
  (e: "update:value", value: { secOrgName: string; orgName: string }): void
}>()
const props = defineProps<{
  value:{secOrgName?:string, orgName?:string},
}>()
const orgs = ref('')
const updateOrgs = (org) => {
  emit("update:value", org)
}
watch(() => props.value, (newVal) => {
  if(newVal){
    orgs.value = newVal.orgName || newVal.secOrgName || null
  }else{
    orgs.value = null
  }
},{immediate:true,deep:true})
</script>

<style scoped lang="scss">
</style>