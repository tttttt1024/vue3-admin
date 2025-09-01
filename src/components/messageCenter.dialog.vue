<template>
  <div id="TaskManagerMessageCenter">
    <div
      v-for="(msgContent, index) in msgList"
      :key="msgContent.messageId"
      :id="'message' + index"
      class="message-content"
      :class="msgContent.showClass"
    >
      <div class="msg-title">
        <p>{{ msgTypeDict[msgContent.messageType - 1] }}</p>
        <close-outlined class="close-btn" @click="close(msgContent)" />
      </div>
      <p class="msg-content">{{ msgContent.contents }}</p>
      <a-button type="text" class="f-r" style="margin: 10px" @click="goMessageCenter"
        >查看详情>></a-button
      >
    </div>
    <div
      id="message-offline"
      class="message-content"
      :class="offlineContent.showClass"
      v-if="showOffline"
    >
      <div class="msg-title">
        <p>离线通知</p>
        <close-outlined class="close-btn" @click="closeOffMessage()" />
      </div>
      <p class="msg-content" v-if="offlineContent.msgCount">
        <bell-outlined class="offline-icon" />
        您新增有
        <span class="highlirht-num">{{ offlineContent.msgCount }}</span>
        条未读消息，请及时查看
        <a-button type="text" class="f-r" @click="goMessageCenter">查看详情>></a-button>
      </p>
      <p class="msg-content" v-if="offlineContent.taskCount">
        <container-outlined class="offline-icon" />
        您新增有
        <span class="highlirht-num">{{ offlineContent.taskCount }}</span>
        条未处置任务，请及时处理
        <a-button type="text" class="f-r" @click="goMissionTodo">前往处置>></a-button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import useStore from '@/store'
import { connectMq, client } from '@/lib/rabbitMQ'
import { computed, onMounted, reactive, Ref, ref, watch } from 'vue'
import request from '@/lib/request'
import router from '@/router/index'

type MessageType = {
  contents: string
  instanceId: string
  messageClass: number
  messageId: string
  messageType: number
  taskId: string
  userId: string
  showClass: string
}

//获取离线消息列表
const getOfflineMessageList = () => {
  return request({
    baseURL: window.APP_CONFIG.taskUrl,
    url: '/message/getOfflineMessageList',
    method: 'GET',
  })
}
//离线消息确认
const confirmMessage = (messageId: string) => {
  return request({
    baseURL: window.APP_CONFIG.taskUrl,
    url: '/message/confirmMessage?messageId=' + messageId,
    method: 'GET',
  })
}

const msgTypeDict = ['催办提醒', '预警提醒', '超期提醒', '任务提醒']

const store = useStore()

const msgList: Ref<MessageType[]> = ref([])

const offlineContent = reactive<any>({
  msgCount: 0,
  taskCount: 0,
  showClass: '',
})

const userId = computed(() => {
  const userInfo = JSON.parse(JSON.stringify(store.user.info))
  const uid = userInfo.uid
  return uid ? uid.replace(/-/g, '') : ''
})

const showOffline = computed(() => {
  return offlineContent.msgCount > 0 || offlineContent.taskCount > 0
})

function fakeMsg() {
  let i = 0
  const length = 5
  setInterval(() => {
    if (msgList.value.length < length) {
      openMessage({
        contents: '请尽快完成任务' + i++,
        instanceId: '1651482309826809857',
        messageId: new Date().getTime(),
        messageType: 1,
        taskId: '85CDE2F0BB0642FCBC1BD58F205CE8B7',
        userId: 'a491d08ce4e44d6c89c3aa377b97e723',
      })
    }
  }, 1000)
}
async function getOfflineMsgList() {
  try {
    const { code, data } = await getOfflineMessageList()
    if (code === 200) {
      // this.sendOrgList = data
      ;(data || []).forEach((item) => {
        offlineContent[['msgCount', 'taskCount'][item.messageClass - 1]]++
      })
      if (showOffline) {
        openOffMessage()
        confMessage()
      }
      mqInit()
    } else {
      throw Error('Request Bad Code: ' + code)
    }
  } catch (e) {
    console.log(e)
  }
}
async function confMessage(id = '') {
  try {
    const { code } = await confirmMessage(id)
    if (code !== 200) {
      throw Error('Request Bad Code: ' + code)
    }
  } catch (e) {
    console.log(e)
  }
}
function openOffMessage() {
  setTimeout(() => {
    offlineContent['showClass'] = 'pop-in'
  }, 200)
}
function closeOffMessage() {
  offlineContent['showClass'] = 'pop-out'
  setTimeout(() => {
    offlineContent.msgCount = 0
    offlineContent.taskCount = 0
  }, 500)
}
function mqInit() {
  connectMq().then(() => {
    client.subscribe('/exchange/flow.task.message', onMessageRecive, {
      ack: 'client',
      durable: true,
    })
  })
}
function onMessageRecive(frame: any) {
  const msgContent = JSON.parse(JSON.parse(frame.body)) || {}
  if (userId === msgContent.userId) {
    openMessage(msgContent)
    console.log(msgContent)
    // frame.ack()
    confirmMessage(msgContent.messageId)
  }
}
function openMessage(content: any) {
  const msg = { ...content, showClass: '' }
  msgList.value.unshift(msg)
  setTimeout(() => {
    msg['showClass'] = 'pop-in'
  }, 200)
}
function close(msg: MessageType) {
  msg['showClass'] = 'pop-out'
  setTimeout(() => {
    msgList.value = msgList.value.filter((m: MessageType) => m.messageId !== msg.messageId)
  }, 500)
}
function closeAll() {
  msgList.value.forEach((msg: MessageType) => {
    msg['showClass'] = 'pop-out'
  })
  setTimeout(() => {
    msgList.value = []
  }, 500)
}
function goMessageCenter() {
  closeAll()
  offlineContent.msgCount = 0
  router.push(window.APP_CONFIG.messageCenterPath)
}
function goMissionTodo() {
  closeAll()
  offlineContent.taskCount = 0
  router.push(window.APP_CONFIG.missionTodoPath)
}

onMounted(() => {
  // getOfflineMsgList()
})
watch(
  () => localStorage.getItem('token'),
  () => {
    if (localStorage.getItem('token')) getOfflineMsgList()
  }
)
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
