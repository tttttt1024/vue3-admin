<template>
  <div v-if="showMessage" id="TaskManagerMessageCenter">
    <div
      v-for="(msgContent, index) in msgList"
      :key="msgContent.messageId"
      :id="'message' + index"
      class="message-content"
      :class="msgContent.showClass"
    >
      <div class="msg-title">
        <p>{{ `任务提醒` }}</p>
        <close-outlined class="close-btn" @click="close(msgContent)" />
      </div>
      <p class="msg-content">{{ msgContent.contents }}</p>
      <a-button
        type="text"
        class="f-r"
        style="margin: 10px"
        @click="close(msgContent)"
        >知道了</a-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, Ref } from "vue";
import useStore from "@/store";
import { isTodayAndWeekByDay } from "@/lib/getDate";
const store = useStore(); // 获取store
const userInfo = store.user.info; // 获取当前用户的信息
const roles = userInfo?.roles || []; // 获取当前应用的角色列表
const scheduleRole = window.APP_CONFIG.scheduleRole; // 获取当前应用的角色列表
const currentTime = computed(() => {
  // 获取当前时间
  return store.time.currentTime;
});

const focusTrackingScheduleMsg =
  JSON.parse(localStorage.getItem(`focusTrackingScheduleMsg`)) == true ||
  localStorage.getItem(`focusTrackingScheduleMsg`) == undefined
    ? true
    : false;

const show = computed(() => {
  const isWednesday = isTodayAndWeekByDay(currentTime.value, 2);
  if (isWednesday) {
    localStorage.setItem("focusTrackingScheduleMsg", JSON.stringify(focusTrackingScheduleMsg));
  } else {
    localStorage.removeItem("focusTrackingScheduleMsg");
  }
  return isWednesday;
});
const showMessage = computed(() => {
  const hasAuth = verifyAuth(scheduleRole.tb);
  console.log(focusTrackingScheduleMsg);
  // 是否显示消息弹窗
  return show.value && hasAuth && focusTrackingScheduleMsg;
});
/**验证权限 */
function verifyAuth(arr1: string[]) {
  const set1 = new Set(arr1);
  return roles.map((e) => e.roleCode).some((item) => set1.has(item));
}

type MessageType = {
  contents: string;
  messageClass: number;
  messageId: string;
  showClass: string;
};
const msgList: Ref<MessageType[]> = ref([
  {
    contents: "今天是周三，周四请按时完成填报",
    messageClass: 1,
    messageId: "messageId",
    showClass: "pop-in",
  },
]);

/**消息弹窗关闭事件 */
function close(msg: MessageType) {
  msg["showClass"] = "pop-out";
  setTimeout(() => {
    msgList.value = msgList.value.filter(
      (m: MessageType) => m.messageId !== msg.messageId
    );
  }, 500);
  localStorage.setItem("focusTrackingScheduleMsg", "false");
}
</script>

<style lang="scss" scoped>
#TaskManagerMessageCenter {
  position: fixed;
  left: 100%;
  bottom: 0;
  z-index: 999;

  .message-content {
    margin-bottom: 16px;
    width: 400px;
    height: 160px;
    background-color: $--cas-color10;
    border-radius: 5px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: all 0.3s;

    &.pop-in {
      transform: translateX(-105%);
    }

    &.pop-out {
      height: 0;
      margin: 0;
      opacity: 0;
      transform: translateX(-105%);
    }

    .msg-title {
      background-color: $--cas-color1;
      color: $--cas-color10;
      font-size: 16px;
      font-weight: bold;
      line-height: 3rem;
      padding: 0 1rem;

      p {
        display: inline-block;
      }

      .close-btn {
        float: right;
        font-size: 1.2rem;
        margin: 0.9rem 0;
        cursor: pointer;
      }
    }

    .msg-content {
      margin: 1rem 0;
      padding: 0 1.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
    }
  }

  #message-offline {
    .msg-content {
      line-height: 34px;
      padding: 0 0.5rem;

      .offline-icon {
        font-size: 20px;
        color: #88acce;
        vertical-align: middle;
      }

      .highlirht-num {
        margin: 0 3px;
        color: $--cas-general-blue;
      }
    }
  }
}
</style>
