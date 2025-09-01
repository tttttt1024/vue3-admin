<template>
  <div v-loading="loading" ref="domBox" :style="{ width, height }">
    <div ref="domRef" id="chartDiv" :style="{ width, height }" />
  </div>
</template>

<script lang="ts" setup>


import { EventType } from "./chart";
import { replaceVarStrings, useTheme } from "./utils";
import * as echarts from 'echarts'
import request from "@/lib/request";
import { AxiosRequestConfig } from "axios";
import { nextTick, onMounted, onUnmounted, PropType, ref, watch } from "vue";

const props = defineProps({
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "100%",
  },
  lazy: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: null,
  },
  is3D: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    default: ''
  },
  query: {
    type: Object,
    default: () => ({})
  },
  baseURL: {
    type: String,
    default: window.APP_CONFIG.baseUrl
  },
  reqMethods: {
    type: String,
    default: 'POST'
  },
  defaultLoad: {
    type: Boolean,
    default: true
  },
  parseTableData:{
    type: Function,
    default: () => (data: Record<string,any>) => data
  },
  /**
   * const events=[{eventName:'click',handler:(params)=>{}},...]
   *  添加事件可选参数如下，具体参考echarts文档
   *  eventName: string
   *  query?: string | Object
   *  handler: Function
   *  context?: Object
   */
  events: {
    type: Array as PropType<EventType[]>,
    default: () => [],
  },
});
const { isDark } = useTheme();

const domRef = ref(null);
const domBox = ref(null);
let chartObj: any = null;
let observer: any = null; // dom 监听

onMounted(() => {
  if (!domRef.value) return;
  init();
  if (props.lazy) return;
  drawOption();
  observer = new ResizeObserver(() => {
    nextTick(() => {
      resize();
    });
  });
  nextTick(() => {
    domBox.value &&
      (observer as MutationObserver).observe(domBox.value, {
        attributeFilter: ["style"],
      });
  });
});



onUnmounted(() => {
  if (chartObj) {
    handleEvent("off");
    chartObj.dispose();
    chartObj = null;
  }
  observer?.disconnect();
});

watch(
  () => props.options,
  () => !props.lazy && drawOption(),
  {
    deep: true,
  }
);
watch(
  () => isDark.value,
  () => !props.lazy && drawOption()
);

// 绘制方法
const drawOption = (options = props.options) => {
  console.log({ options });
  if (!chartObj) return;
  if (!options) {
    chartObj.clear();
    chartObj.showLoading({
      text: "",
      color: "#409eff",
      textColor: "#000",
      maskColor: "rgba(255, 255, 255, .95)",
      zlevel: 0,
      lineWidth: 2,
    });
  } else {
    chartObj.hideLoading();
    chartObj.setOption(replaceVarStrings(options), { notMerge: true });
  }
};

// 初始化
const init = () => {
  chartObj = echarts.init(domRef.value) as any;
  handleEvent("on");
};

const loading = ref(false)

async function getData() {
  try {
    loading.value = true;
    if (!props.url) return;
    let params: AxiosRequestConfig = {
      baseURL: props.baseURL,
      url: props.url,
      method: props.reqMethods,
      headers: {},
    };
    console.log({ query: props.query })
    if (props.reqMethods === "GET") {
      params = {
        ...params,
        params: props.query,
      };
    } else {
      params = {
        ...params,
        data: props.query,
      };
    }
    let dataS = await request(params);
    props.parseTableData(dataS)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

if (props.defaultLoad) {
  getData()
}

//注册注销事件
function handleEvent(type: "on" | "off") {
  if (props.events.length) {
    props.events.forEach((item) => {
      const args =
        type === "on"
          ? [item.eventName, item.query, item.handler, item.context].filter(
            (arg) => arg
          )
          : [item.eventName];
      chartObj?.[type](...args);
    });
  }
}
// 重绘 自适应尺寸
const resize = () => {
  chartObj?.resize();
};



defineExpose({
  drawOption,
  resize,
  init,
  getData
});
</script>
