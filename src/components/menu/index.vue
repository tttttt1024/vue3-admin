<template>
  <a-menu
    mode="inline"
    :selected-keys="props.selectedKeys"
    v-model:openKeys="openKeys"
    @select="handleSelect"
  >
    <template v-for="item in data">
      <template v-if="!item.children.length">
        <a-menu-item :key="item.route" :title="item.funName">
          <Icon v-if="item.icon" :icon="item.icon" :alt="item.funName" customClass="menu-img" class="menu-icon" />
          <span v-show="!collapsed">{{ item.funName }}</span>
        </a-menu-item>
      </template>
      <template v-else>
        <sub-menu :key="item.route" :menu-info="item" :collapsed="collapsed"></sub-menu>
      </template>
    </template>
  </a-menu>
</template>

<script lang="ts" setup>
import SubMenu from "./subMenu.ts";
import { useRouter } from "vue-router";
import Icon from "@/components/common/Icon.vue";
import { ref, watch, onMounted } from 'vue'

const props = defineProps<{ data: any[]; selectedKeys: string[]; collapsed: boolean; searchValue?: string }>()

const router = useRouter();

// 已展开的子菜单 keys
const openKeys = ref<string[]>([])
// 折叠时缓存展开 keys，展开时恢复
const cachedOpenKeys = ref<string[]>([])

function unionUnique(arrA: string[], arrB: string[]): string[] {
  const set = new Set<string>([...arrA, ...arrB])
  return Array.from(set)
}

function findPathByRoute(nodes: any[], routeKey: string, path: any[] = []): any[] | null {
  if (!Array.isArray(nodes)) return null
  for (const node of nodes) {
    const nextPath = [...path, node]
    if (node.route === routeKey) return nextPath
    if (node.children && node.children.length) {
      const res = findPathByRoute(node.children, routeKey, nextPath)
      if (res) return res
    }
  }
  return null
}

function getOpenKeysBySelected(selectedKey?: string): string[] {
  if (!selectedKey) return []
  const path = findPathByRoute(props.data || [], selectedKey) || []
  // 仅取有子节点的作为 SubMenu 的 key
  return path.filter((n: any) => n && n.children && n.children.length).map((n: any) => n.route)
}

// 获取所有可展开的菜单项keys
function getAllOpenKeys(nodes: any[]): string[] {
  const keys: string[] = []
  for (const node of nodes) {
    if (node.children && node.children.length) {
      keys.push(node.route)
      keys.push(...getAllOpenKeys(node.children))
    }
  }
  return keys
}

function initOpenKeys() {
  const currentKey = props.selectedKeys?.[0]
  const needOpen = getOpenKeysBySelected(currentKey)
  
  // 如果有搜索内容，展开所有菜单项
  if (props.searchValue && props.searchValue.trim()) {
    const allOpenKeys = getAllOpenKeys(props.data || [])
    openKeys.value = unionUnique(openKeys.value, allOpenKeys)
  } else {
    // 合并之前的展开，不收起
    openKeys.value = unionUnique(openKeys.value, needOpen)
  }
}

function handleSelect({ key }: { key: string }) {
  // 先更新展开项，确保不收起之前展开项
  const needOpen = getOpenKeysBySelected(key)
  openKeys.value = unionUnique(openKeys.value, needOpen)

  router.push({
    path: key,
    query: {
      token: localStorage.token
    },
  });
}

// 选中项变化或数据变化时，展开对应父级，并保留既有展开
watch(
  () => [props.selectedKeys, props.data, props.searchValue],
  () => initOpenKeys(),
  { deep: true, immediate: true }
)

// 折叠时清空显示但缓存，展开时恢复并合并当前选中路径
watch(
  () => props.collapsed,
  (collapsed) => {
    if (collapsed) {
      cachedOpenKeys.value = [...openKeys.value]
      openKeys.value = []
    } else {
      const currentKey = props.selectedKeys?.[0]
      const needOpen = getOpenKeysBySelected(currentKey)
      openKeys.value = unionUnique(cachedOpenKeys.value, needOpen)
    }
  },
  { immediate: false }
)

onMounted(() => {
  initOpenKeys()
})
</script>

<style lang="scss" scoped>
.ant-menu {
  :deep(.ant-menu-item-selected) {
    background-color: #2470FF !important;
    color: #fff !important;
    &::after {
      border: 0;
    }
  }
  :deep(.ant-menu-submenu-title){
    display: flex;
    align-items: center;
  }
  :deep(.ant-menu-title-content){
    &>span{
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
}
:deep(.menu-img){
  width: 18px !important;
  height: 18px !important;
}
</style>
