<template>
  <nav>
    <ul>
      <li v-for="(item, index) in navs" :key="item.id" :class="{ 'is-active': isActive(item.route, index) }"
        @click="handleNavItemClick(item)">
        <!-- 使用Icon组件显示图片或字体图标 -->
        <Icon v-if="item.icon" :icon="item.icon" :alt="item.funName" customClass="nav-img" class="nav-icon" />
        <!-- 导航文本 -->
        <span class="nav-text">{{ item.funName }}</span>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
import { toRefs } from "vue";
import useStore from "@/store/index";
import Icon from "@/components/common/Icon.vue";

const store = useStore();

const props = defineProps<{
  navs: Array<any>;
}>();
const router = useRouter();

const { navs } = toRefs(props);
console.log({ navs })

function isActive(path: string, index: number): boolean {
  const flag =
    router.currentRoute.value.matched.find((item) => item.path === path) !==
    undefined;
  if (flag) {
    store.nav.setIndex(index);
  }
  return flag;
}

function handleNavItemClick({ route }: { route: string }) {
  store.page.resetChache();
  router.push({
    path: route,
  });
}
</script>

<style lang="scss" scoped>
nav {
  li {
    float: left;
    font-size: 20px;
    border-bottom: 0;
    font-weight: 600;
    height: 60px;
    line-height: 60px;
    padding: 0 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &.is-active {
      background-color: $--cas-general-blue !important;
    }
    
    .nav-icon {
      display: flex;
      align-items: center;
      font-size: 20px;
      color: inherit;
    }
    
    .nav-text {
      white-space: nowrap;
    }
  }
}

:deep(.nav-img) {
  width: 24px !important;
  height: 24px !important;
}
</style>
