<template>
  <div class="detail_container">
    <div class="detail_top df jcsb">
      <span class="title">方案详情</span>
      <div class="detai_btns">
        <a-button class="myBtn" type="primary" :loading="downloadLoading" @click="download"
          >下载</a-button
        >
        <a-button class="myBtn" type="primary" @click="detailClose">关闭</a-button>
      </div>
    </div>
    <div class="detail_main df aic jcse">
      <div class="preview detail_shadow">
        <iframe title="预览" v-if="previewPath" :src="previewPath" style="width: 100%; height: 100%; border: none"></iframe>
      </div>
      <div class="list_mune detail_shadow1">
        <h3 style="border-bottom: 1px solid #ccc; padding: 10px">附件列表</h3>
        <div class="list">
          <div v-for="(item, index) in fileList" :key="index" @click="listItem(item, index)" class="list_item" :class="itemActive == index ? 'active' : ''">
            <FileWordOutlined style="color: #0b79df" />
            <span>{{ item.originalName }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import { xjDownload } from '@/api/plan'
import { downloadURL } from '@/lib/tool'
import { downLoadBlob } from '@/lib/file'
import { message } from 'ant-design-vue'

// 定义自定义事件：关闭详情页
const emit = defineEmits(['detailClose'])

// 定义组件接收的props
const props: rowPLan = defineProps({
  row: {
    type: Object,
    default: [],
  },
})

// 文件信息的ref实例，用于存储当前文件信息
let currentFile = ref<FileInfo | null>(null)
// 预览路径的ref实例，用于存储文件预览的路径
let previewPath = ref('')
// 文件列表的reactive实例，用于存储文件信息列表
let fileList: Array<FileInfo> = reactive([])
// 激活项的ref实例，用于追踪当前激活的项
let itemActive = ref(0)
// 下载加载中的ref实例，用于控制下载的加载状态
let downloadLoading = ref(false)
/**
 * 异步下载文件。
 * 根据配置（新疆或西南）使用不同的下载方法。
 * 无参数。
 * 无显式返回值，但可能隐含返回Promise<void>。
 */
const download = async () => {
  downloadLoading.value = true // 开始下载时显示加载状态

  let filename = currentFile.value.originalName // 获取文件原始名称

  // 根据应用配置决定下载方式
  if (window.APP_CONFIG.fileUnit == '新疆') {
    // 对于新疆单位，使用特定的下载方法
    let res = await xjDownload(currentFile.value.filePath)
    console.log('res', res)

    try {
      // 将Blob或ArrayBuffer下载到本地
      downLoadBlob(res.data, currentFile.value.originalName, { type: filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2) })
      message.success('正在下载，请查看右上方或左下角！')
    } catch (error) {
      // 下载失败时显示信息
      message.info('下载失败', error)
      downloadLoading.value = false // 结束下载加载状态
    }
    downloadLoading.value = false // 再次设置结束下载加载状态，此处可能冗余
  } else if (window.APP_CONFIG.fileUnit == '西南') {
    // 对于西南单位，使用不同的下载URL方法
    await downloadURL(currentFile.value.filePath, filename)
  }
  downloadLoading.value = false // 结束下载加载状态
}

/**
 * 触发关闭详情事件
 * 该函数没有参数
 * 也没有返回值
 * 主要通过调用 `emit` 方法，发出 `detailClose` 事件，通知父组件详情页需要关闭
 */
const detailClose = () => {
  emit('detailClose')
}
/**
 * 处理列表项点击事件。
 * @param {Object} item - 被点击的列表项对象。
 * @param {number} index - 列表项的索引。
 * 该函数主要负责更新当前文件预览路径和激活的列表项，并根据配置决定使用哪个单位的文件路径。
 */
const listItem = (item, index) => {
  // 取消当前预览路径的URL使用
  URL.revokeObjectURL(previewPath.value)
  // 更新当前文件信息
  currentFile.value = item
  // 根据应用配置，更新预览路径
  if (window.APP_CONFIG.fileUnit == '新疆') {
    previewPath.value = currentFile.value.previewPath
  } else if (window.APP_CONFIG.fileUnit == '西南') {
    // 为西南单位获取文件预览路径
    getUrl(item.previewPath)
  }

  // 更新激活的列表项索引
  itemActive.value = index
}
/**
 * 从给定的URL获取PDF文件并预览。
 * @param {string} url - PDF文件的URL地址。
 */
const getUrl = (url) => {
  // 使用fetch请求获取PDF内容
  fetch(url)
    .then((response) => response.blob()) // 将获取的内容转换为Blob格式
    .then((b) => {
      // 设置预览路径，以实现PDF的预览
      previewPath.value = URL.createObjectURL(
        new Blob([b], {
          type: 'application/pdf',
        })
      )
    })
}
/**
 * 监听props中的row属性变化，根据不同的originType来处理数据，并更新相关变量和状态。
 * 同时，根据window.APP_CONFIG.fileUnit的值，来设置previewPath的值。
 * 最后，将data的值复制给baseInfo。
 *
 * @param {Object} props.row - 更新时的行数据，包含各种属性，如originType、type、fileInfo等。
 */
watch(
  () => props.row,
  () => {
    console.log(213, props.row)
    fileList = props.row.fileInfo
    currentFile.value = props.row.fileInfo[0]

    // 根据文件单位配置，设置预览路径
    if (window.APP_CONFIG.fileUnit == '新疆') {
      previewPath.value = props.row.fileInfo[0].previewPath
    } else if (window.APP_CONFIG.fileUnit == '西南') {
      getUrl(props.row.fileInfo[0].previewPath)
    }
  },
  { deep: true, immediate: true }
)
// 字典转化
function getCodeLabel(dictionaryArray, code) {
  console.log('dictionaryArray', dictionaryArray)

  for (let i = 0; i < dictionaryArray.length; i++) {
    if (dictionaryArray[i].id === code) {
      return dictionaryArray[i].name
    }
  }
  return code // 如果未找到匹配的 label，返回 null 或者其他你认为合适的默认值
}
</script>
<style scoped lang="scss">
.detail_container {
  width: 100vw;
  height: 100vh;
  .detail_top {
    padding: 8px 16px;
    border-bottom: 1px solid #ccc;
    .title {
      font-size: 20px;
      font-weight: bold;
    }
  }
  .detail_main {
    width: 100vw;
    height: calc(100vh - 48px);
    .detail_shadow {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      padding: 8px 16px;
    }
    .detail_shadow1 {
      box-shadow: 0 0 10px rgba(145, 233, 249, 0.5);
      border-radius: 4px;
    }
    .preview {
      width: calc(100vw - 500px);
      height: calc(100vh - 100px);
    }
    .list_mune {
      width: 300px;
      height: calc(100vh - 100px);
      .list {
        font-size: 18px;
        padding: 8px 16px;
        height:calc(100% - 20px);
        overflow-y: auto;
        .list_item {
          cursor: pointer;
        }
        .active {
          background-color: #c8ecff;
        }
      }
    }
  }
}
</style>
