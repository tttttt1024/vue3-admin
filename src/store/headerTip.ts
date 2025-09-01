import { defineStore } from 'pinia'
import request from '@/lib/request'
import { debounce } from '@/lib/tool'

// 获取待办执行任务统计
const getWaitDealCensus = (data: {}) => {
  return request({
    baseURL: window.APP_CONFIG.taskUrl,
    url: '/integrityTask/getWaitDealCensus',
    method: 'POST',
    data,
  })
}
// 获取任务提醒统计
const taskRemindCensus = () => {
  return request({
    baseURL: window.APP_CONFIG.taskUrl,
    url: `/integrityTask/taskRemindCensus`,
    method: 'GET',
  })
}

const setTodoCount = () => {
  return new Promise((res, rej) => {
    getWaitDealCensus({ contain: 'true' })
      .then(({ code, data, msg }) => {
        if (code === 200) {
          const TODO_STATUS = '1'
          const REVIEW_STATUS = '3'
          if (data && data.length) {
            const todoItem = data.find((item: any) => item.status === TODO_STATUS)
            const reviewItem = data.find((item: any) => item.status === REVIEW_STATUS)
            res(todoItem?.value || reviewItem?.value || 0)
          }
        } else {
          throw msg || 'error request'
        }
      })
      .catch((e) => {
        console.error(e)
        rej()
      })
  })
}

const setMsgCount = () => {
  return new Promise((res, rej) => {
    taskRemindCensus()
      .then(({ code, data, msg }) => {
        if (code === 200) {
          const UNREAD_STATUS = '12'
          if (data && data.length) {
            const unread = data.find((item: any) => item.status === UNREAD_STATUS)
            res(unread?.value || 0)
          }
        } else {
          throw msg || 'error request'
        }
      })
      .catch((e) => {
        console.error(e)
        rej()
      })
  })
}

const setData = debounce(
  (cb: Function) => {
    Promise.all([setTodoCount(), setMsgCount()]).then((data) => {
      cb && cb(data)
    })
  },
  10000,
  true
)

export default defineStore('headerTip', {
  state: () => {
    return {
      todoCount: 0,
      msgCount: 0,
    }
  },
  actions: {
    ListenMsgOn() {
      if (!window.APP_CONFIG.listenMsg) return
      setData(([todo, msg]: number[]) => {
        this.todoCount = todo
        this.msgCount = msg
      })
    },
  },
})
