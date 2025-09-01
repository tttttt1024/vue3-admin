<template>
  <div class="page-tabs__wrapper">
    <div class="page-tabs_nav shadow-content">
      <ul>
        <li
          v-for="(item, index) in data"
          v-contextmenu:contextmenu
          :class="{ active: router.currentRoute.value.path === item[0] }"
          @contextmenu="contextmenuIndex = index"
          @click="handleClick(item[0])"
        >
          <span>{{ item[1].name }}</span>
          <close-outlined
            v-if="data.length > 1"
            @click.stop="handleClose(item[0])"
          />
        </li>
      </ul>
    </div>
    <tabs-content
      ref="contentRef"
      :current="router.currentRoute.value.path"
    ></tabs-content>
  </div>

  <v-contextmenu ref="contextmenu">
    <v-contextmenu-item @click="handleRefresh">刷新页面</v-contextmenu-item>
    <v-contextmenu-item @click="handleCloseRight">关闭右侧</v-contextmenu-item>
    <v-contextmenu-item @click="handleCloseOther">关闭其他</v-contextmenu-item>
  </v-contextmenu>
</template>

<script lang="ts" setup>
import { ref, computed, defineComponent } from "vue";
import useStore from "@/store";
import { useRouter } from "vue-router";
import TabsContent from "./content.vue";

defineComponent({
  TabsContent,
});

let contextmenuIndex = ref<number | null>(null);
const store = useStore();
const router = useRouter();
const data = computed(() => store.page.chache);
const contentRef = ref();

function handleClick(path: string) {
  router.push({
    path,
  });
}

//刷新页面
function handleRefresh() {
  contentRef.value.refreshByIndex(contextmenuIndex.value);
}

//关闭
function handleClose(path: string) {
  store.page.removeChache(path);
  updateRouter();
}

//关闭右侧
function handleCloseRight() {
  const arr = data.value.map((item) => item[0]);
  if (typeof contextmenuIndex.value === "number") {
    for (let index = contextmenuIndex.value + 1; index <= arr.length; index++) {
      store.page.removeChache(arr[index]);
    }
    updateRouter();
  }
}

//关闭其他
function handleCloseOther() {
  const arr = data.value.filter(
    (_item, index) => index !== contextmenuIndex.value
  );
  arr.forEach(([path]) => {
    store.page.removeChache(path);
  });
  updateRouter();
}

//关闭后更新路由
function updateRouter() {
  const route = router.currentRoute.value.path;
  let needUpdateFlag =
    data.value.filter((item) => item[0] === route).length === 0;
  if (needUpdateFlag) {
    router.push({
      path: data.value[data.value.length - 1][0],
    });
  }
}
</script>

<style lang="scss" scoped>
.page-tabs__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .page-tabs_nav {
    height: 40px;
    padding: 0 10px;
    margin-top: 10px;
    ul {
      height: 100%;
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      li {
        display: inline-block;
        height: 32px;
        line-height: 32px;
        padding: 0 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin-right: 4px;
        cursor: pointer;
        position: relative;
        top: 4px;
        &.active {
          background: $--cas-color2;
          color: #fff;
          &::before {
            content: "";
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #fff;
            border-radius: 50%;
            margin-right: 4px;
            position: relative;
            top: 1px;
          }
        }
        .anticon-close {
          font-size: 10px;
          margin-left: 4px;
          position: relative;
          top: -1px;
        }
      }
    }
  }
}
</style>
