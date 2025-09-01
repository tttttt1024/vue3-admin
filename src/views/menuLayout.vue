<template>
  <a-layout has-sider>
    <a-layout-sider v-model:collapsed="collapsed" collapsible width="256px">
      <div class="sider-container">
        <a-input v-model:value="searchValue" placeholder="搜索内容" @focus="collapsed = false" allowClear>
          <template #prefix>
            <img class="search-icon" src="@/assets/image/u4.png" alt="" />
          </template>
        </a-input>
        <base-menu :data="navMenu" :selected-keys="menuState.selectedKeys" :collapsed="collapsed"
          :search-value="searchValue"></base-menu>
      </div>
      <template #trigger>
        <div class="trigger-container">
          <img class="trigger-icon" src="@/assets/image/u42.png" alt="" />
          <span v-show="collapsed === false">收起</span>
        </div>
      </template>
    </a-layout-sider>
    <a-layout-content>
      <page-tabs></page-tabs>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import BaseMenu from "@/components/menu/index.vue";
import { ref, reactive, defineComponent, watch, computed, nextTick } from "vue";
import { useRouter, Router, useRoute } from "vue-router";
import useStore from "@/store";
import PageTabs from "@/components/pageTabs/index.vue";
import { filterTree, isValueInTree } from "@/lib/tool";
import { debounce } from "lodash";


defineComponent({
  BaseMenu,
  PageTabs,
});
const store = useStore();
const collapsed = ref<boolean>(false);
const searchValue = ref("");
const router: Router = useRouter();
const route = useRoute();
const navActiveIndex = computed(() => {
  return store.nav.activeNavIndex;
});

const menuState = reactive({
  data: store.user.menuList[navActiveIndex.value].children,
  selectedKeys: [router.currentRoute.value.path],
});
const navMenu = computed(() => {
  const _result = filterTree(
    menuState.data,
    searchValue.value,
    "funName"
  ) as IMenuParam[];
  navChange(_result);
  return _result;
});
function findFirstValidRoute(data: any[]) {
  const stack = [...data];
  while (stack.length) {
    const node = stack.shift();
    if (node.hasDisplay !== 0 && node.reqPath) {
      return node.route;
    }
    if (node.children?.length) {
      stack.unshift(...node.children);
    }
  }
  return null;
}
const navChange = debounce((data: IMenuParam[]) => {
  const _path = route.path;
  const _has = isValueInTree(data, _path, "route");
  if (!_has && data.length > 0) {
    const _r = findFirstValidRoute(data);
    if (_r) {
      router.push(_r);
    }
  }
}, 500);

watch(
  () => router.currentRoute.value.fullPath,
  (_newPath, _oldPath) => {
    nextTick(() => {
      menuState.data = store.user.menuList[navActiveIndex.value].children;
      menuState.selectedKeys = [router.currentRoute.value.path];
      //添加页面缓存
      store.page.addChache(router.currentRoute.value);
    });
  },
  {
    immediate: true,
  }
);

watch(() => collapsed.value, (val) => {
  menuCollapse(val)
})

const menuCollapse = debounce((val: boolean) => {
}, 500)



</script>

<style lang="scss" scoped>
.ant-layout {
  width: 100%;
  height: 100%;
  background: #e6eef7;
}

.ant-layout-content,
.ant-layout-sider {
  height: 100%;
}

:deep(.ant-layout-sider) {
  background: #fff;
  padding-bottom: 0;
  position: relative;
  height: 100%;
  overflow: auto;
  .ant-layout-sider-trigger {
    background: #fff;
    position: absolute;
    .trigger-container {
      .trigger-icon {
        width: 19px;
        height: 19px;
        margin-right: 10px;
        vertical-align: sub;
      }

      span {
        color: $--cas-color1;
        font-family: "Arial Normal", "Arial", sans-serif;
        font-weight: 400;
        font-size: 16px;
      }
    }
  }

  .ant-layout-sider-children {
    height: calc(100% - 108px);
  }
}

:deep(.ant-layout-sider-collapsed) {
  .trigger-icon {
    transform: rotate(180deg);
  }
}

.ant-layout-content {
  padding: 0 10px;
}

.sider-container {
  height: 100%;
  padding-top: 10px;

  :deep(.ant-input-affix-wrapper) {
    margin: 5px 10px;
    width: calc(100% - 20px);
    height: 45px;
    border: none;
    background-color: #f5f5f5;

    .ant-input-prefix {
      .search-icon {
        width: 25px;
        height: 25px;
      }
    }

    .ant-input {
      background-color: #f5f5f5;
      font-family: "Arial Normal", "Arial", sans-serif;
      font-weight: 400;
      font-style: normal;
      color: #999;
      font-size: 16px;
      padding-left: 8px;

      &::placeholder {
        font-family: "Arial Normal", "Arial", sans-serif;
        font-weight: 400;
        font-style: normal;
        color: #999;
        font-size: 16px;
      }
    }
  }

  ul {
    height: calc(100% - 55px);
    overflow: auto;
  }
}
</style>
