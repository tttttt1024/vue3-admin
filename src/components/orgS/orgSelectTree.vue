
<template>
    <a-tree-select
      v-bind="$attrs"
      show-search
      :tree-data="treeData"
      tree-node-filter-prop="label"
      @select="selectTree"
      @change="changeTree"
      v-model:value="props.orgs"
    >
    </a-tree-select>
</template>

<script setup lang="ts">
import { computed  } from "vue"
import useStore from "@/store";
const store = useStore(); // 获取store
let orgTree = store.user.orgTree 
const treeData = computed(()=>{
  let res = buildTree(orgTree)
  console.log(123,res);
  
  return res

}) 
const props = defineProps<{
  orgs: string
}>()
// 处理permission的orgIds数据
function buildTree(data) {
  return data?.map?.(e => {
    // 为当前节点赋值 label 和 value
    const node = {
      ...e,
      label: e.dictValue,
      value: e.dictCode
    };

    // 如果有子节点，递归处理子节点
    if (e.children && e.children.length > 0) {
      node.children = buildTree(e.children);
    }

    return node;
  }) || [];
}

// function getVisibleData(data, orgCode) {
//   const tree = buildOrgTree(data);
  
//   // 递归查找指定orgCode的节点
//   const findNode = (nodes, orgCode) => {
//     for (const node of nodes) {
//       if (node.idKey === orgCode) {
//         return node.children || [];
//       }
//       if (node.children) {
//         const result = findNode(node.children, orgCode);
//         if (result) {
//           return result;
//         }
//       }
//     }
//     return null;
//   };

//   return findNode(tree, orgCode);
// }
const emit = defineEmits<{
  (e: "updateOrgs", value: any): void
}>()
const selectTree = (value, node)=>{
  let org = {}
  if(node.level === 2){
    org = {secOrgName:node.label}
  }else{
    let chooseOrg:any = orgTree.filter(item=>{
      if(item.id.trim() == node.pid.trim()){
        return item
      }
    })
    console.log(987,chooseOrg);
    
    org = {
      secOrgName:chooseOrg[0].dictValue,
      orgName:node.label
    }
  }
  emit("updateOrgs", org)
  return org
}
const changeTree = (value, node)=>{
  console.log(66,value, node);
  if(!value)emit("updateOrgs", {})
}
</script>

<style scoped lang="scss">

</style>