<template>
  <header class="page-header">
    <div class="header-left">
      <img class="logo" src="/src/assets/image/logo.png" />
      <span class="app-title">{{ userInfo.appName }}</span>
    </div>
    <div class="header-right">
      <page-nav :navs="navData"></page-nav>
      <!-- <div class="badge" @click="goMissionTodo">
        <a-badge :count="todoCount" :overflow-count="9999">
          <a-tooltip placement="topLeft">
            <template #title>
              <span>任务待办</span>
            </template>
            <AuditOutlined style="font-size: 30px; color: #fff" />
          </a-tooltip>
        </a-badge>
      </div>
      <div class="badge" @click="goMessageCenter">
        <a-badge :count="msgCount" :overflow-count="9999">
          <a-tooltip placement="topLeft">
            <template #title>
              <span>未读消息</span>
            </template>

            <BellOutlined style="font-size: 30px; color: #fff" />
          </a-tooltip>
        </a-badge>
      </div> -->
      <div class="functional-area">
        <div class="user">
          <user-outlined :style="{ fontSize: '28px' }" />
          <span>{{ userInfo.userName }}</span>
        </div>
        <div class="logout" @click="handleLogout">
          <logout-outlined :style="{ fontSize: '28px' }" />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>
import {
  defineComponent,
  createVNode,
  getCurrentInstance,
  ComponentInternalInstance,
} from "vue";
import { handleLoginLoss } from "@/lib/request";
import { logoutAPI } from "@/api/base";
import { Modal } from "ant-design-vue";
import PageNav from "./nav.vue";
import useStore from "@/store";
import { useRouter } from "vue-router";
import { onMounted, computed } from "vue";
defineComponent({
  PageNav,
});
const store = useStore();
const router: any = useRouter();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const baseInfo = {
  appName: "",
  fun: [],
  userName: [],
};
const userInfo = Object.assign(baseInfo, store.user.info);
const navData = userInfo.fun.filter((item: IFunConfig) => item.funType !== 1);
onMounted(() => {
  // store.headerTip.taskRemindCensus();
  // store.headerTip.getWaitDealCensus();
});
//注销登录
function handleLogout() {
  Modal.confirm({
    title: "确认退出登录?",
    icon: createVNode(proxy?.$icons["ExclamationCircleOutlined"]),
    centered: true,
    onOk: async () => {
      const { code } = await logoutAPI();
      if (code === 200) {
        handleLoginLoss();
      }
    },
  });
}
const todoCount = computed(() => {
  return store.headerTip.todoCount;
});
const msgCount = computed(() => {
  return store.headerTip.msgCount;
});
const goMessageCenter = () => {
  router.push({
    path: window.APP_CONFIG.messageCenterPath,
  });
};
const goMissionTodo = () => {
  router.push({
    path: window.APP_CONFIG.missionTodoPath,
  });
};
</script>

<style lang="scss" scoped>
.page-header {
  width: 100%;
  height: 60px;
  background: linear-gradient(
    90deg,
    rgba(36, 112, 255, 1) 0%,
    rgba(36, 128, 255, 1) 73%,
    rgba(28, 142, 247, 1) 95%
  );
  display: flex;
  justify-content: space-between;
  padding: 0 38px 0 16px;
  color: $--cas-text6;
  > div {
    display: flex;
    align-items: center;

    .logo {
      width: 50px;
      height: 50px;
    }

    .app-title {
      font-size: 34px;
      margin-left: 16px;
    }
    .badge {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 60px;
      margin-left: 20px;
      &:hover {
        background: #409eff;
        cursor: pointer;
      }
    }
    .functional-area {
      display: flex;

      .user {
        display: flex;
        align-items: center;
      }
      span {
        font-size: 16px;
        margin-left: 4px;
      }
      .logout {
        cursor: pointer;
        margin-left: 6px;
      }
    }
  }
}
</style>
