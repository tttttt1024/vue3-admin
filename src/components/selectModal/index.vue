<template>
  <a-modal class="node-modal" v-model:open="open" width="1500px" :maskClosable="false">
    <div class="centerContent df jcsb">
      <!-- 左 -->
      <div class="pipeChoose">
        <!-- title -->
        <div class="pipeTilte">{{ title.left }}</div>
        <!-- 左表格 -->
        <div class="station-box">
          <commomTable
            ref="pipeChooseLeft"
            :dataSource="dataSourceLeft"
            :columns="columnsLeft"
            tableUrl="/business/taskdeal/auditStations"
            :query="queryLeft"
            :isSelect="isSelect"
          >
            <template #top>
              <a-form class="searchForm df" layout="inline" :model="formStateLeft">
                <a-form-item>
                  <a-select
                    v-model:value="formStateLeft.stationLevel"
                    style="width: 140px"
                    allowClear
                    placeholder="请选择站场等级"
                  >
                    <a-select-option
                      v-for="(item, index) in levelArr"
                      :key="index"
                      :value="item.code"
                      >{{ item.name }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-input
                    v-model:value="formStateLeft.stationName"
                    placeholder="请输入站场"
                    style="width: 160px"
                    allow-clear
                  >
                  </a-input>
                </a-form-item>
                <a-form-item class="rightButtons">
                  <a-button type="primary" @click.stop="topSearchLeft"> 查询 </a-button>
                </a-form-item>
              </a-form>
            </template>

            <template #stationType="{ row }">
              <span>{{ formatStationType(row.stationType) }}</span>
            </template>
            <template #stationLevel="{ row }">
              <span>{{ formatStationLevel(row.stationLevel) }}</span>
            </template>
          </commomTable>
        </div>
      </div>
      <!-- 右 -->
      <div class="pipeChoose shadow-content2">
        <!-- title -->
        <div class="pipeTilte">{{ title.right }}</div>
        <!-- 右表格 -->
        <div class="station-box">
          <commomTable
            ref="pipeChooseRight"
            :dataSource="dataSourceRight"
            :columns="columnsRight"
            tableUrl="/business/taskdeal/auditStations"
            :query="queryRight"
            :isSelect="isSelect"
          >
            <template #top>
              <a-form class="searchForm df" layout="inline" :model="formStateRight">
                <a-form-item>
                  <a-select
                    v-model:value="formStateRight.stationLevel"
                    style="width: 140px"
                    allowClear
                    placeholder="请选择站场等级"
                  >
                    <a-select-option
                      v-for="(item, index) in levelArr"
                      :key="index"
                      :value="item.code"
                      >{{ item.name }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
                <a-form-item>
                  <a-input
                    v-model:value="formStateRight.stationName"
                    placeholder="请输入站场"
                    style="width: 160px"
                    allow-clear
                  >
                  </a-input>
                </a-form-item>
                <a-form-item class="rightButtons">
                  <a-button type="primary" @click.stop="topSearchRight"> 查询 </a-button>
                </a-form-item>
              </a-form>
            </template>
            <template #stationType="{ row }">
              <span>{{ formatStationType(row.stationType) }}</span>
            </template>
            <template #stationLevel="{ row }">
              <span>{{ formatStationLevel(row.stationLevel) }}</span>
            </template>
          </commomTable>
        </div>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click.stop="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import commomTable from '@/components/commomTable.vue'
// import { useRoute } from "vue-router";
import { getDictionary } from '@/api/examine'
import { formatStationType, formatStationLevel } from '@/lib/filter'

let props = defineProps({
  title: {
    type: Object,
    required: true,
  },
  isSelect: Boolean,
  taskId: String,
})
let queryLeft = reactive({
  delFlag: 1,
  pageNo: 1,
  pageSize: 15,
  stationLevel: null,
  stationName: null,
  taskIdStr: props.taskId,
})
let queryRight = reactive({
  delFlag: 0,
  pageNo: 1,
  pageSize: 15,
  stationLevel: null,
  stationName: null,
  taskIdStr: props.taskId,
})
const emit = defineEmits(['refreshStation'])

const open = ref<boolean>(false)

const showModal = () => {
  open.value = true
}
const handleOk = () => {
  open.value = false
  for (let key in formStateLeft) {
    queryLeft[key] = null
    formStateLeft[key] = null
  }
  for (let key in formStateRight) {
    queryRight[key] = null
    formStateRight[key] = null
  }
}
//获取站场等级\站场类型字典
const levelArr = ref([])
const typeArr = ref([])
const getDict = () => {
  getDictionary('STATION_LEVEL').then((res) => {
    if (res.code == 200) {
      // console.log(res);
      levelArr.value = res.data
    }
  })
  getDictionary('STATION_TYPE').then((res) => {
    if (res.code == 200) {
      console.log(res)
      typeArr.value = res.data
    }
  })
}
getDict()

// 左表单数据-------------------
const formStateLeft = reactive({
  stationLevel: null,
  stationName: null,
})

// 左表格数据
let columnsLeft = reactive([
  { title: '站场名称', dataIndex: 'name', width: 140 },
  { title: '所属作业区', dataIndex: 'orgName', width: 140 },
  {
    title: '站场等级',
    dataIndex: 'stationLevel',
    width: 120,
  },
  { title: '站场类型', dataIndex: 'stationType' },
])
let dataSourceLeft = reactive([])

// 左表单查询函数
const topSearchLeft = () => {
  console.log('查询条件', formStateLeft)
  for (let key in formStateLeft) {
    queryLeft[key] = formStateLeft[key] || null
  }
}

// 右表单数据
const formStateRight = reactive({
  stationLevel: null,
  stationName: null,
})
// 右表格数据
let columnsRight = reactive([
  { title: '站场名称', dataIndex: 'name', width: 140 },
  { title: '所属作业区', dataIndex: 'orgName', width: 140 },
  {
    title: '站场等级',
    dataIndex: 'stationLevel',
    width: 120,
  },
  { title: '站场类型', dataIndex: 'stationType' },
])
let dataSourceRight = reactive([])

// 右表单函数
const topSearchRight = () => {
  for (let key in formStateRight) {
    queryRight[key] = formStateRight[key] || null
  }
}

defineExpose({
  showModal,
})
watch(
  () => props.taskId,
  () => {
    if (props.taskId) {
      queryLeft.taskIdStr = props.taskId
      queryRight.taskIdStr = props.taskId
    }
  }
)
</script>

<style scoped lang="scss">
.centerContent {
  height: 600px;
  .pipeChoose {
    width: 49.9%;
    height: 100%;
    .pipeTilte {
      border-bottom: 1px solid #ccc;
      padding: 8px 4px;
      font-weight: bold;
    }
    .station-box {
      height: 550px;
      :deep(.commontable) {
        .ant-pagination {
          width: 100%;
          justify-content: center;
        }
      }
    }
    .searchForm {
      padding-bottom: 10px;
    }
    .myButtons {
      margin-right: 10px;
    }
    .rightButtons {
      margin: 0 4px;
    }
  }
  .shadow-content2 {
    margin-top: 0;
  }
  // 分页
  .ant-table-wrapper .ant-table-pagination.ant-pagination {
    width: 100%;
  }
  .ant-table-wrapper .ant-table-pagination-right {
    justify-content: center;
  }
}
:deep(.ant-cascader) {
  width: 180px;
}
</style>
