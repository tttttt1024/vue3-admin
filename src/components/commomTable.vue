<template>
  <div ref="commontable" class="commontable">
    <div class="shadow-content table-content">
      <slot name="top"></slot>
      <a-table ref="table" :data-source="tableData" :locale="{ emptyText: '暂无数据' }" :loading="loading" size="middle"
        bordered :scroll="scroll" :custom-header-row="headerRow" :custom-row="rowClick" :pagination="pageConfig"
        :row-selection="isSelect
          ? {
            selectedRowKeys,
            onSelect: onSelect,
            onSelectAll: onSelectAll,
          }
          : null
        " :row-key="({ id }) => id" @change="pageChange">
        <!-- 表格前部插槽 -->
        <slot name="prepend"></slot>
        <!-- 索引 -->
        <a-table-column v-if="isIndex" title="序号" :width="50" align="center" :fixed="props.orderFixed"
          :custom-render="({ index }) => index + 1">
        </a-table-column>
        <!-- 普通列 -->
        <template v-for="(item, index) in columns" :key="index">
          <a-table-column :width="item.width || columnWidth(columns.length)" :title="item.title"
            :data-index="item.dataIndex" :align="item.align || 'center'" :ellipsis="true" :custom-cell="item.customCell"
            :fixed="item.fixed" :sorter="item.sorter || false">
            <template #default="scope">
              <!-- 插槽,插槽名为对应prop,不使用可不写插槽 -->
              <slot :name="item.dataIndex" :index="scope.$index" :column="scope.column" :row="scope.record"
                :index2="scope.index">
                <!-- 可编辑表格 -->
                <div v-if="editTable">
                  <!-- 当前单元格可编辑 -->
                  <a-form v-if="scope.record[item.dataIndex].edit" :model="scope.record" :rules="inputRules">
                    <a-form-item :name="item.dataIndex" :style="{ marginBottom: formMarginBottom }">
                      <!-- 文字超出显示tooltip -->
                      <a-tooltip v-if="isShowTooltip" placement="top" :title="scope.record[item.dataIndex].value">
                        <a-input :id="'a-column' + index" v-model:value="scope.record[item.dataIndex].value"
                          :disabled="!canOperate" :allow-clear="allowClear" autocomplete="off"
                          :placeholder="item.dataIndex === 'yyfx' ? '请输入原因分析（勾选时，才能填报）' : ''" @change="inputChange"
                          @focus="inputFocus" @blur="scope.record[item.dataIndex].value = $event.target.value.trim()"
                          @mouseover="inputOnMouseOver($event)"></a-input>
                      </a-tooltip>
                      <!-- 文字未超出 -->
                      <slot v-if="!isShowTooltip" :name="item.dataIndex">
                        <a-input :id="'a-column' + index" v-model:value="scope.record[item.dataIndex].value"
                          :disabled="!canOperate" :allow-clear="allowClear" autocomplete="off"
                          :placeholder="item.dataIndex === 'yyfx' ? '请输入原因分析（勾选时，才能填报）' : ''" @change="inputChange"
                          @focus="inputFocus" @blur="scope.record[item.dataIndex].value = $event.target.value.trim()"
                          @mouseover="inputOnMouseOver($event)"></a-input>
                      </slot>
                    </a-form-item>
                  </a-form>
                  <!-- 当前单元格不可编辑 -->
                  <div v-else>
                    <a-tooltip v-if="isShowTooltip" placement="top" :title="scope.record[item.dataIndex].value">
                      <div class="text-overflow" @mouseover="inputOnMouseOver($event)">
                        {{ scope.record[item.dataIndex].value }}
                      </div>
                    </a-tooltip>
                    <div v-else class="text-overflow" @mouseover="inputOnMouseOver($event)">
                      {{ scope.record[item.dataIndex].value }}
                    </div>
                  </div>
                </div>
                <!-- 非编辑表格 -->
                <div v-else>
                  <a-tooltip v-if="isShowTooltip" placement="top" :title="scope.record[item.dataIndex]">
                    <div class="text-overflow" @mouseover="inputOnMouseOver($event)">
                      {{ scope.record[item.dataIndex] }}
                    </div>
                  </a-tooltip>
                  <div v-else class="text-overflow" @mouseover="inputOnMouseOver($event)">
                    {{ scope.record[item.dataIndex] }}
                  </div>
                </div>
              </slot>
            </template>
          </a-table-column>
        </template>
        <!-- 按钮组 -->
        <a-table-column v-if="operateBtn" :title="operateBtn.label || '操作'" :width="operateBtn.width || 150"
          align="center" fixed="right">
          <template #default="scope">
            <a-button v-for="(btn, index) in operateBtn.list" :key="index" :type="btn.type || 'text'"
              :size="btn.size || 'middle'" @click.stop="handleBtn(btn.key, scope.record)">
              {{ btn.label }}
            </a-button>
          </template>
        </a-table-column>
      </a-table>
      <slot name="bottom"></slot>
    </div>
    <!-- 添加表格行 -->
    <slot name="addBtn"></slot>
  </div>
</template>

<script setup lang="ts">
// import request from "@/utils/request";
import { reactive, ref, onMounted, computed, watch, watchEffect } from 'vue'
import { message } from 'ant-design-vue'
import request from '@/lib/request.js'
let isIs = ref(false)
interface Props {
  // 表格数据
  dataSource?: Array<any>
  // 表头数据
  columns?: Array<any>
  // 获取表格数据接口Api
  tableUrl?: string
  // 表格接口查询参数
  query?: any
  // 请求方法（默认POST）
  reqMethods?: string
  // 是否显示分页
  isPagination?: boolean
  // 是否显示筛选框
  isSelect?: boolean
  // 是否显示索引
  isIndex?: boolean
  // 是否是编辑表格
  editTable?: boolean
  // 编辑表格校验规则
  inputRules?: any
  // 是否可操作表格
  canOperate?: boolean
  // a-form-item的margin-bottom
  formMarginBottom?: string
  // 按钮组
  operateBtn?: any
  // 解析表格数据
  parseTableData?: any
  // 是否可滚动
  scroll?: any
  defaultSelectedRowKeys?: Array<string | number>
  load?: boolean
  RHeight?: number
  orderFixed?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  dataSource: () => [],
  columns: () => [],
  tableUrl: '',
  query: () => { },
  reqMethods: 'POST',
  isPagination: true,
  isSelect: false,
  isIndex: true,
  editTable: false,
  inputRules: () => { },
  canOperate: true,
  formMarginBottom: '0',
  operateBtn: () => { },
  parseTableData: () => {
    return ({ data, code }) => {
      if (code == 200) {
        return { data: data.data || data, total: data.totalCount }
      }
      return {}
    }
  },
  scroll: true,
  defaultSelectedRowKeys: () => [],
  load: false,
  RHeight: 160,
  orderFixed: true,
})
const spinning = ref<boolean>(true)
const tableData = ref([])
interface Emits {
  (e: 'handleBtn', key: string, row: unknown): void // 点击操作按钮
  (e: 'rowClick', record: unknown, index: number): void // 点击表格行
  (e: 'rowOnClick', record: unknown, index: number): void // 点击表格行
  (e: 'selectAll', selected: boolean, selectedRows: Array<object>, changeRows: Array<object>): void // 全选表格行
  (e: 'selectOne', record: object, selected: boolean, selectedRows: Array<object>): void // 单选表格行
  (e: 'sendData', data: any): void // 表格数据
  (e: 'loading'): void // 表格数据加载完
}
const emit = defineEmits<Emits>()
const commontable = ref<HTMLElement>()
// 加载动画
let loading = ref(false)
loading.value = props.load
// 清楚图标
let allowClear = ref(false)
// 提示框
let isShowTooltip = ref(false)
// 普通列宽度
let columnWidth = computed(() => (val: number) => {
  // 最小宽度200, (总宽度 - 序号 - 操作列) / 普通列数
  // 序号宽度
  let indexWidth = props.isIndex ? 100 : 0
  // 操作按钮宽度
  let operateWidth = props.operateBtn?.list.length ? props.operateBtn?.width || 150 : 0
  let averageWidth = (commontable?.value?.clientWidth - indexWidth - operateWidth) / val
  return averageWidth < 200 ? 200 : averageWidth
})
// 分页设置
let pageConfig = props.isPagination
  ? reactive({
    // 总数据
    total: 0,
    // 每页条数
    pageSize: 15,
    // 当前页
    current: 1,
    // 显示多少页
    showTotal: (total) => `共 ${total} 条`,
    // 是否显示跳转页面
    showQuickJumper: true,
    // 是否开启分页数据条数
    showSizeChanger: true,
    // 分页每页显示条数
    pageSizeOptions: ['15', '30', '60'],
    //居中
    style: {
      position: 'absolute',
      right: '50%',
      transform: 'translate(50%)',
    },
  })
  : false
// 表格分页变化
let pageNoQ = ref(null)
let pageSizeQ = ref(null)
function pageChange(pagination) {
  let { current, pageSize } = pagination
  console.log(current, pageSize)
  console.log(pageConfig)
  pageConfig['current'] = current
  pageConfig['pageSize'] = pageSize
  pageNoQ.value = null
  pageSizeQ.value = null
  getTableData()
}

// 表格头部样式
function headerRow() {
  return { class: 'header-row' }
}
function inputChange(e) {
  console.log(e, 'inputChange')
}
// 后续修改
function inputFocus() {
  allowClear.value = true
}
// 判断是否开启tooltip功能
function inputOnMouseOver(e) {
  // 容器宽度
  let boxWidth = e.target.offsetWidth
  let testWidth = e.target?.value?.length * 14 || e.target?.innerText.length * 14 || 0
  // 比较文字宽度和容器宽度
  if (testWidth > boxWidth) {
    isShowTooltip.value = true
  } else {
    isShowTooltip.value = false
  }
}

// 筛选表格-后续修改
const selectedRowKeys = ref([])
const table = ref(null)
const onSelect = (record, selected, selectedRows) => {
  if (selected) {
    if (!selectedRowKeys.value.includes(record.id)) {
      selectedRowKeys.value.push(record.id)
    }
  } else {
    const index = selectedRowKeys.value.indexOf(record.id)
    if (index !== -1) {
      selectedRowKeys.value.splice(index, 1)
    }
  }
  emit('selectOne', record, selected, selectedRows)
}
const onSelectAll = (selected, selectedRows, changeRows) => {
  if (selected) {
    changeRows.forEach((row) => {
      if (!selectedRowKeys.value.includes(row.id)) {
        selectedRowKeys.value.push(row.id)
      }
    })
  } else {
    changeRows.forEach((row) => {
      const index = selectedRowKeys.value.indexOf(row.id)
      if (index !== -1) {
        selectedRowKeys.value.splice(index, 1)
      }
    })
  }
  // console.log('changeRows', changeRows)
  // console.log('selected', selected)
  // console.log('selectedRows', selectedRows)
  emit('selectAll', selected, selectedRows, changeRows)
}

// 获取表格高度
// let scroll: object | boolean = true
let scroll = ref<any>()
let removeHeight = ref(160)
function getTableHeight() {
  // console.log('props.RHeight', props.RHeight)
  // console.log('commontable?.value?.clientHeight', commontable?.value?.clientHeight)

  removeHeight.value = props.RHeight
  scroll.value =
    props.scroll === false
      ? {
        x: '100%',
        y: '100%',
      }
      : {
        x: '100%',
        y: commontable?.value?.clientHeight - removeHeight.value, // 后续修改
      }
}
// 获取表格数据
async function getTableData() {
  // console.log('pageNoQ', pageNoQ)
  // console.log('pageConfig', pageConfig['current'])
  // console.log('props.query', props.query)

  if (!props.tableUrl) {
    isIs.value = true
    return
  }
  spinning.value = true
  let queryParams = {
    baseURL: window.APP_CONFIG.baseUrl,
    url: props.tableUrl,
    method: props.reqMethods,
  }
  if (props.reqMethods === 'GET') {
    // queryParams['params'] = {
    //   ...props.query,
    //   pageNo: pageNoQ.value ? pageNoQ.value : pageConfig['current'],
    //   pageSize: pageSizeQ.value ? pageSizeQ.value : pageConfig['pageSize'],
    // }
    queryParams.url = queryParams.url + props.query
  } else {
    if (pageConfig['current'] > 1 && tableData.value?.length == 1) {
      pageConfig['current'] = pageConfig['current'] - 1
    }
    queryParams['data'] = {
      ...props.query,
      pageNo: pageNoQ.value ? pageNoQ.value : pageConfig['current'],
      pageSize: pageSizeQ.value ? pageSizeQ.value : pageConfig['pageSize'],
    }
  }
  // console.log(queryParams, 'queryParams')
  try {
    loading.value = true
    let resData = await request(queryParams)
    // console.log(resData,'resData');
    if (resData) {
      let { data, total } = props.parseTableData(resData)
      // console.log('data', data)
      tableData.value = data || []
      // console.log('tableData.value', tableData.value, data)
      // console.log('props.isPagination', props.isPagination)
      if (props.isPagination) {
        pageConfig['total'] = total
      }
      // isIs.value = true
    }
    // emit('loading')
  } catch (error) {
    message.error('获取表格信息失败')
    // isIs.value = true
    loading.value = false
    // emit('loading')
  } finally {
    // loading.value = false
    isIs.value = true
    emit('loading')
  }
}

// 点击按钮
function handleBtn(key: string, row: unknown) {
  emit('handleBtn', key, row)
}
// 点击表格行
function rowClick(record, index) {
  return {
    onDblclick: () => {
      emit('rowClick', record, index)
    },
    onClick: () => {
      emit('rowOnClick', record, index)
    },
  }
}
defineExpose({ getTableData, pageConfig, getTableHeight, tableData, selectedRowKeys })

onMounted(async () => {
  loading.value = true
  tableData.value = props.dataSource
  getTableData()
  getTableHeight()
})
// 监听
watch(props.defaultSelectedRowKeys, (newVal, _oldVal) => {
  selectedRowKeys.value = [...newVal]
  // console.log('newVal', newVal)
  // console.log('oldVal', oldVal)
})
watch(props.query, () => {
  pageNoQ.value = props.query.pageNo || 1
  pageSizeQ.value = props.query.pageSize || 15
  pageConfig['current'] = pageNoQ.value
  pageConfig['pageSize'] = pageSizeQ.value
  // getTableData()
})
watchEffect(() => {
  // console.log('tableData.value', tableData.value.length, isIs.value)
  // console.log(3, isIs.value && tableData.value.length >= 0)

  // 用dataSource进行表格赋值时的loading
  if (isIs.value && tableData.value.length >= 0) {
    setTimeout(() => {
      loading.value = false
    }, 200)
  }
})
</script>

<style lang="scss" scoped>
.commontable {
  height: 100%;
  width: 100%;
  position: relative;

  .table-content {
    padding: 8px;
    overflow-x: auto;
    height: 100%;
  }
}



:deep(thead > tr:first-child > *:last-child),
:deep(thead > tr:first-child > *:first-child) {
  border-radius: 0 !important;
}

:deep(.ant-input-affix-wrapper > input.ant-input) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.ant-input) {
  &::placeholder {
    color: #ccc !important;
  }
}

.ant-pagination {
  width: 100% !important;
}

:deep(.ant-table-column-sorter) {
  color: #fff;
}

// 区别antdv.scss-看情况修改
:deep(.ant-table-pagination) {
  width: auto !important;
  left: auto !important;
  bottom: -12px !important;
}

:deep(.ant-table-header) {
  th {
    white-space: break-spaces;
  }
}
</style>
