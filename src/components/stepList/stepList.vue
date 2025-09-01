<template>
  <div :id="id" class="flow-container shadow-content">
    <!-- <a-spin :spinning="loading"> -->
    <div ref="stepList" v-show="!isFoldStepList" class="flow-list">
      <template v-if="flowList && flowList.length">
        <template v-for="(item, index) in flowList" :key="'flow-item' + index">
          <div class="flow-item" :class="StepStatus[item.status]">
            <user-outlined class="flow-icon" style="padding-top: 4px" />
            <p class="flow-name" v-if="item.executePersonName">
              {{ item.executePersonName }}
            </p>
            <p class="step-name" v-if="item.stepName">{{ item.stepName }}</p>
            <p class="step-name" v-if="item.completeTime">
              ({{ item.completeTime }})
            </p>
          </div>
          <p
            class="flow-split"
            :class="StepStatus[item.status]"
            v-if="index < flowList.length - 1"
            :key="'flow-split' + index"
          >
            <a-popover v-if="item.checkNote" placement="top">
              <template #content>
                {{ item.checkNote }}
              </template>
              <span class="flow-error-tip">失败原因</span>
            </a-popover>
          </p>
        </template>
      </template>
      <a-empty v-else class="flow-empty" description="暂无步骤信息" />
    </div>
    <!-- </a-spin> -->
    <!-- 折叠按钮 -->
    <div class="flow-fold" v-show="isShowFold">
      <caret-down-outlined
        @click="toggle(false)"
        class="fold-btn"
        v-if="isFoldStepList"
      />
      <caret-up-outlined @click="toggle(true)" class="fold-btn" v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import request from "@/lib/request";
import { message } from "ant-design-vue";
import { onMounted, Ref, ref, watch } from "vue";

interface IStepItem {
  checkNote: string;
  completeTime: string;
  executePersonName: string;
  status: number;
  stepId: string;
  stepName: string;
}

const props = defineProps({
  id: {
    type: String,
    required: false,
  },
  orderId: {
    type: String,
    required: true,
  },
  isShowFold: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["toggle"]);
const loading = ref(false);
const StepStatus = ["undo", "doing", "success", "error"];
const flowList: Ref<IStepItem[]> = ref([]);
const isFoldStepList = ref(true); // 是否点击折叠步骤列表
const stepList = ref();

watch(
  () => props.orderId,
  (val) => {
    if (val) {
      getFlowList();
    }
  }
);

// 获取工单流程节点列表
const getFlowListReq = (id: string) => {
  return request({
    baseURL: window.APP_CONFIG.taskBaseUrl,
    url: "/taskDeal/getFlowList?id=" + id,
    method: "GET",
  });
};

const getFlowList = async () => {
  loading.value = true;
  if (!props.orderId) {
    setTimeout(() => {
      getFlowList();
    }, 500);
    return;
  }
  try {
    const { code, data } = await getFlowListReq(props.orderId);
    if (code == 200) {
      flowList.value = data || [];
    } else {
      throw Error("Bad Request By Code:" + code);
    }
  } catch (e) {
    console.log(e);
    message.error("任务流程获取失败");
  } finally {
    loading.value = false;
  }
};

// 折叠
const toggle = (val: boolean) => {
  emit("toggle", val);
  isFoldStepList.value = val;
  if (!val) {
    setTimeout(() => {
      const el = stepList.value;
      if (el) {
        el.scrollLeft = el.offsetWidth + 1000;
      }
    });
  }
};

onMounted(() => {
  getFlowList();
});
</script>

<style lang="scss" scoped>
.flow-container {
  overflow: visible;
  position: relative;
  transition: height 0.15s ease-in-out;

  .flow-list {
    height: 150px;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-wrap: wrap;
    overflow: auto;
    transition: all 0.2s;

    .flow-split {
      margin: 0 10px;
      width: 75px;
      height: 3px;
      position: relative;

      &.undo {
        background-color: $--cas-text4;
      }

      &.doing {
        background-color: $--cas-color2;
      }

      &.success {
        background-color: $--cas-color11;
      }

      &.error {
        background-color: $--cas-color9;
      }

      .flow-error-tip {
        cursor: pointer;
        width: 4em;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -120%);
        color: $--cas-color9;
      }
    }

    .flow-item {
      flex-shrink: 0;
      height: 100%;
      text-align: center;
      color: $--cas-text3;

      &.undo {
        .flow-icon {
          background-color: $--cas-text4;
        }

        .step-name {
          color: $--cas-text4;
        }
      }

      &.doing {
        .flow-icon {
          background-color: $--cas-color2;
        }

        .step-name {
          color: $--cas-color2;
        }
      }

      &.success {
        .flow-icon {
          background-color: $--cas-color11;
        }

        .step-name {
          color: $--cas-color11;
        }
      }

      &.error {
        .flow-icon {
          background-color: $--cas-color9;
        }

        .step-name {
          color: $--cas-color9;
        }
      }

      .flow-icon {
        display: inline-block;
        width: 3rem;
        height: 3rem;
        line-height: 3rem;
        margin-bottom: 5px;
        font-size: 1.4rem;
        color: #fff;
        border-radius: 50%;
        box-shadow: 3px 3px 5px rgba(127, 127, 127, 0.35);
      }
    }
  }

  .flow-empty {
    padding: 0;
  }

  .flow-fold {
    width: 100%;
    height: 10px;
    position: relative;
    color: #333;
    cursor: pointer;
    background-color: $--cas-color10;
    border-radius: 5px;

    .fold-btn {
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 9;
      font-size: 20px;
      font-weight: bold;
      width: 60px;
      height: 20px;
      border-radius: 3px;
      transform: translateX(-50%);
      background-color: $--cas-color10;
      box-shadow: 0px 6px 5px -3px rgba(127, 127, 127, 0.35);
    }
  }
}
</style>
