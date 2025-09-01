<template>
  <div>
    <a-modal v-model:open="state.visible" :title="props.modalTitle" width="30%" @cancel="onCancel">
      <p class="import-title df fdc">
        <span>提示:</span>
        <span style="text-indent: 1em">1.需要先下载模板；</span>
        <span style="text-indent: 1em">2.在模板中编辑；</span>
        <span style="text-indent: 1em">3.完成之后上传编辑的模板。</span>
      </p>
      <div class="import-content">
        <span class="import-label import-text">数据导入：</span>
        <a-upload
          v-model:file-list="state.fileList"
          name="file"
          :customRequest="() => {}"
          :max-count="1"
          @change="onChange"
          :showUploadList="false"
        >
          <a-button type="primary"> 点击上传 </a-button>
        </a-upload>
        <a-button
          class="import-text m-l-10"
          type="text"
          @click="exportTemplateDown"
          :loading="state.exporting"
        >
          <span style="text-underline-offset: 5px; text-decoration: underline; color: #05366f"
            >模板下载</span
          >
        </a-button>
      </div>
      <div class="flex flex_item_center">
        <div style="width: 80%">
          <div class="fileTemp flex" v-for="file in state.fileList" :key="file.uid">
            <div>
              <i class="el-icon-receiving" style="margin-right: 5px"></i>
              {{ file.name }}
            </div>
            <div>
              <close-outlined class="icon-close" @click="clearFiles" />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex flex_item_center">
          <a-button key="back" type="primary" @click="onCancel">取消</a-button>
          <a-button
            key="submit"
            type="primary"
            @click="handleOk"
            html-type="submit"
            :loading="state.modalUpdateIng"
            >提交</a-button
          >
        </div>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
const props = withDefaults(
  defineProps<{
    modalTitle?: string
    exportFn: Function
    importFn: Function
  }>(),
  { modalTitle: '导入' }
)
defineExpose({ openImportDialog, onCancel, updateModalUpdateIng, updateExporting })
const state = reactive({
  visible: false,
  exporting: false,
  importLoading: false,
  fileList: [] as any[],
  fileData: {},
  modalUpdateIng: false,
})
function onCancel() {
  state.visible = false
  clearFiles()
}
function openImportDialog() {
  state.visible = true
}
function clearFiles() {
  state.fileList = []
  state.fileData = {}
}
function onChange(e: any) {
  state.fileData = e
}
function handleOk() {
  if (!state.fileData) {
    message.warning('请先选择文件')
    return
  }
  console.log('state.fileData', state.fileData)

  props
    .importFn(state.fileData)
    .then((res) => {
      console.log('res', res)
      state.visible = false
    })
    .catch((err) => {
      console.log('err', err)
      state.visible = false
    })
}
function exportTemplateDown() {
  props.exportFn()
}
function updateModalUpdateIng(val: boolean) {
  state.modalUpdateIng = val
}
function updateExporting(val: boolean) {
  state.exporting = val
}
</script>

<style scoped lang="scss">
.import-title {
  color: red;
}

.import-content {
  display: flex;
  align-items: center;
  margin-top: 10px;

  & > .import-text {
    font-size: 18px;
    font-weight: 700;
    color: #000;
  }
}

.dialog-footer {
  display: flex;
  justify-content: center;
}

.fileTemp {
  margin-bottom: 5px;
  margin-top: 10px;
  padding: 5px;
  justify-content: space-between;

  &:hover {
    background-color: #f5f7fa;
    color: #699eff;
  }
}

.icon-close {
  cursor: pointer;
}
</style>
