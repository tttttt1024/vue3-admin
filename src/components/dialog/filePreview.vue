<template>
  <div :class="[isDialog ? 'dialog-container' : '', 'file-preview-container']">
    <div class="file-preview-title" v-if="showTopBtn">
      <span class="custom-modal-title">{{ title }}</span>
      <div class="file-preview-btns">
        <a-button type="primary" class="custom-btn" @click="download">
          下 载
        </a-button>
        <a-button type="primary" class="custom-btn" @click="cancel">
          返 回
        </a-button>
      </div>
    </div>
    <div class="report-preview">
      <div v-if="previewUrl" :style="containerStyle">
        <iframe v-if="isXJPro" referrerpolicy="no-referrer" style="width: 100%; height: 100%; border: none" :src="previewUrl" title=""></iframe>
        <iframe v-else-if="fileType === 'pdf'" referrerpolicy="no-referrer" style="width: 100%; height: 100%; border: none"
          :src="previewUrl + '?response-content-type=application/pdf'" title=""></iframe>
        <VueOfficeDocx v-else-if="fileType === 'word'" :src="previewUrl" />
        <VueOfficeExcel v-else-if="fileType === 'excel'" :src="previewUrl" />
        <img v-else-if="fileType === 'image'" :src="previewUrl" alt="" />
      </div>
      <a-empty v-else description="暂无数据" class="empty-container" />
    </div>
  </div>
</template>

<script setup lang="ts">
import VueOfficeDocx from "@vue-office/docx";
import VueOfficeExcel from "@vue-office/excel";
import "@vue-office/docx/lib/index.css";
import "@vue-office/excel/lib/index.css";
import { downLoadBlob } from "@/lib/file";
import { downloadImageAsync, downloadURL } from "@/lib/tool";
import { xjDownload } from "@/api/plan";
import { ref } from "vue";
import { message } from "ant-design-vue";
import { getFileTypeByExtension, IFileType } from "@/lib/image";
import { preview } from '@/views/detectionReportAutoGeneration/api'

type IFileInfo = {
  originalName: string;
  filePath: any;
  scale: number;
};

const props = withDefaults(
  defineProps<{
    isDialog?: boolean;
    title?: string;
    locale?: any;
    fileInfo?: IFileInfo;
    close?: () => void;
    showTopBtn?: boolean;
  }>(),
  {
    isDialog: false,
    title: "预览",
    showTopBtn: false,
    scale: 1,
  }
);
const containerStyle = computed(() => ({
  transform: `scale(${props.fileInfo?.scale || 1})`,
  transformOrigin: "0 0",
  width: `${100 / (props.fileInfo?.scale || 1)}%`,
  height: `${100 / (props.fileInfo?.scale || 1)}%`,
  overflow: "auto",
}));
const open = ref(false);
const emit = defineEmits(["cancel"]);
const previewUrl = ref("");
const currentFile = ref<IFileInfo>({
  originalName: "",
  filePath: "",
  scale: 1,
});

const fileType = computed<IFileType>(() => {
  return getFileTypeByExtension(props.fileInfo?.filePath);
});

const downloadLoading = ref(false);

async function openModal() {
  open.value = true;
  if (props.fileInfo) {
    console.log({ fileInfo: props.fileInfo });
    if(isXJPro){
      let {code,data}= await preview({path:props.fileInfo?.filePath})
      if(code==200){
        previewUrl.value = data.path || "";
        currentFile.value = {...props.fileInfo,filePath:data.path}
        return
      }
    }
    previewUrl.value = props.fileInfo?.filePath || "";
    currentFile.value = props.fileInfo;
  }
}

const isXJPro = window.APP_CONFIG.fileUnit === "新疆";

function cancel() {
  emit("cancel");
  open.value = false;
  props.close && props.close();
}

async function download() {
  const filename = currentFile.value.originalName; // 获取文件原始名称
  // 根据应用配置决定下载方式
  if (isXJPro) {
    downloadLoading.value = true; // 开始下载时显示加载状态
    // 对于新疆单位，使用特定的下载方法
    let res = await xjDownload(currentFile.value.filePath);
    console.log("res", res);

    try {
      // 将Blob或ArrayBuffer下载到本地
      downLoadBlob(res.data, currentFile.value.originalName, {
        type: filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2),
      });
      message.success("正在下载，请查看右上方或左下角！");
    } catch (error) {
      // 下载失败时显示信息
      message.info("下载失败", error);
    } finally {
      downloadLoading.value = false; // 结束下载加载状态
    }
  } else if (window.APP_CONFIG.fileUnit == "西南") {
    // 对于西南单位，使用不同的下载URL方法
    fileType.value === "image"
      ? downloadImageAsync(currentFile.value.filePath, filename)
      : downloadURL(currentFile.value.filePath, filename);
  }
}

defineExpose({ openModal });
</script>

<style lang="scss" scoped>
.dialog-container {
  position: fixed;
  top: 0;
  left: 0;
}

.file-preview-container {
  width: 100%;
  height: 100%;
  z-index: 299;
  display: flex;
  flex-direction: column;
  background-color: #fff;

  .file-preview-title {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;

    span {
      font-size: 18px;
      font-weight: bold;
    }
  }

  .file-preview-btns {
    display: flex;
    gap: 5px;
  }

  .report-preview {
    flex: 1;
    height: calc(100% - 50px);

    // overflow: auto;
    .empty-container {
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
