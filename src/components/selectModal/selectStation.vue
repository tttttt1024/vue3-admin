<template>
  <a-modal
    class="node-modal"
    v-model:open="open"
    width="1500px"
    :maskClosable="false"
  >
    <div class="centerContent df jcsb">
      <!-- 左 -->
      <div class="pipeChoose">
        <!-- title -->
        <div class="pipeTilte">站场列表</div>
        <!-- 左表格 -->
        <div class="station-box">
          <commomTable
            ref="pipeChooseLeft"
            :dataSource="dataSourceLeft"
            :tableUrl="tableUrl"
            :query="query"
            :columns="columnsLeft"
            :isSelect="true"
            @selectOne="selectOneLeft"
            @selectAll="selectAllLeft"
            :defaultSelectedRowKeys="defaultSelectedRowKeys"
          >
            <template #top>
              <a-form
                class="searchForm df"
                layout="inline"
                :model="formStateLeft"
              >
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
                    v-model:value="formStateLeft.name"
                    placeholder="请输入站场"
                    style="width: 160px"
                    allow-clear
                  >
                  </a-input>
                </a-form-item>
                <a-form-item class="rightButtons">
                  <a-button type="primary" @click.stop="topSearchLeft">
                    查询
                  </a-button>
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
        <div class="pipeTilte">已选站场列表</div>
        <!-- 右表格 -->
        <div class="station-box">
          <commomTable
            ref="pipeChooseRight"
            :dataSource="dataSourceRight"
            :columns="columnsRight"
            :isSelect="true"
            @selectOne="selectOneLeft"
            @selectAll="selectAllLeft"
            :defaultSelectedRowKeys="defaultSelectedRowKeys"
          >
            <template #top>
              <a-form
                class="searchForm df"
                layout="inline"
                :model="formStateRight"
              >
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
                  <a-button type="primary" @click.stop="topSearchRight">
                    查询
                  </a-button>
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
      <a-button type="primary" @click.stop="handleOk">取消</a-button>
      <a-button type="primary" @click.stop="saveStations">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, defineEmits, nextTick } from "vue";
import commomTable from "@/components/commomTable.vue";
// import { insertStations } from "@/api/examine";
import { message } from "ant-design-vue";
// import { useRoute } from "vue-router";
import { getDictionary } from "@/api/examine";
import { formatStationType, formatStationLevel } from "@/lib/filter";
import useStore from "@/store";
const { user } = useStore();

// console.log('user.info',user.info);

// const route = useRoute();
// console.log("orderId", route.query);

const emit = defineEmits(["refreshStation"]);

const open = ref<boolean>(false);

const showModal = (val) => {
  open.value = true;
};
const handleOk = () => {
  open.value = false;
  defaultSelectedRowKeys.value.splice(0, defaultSelectedRowKeys.value.length);
  dataSourceRight.splice(0, dataSourceRight.length);
  selectData = []
};
//获取站场等级\站场类型字典
const levelArr = ref([]);
const typeArr = ref([]);
const getDict = () => {
  getDictionary("STATION_LEVEL").then((res) => {
    if (res.code == 200) {
      // console.log(res);
      levelArr.value = res.data;
    }
  });
  getDictionary("STATION_TYPE").then((res) => {
    if (res.code == 200) {
      console.log(res);
      typeArr.value = res.data;
    }
  });
};
getDict();

// 选中数据
let selectData = [];
// 左表单数据-------------------
const formStateLeft = reactive({
  stationLevel: null,
  name: null,
});

// 左表格数据
let tableUrl = "/business/dcstationpt/page";
let query = reactive({
  name: "",
  orderItemList: [
    {
      asc: false,
      column: "update_time",
    },
  ],
  pageNo: 1,
  pageSize: 15,
  stationLevel: "",
  orgLevel: user.info.orgLevel || "",
  orgName: user.info.orgName || "",
});
let columnsLeft = reactive([
  { title: "站场名称", dataIndex: "name", width: 140 },
  { title: "所属作业区", dataIndex: "orgName", width: 140 },
  {
    title: "站场等级",
    dataIndex: "stationLevel",
    width: 120,
  },
  { title: "站场类型", dataIndex: "stationType" },
]);
let dataSourceLeft = reactive([]);

// 左表单查询函数
const topSearchLeft = () => {
  console.log("查询条件", formStateLeft);
  query.pageNo = 1;
  query.pageSize = 15;
  query.name = formStateLeft.name ? formStateLeft.name : null;
  query.stationLevel = formStateLeft.stationLevel
    ? formStateLeft.stationLevel
    : null;
};

// 右表单数据
const formStateRight = reactive({
  stationLevel: null,
  name: null,
});
// 右表格数据
let columnsRight = reactive([
  { title: "站场名称", dataIndex: "name", width: 140 },
  { title: "所属作业区", dataIndex: "orgName", width: 140 },
  {
    title: "站场等级",
    dataIndex: "stationLevel",
    width: 120,
  },
  { title: "站场类型", dataIndex: "stationType" },
]);
let dataSourceRight = reactive([]);
let defaultSelectedRowKeys = ref([]);
// 左单选中
const selectOneLeft = (record, selected, selectedRows) => {
  console.log("selectOneLeft", record, selected, selectedRows);

  if (selectedRows.some((row) => row?.id === record.id)) {
    // 如果 selectedRows 中有 record 对象，则将 record 添加进 selectData 中
    selectData.push(record);
  } else {
    // 如果 selectedRows 中没有 record 对象，则将 record 从 selectData 中删除
    const index = selectData.findIndex((item) => item.id === record.id);
    if (index !== -1) {
      selectData.splice(index, 1);
    }
  }
  // 遍历 dataSourceRight，删除不存在于 selectData 中的对象
  for (let i = dataSourceRight.length - 1; i >= 0; i--) {
    const obj = dataSourceRight[i];
    if (!selectData.some((item) => item.id === obj.id )) {
      dataSourceRight.splice(i, 1);
      defaultSelectedRowKeys.value.splice(i, 1);
    }
  }

  // 遍历 selectData，将不存在于 dataSourceRight 中的对象添加到 dataSourceRight 中
  for (const obj of selectData) {
    if (!dataSourceRight.some((item) => item.id === obj.id )) {
      dataSourceRight.push(obj);
      defaultSelectedRowKeys.value.push(obj.id);
    }
  }
  console.log("selectData", selectData);
  console.log("dataSourceRight", dataSourceRight);
  console.log("defaultSelectedRowKeys.value", defaultSelectedRowKeys.value);
};
// 左全选中
const selectAllLeft = (selected, selectedRows, changeRows) => {
  console.log("selectAllLeft", selectedRows);
  if (selected) {
    // 如果 selected 为 true，则将 selectedRows 中每个对象在 selectData 中不存在的对象添加进 selectData 中
    changeRows.forEach((row) => {
      const exists = selectData.some((item) => item.id === row.id);
      if (!exists) {
        selectData.push(row);
      }
    });
  } else {
    // 如果 selected 为 false，则将 selectedRows 中每个对象在 selectData 中存在的对象从 selectData 中删除
    changeRows.forEach((row) => {
      const index = selectData.findIndex((item) => item.id === row.id);
      if (index !== -1) {
        selectData.splice(index, 1);
      }
    });
  }
  // 遍历 dataSourceRight，删除不存在于 selectData 中的对象
  for (let i = dataSourceRight.length - 1; i >= 0; i--) {
    const obj = dataSourceRight[i];
    if (!selectData.some((item) => item.id === obj.id)) {
      dataSourceRight.splice(i, 1);
      defaultSelectedRowKeys.value.splice(i, 1);
    }
  }

  // 遍历 selectData，将不存在于 dataSourceRight 中的对象添加到 dataSourceRight 中
  for (const obj of selectData) {
    if (!dataSourceRight.some((item) => item.id === obj.id)) {
      dataSourceRight.push(obj);
      defaultSelectedRowKeys.value.push(obj.id);
    }
  }
  console.log("选中项keys", defaultSelectedRowKeys.value);
  console.log("selectData", selectData);
};
// 右表单函数
const topSearchRight = () => {
  console.log("查询条件", formStateRight, dataSourceRight, selectData);
  console.log(1, !formStateRight.stationLevel && !formStateRight.name);
  if (!formStateRight.stationLevel && !formStateRight.name) {
    dataSourceRight.splice(0);
    selectData.forEach((v) => {
      dataSourceRight.push(v);
    });
  }
  console.log(2, formStateRight.stationLevel !== null && !formStateRight.name);
  if (formStateRight.stationLevel && !formStateRight.name) {
    dataSourceRight.splice(0);
    selectData.forEach((v) => {
      if (v.stationLevel == formStateRight.stationLevel) {
        dataSourceRight.push(v);
      }
    });
  }
  console.log(3, formStateRight.stationLevel && formStateRight.name);
  if (formStateRight.stationLevel && formStateRight.name) {
    dataSourceRight.splice(0);
    selectData.forEach((v) => {
      if (
        v.stationLevel == formStateRight.stationLevel &&
        v.name.indexOf(formStateRight.name) !== -1
      ) {
        dataSourceRight.push(v);
      }
    });
  }
  console.log(4, !formStateRight.stationLevel && formStateRight.name);
  if (!formStateRight.stationLevel && formStateRight.name) {
    dataSourceRight.splice(0);
    selectData.forEach((v) => {
      if (v.name.indexOf(formStateRight.name) !== -1) {
        dataSourceRight.push(v);
      }
    });
  }
};

// 保存站场
const saveStations = async () => {
  console.log("selectData", selectData);
  if (selectData.length == 0) {
    message.info("站场未选取！");
    return;
  } else {
    emit("refreshStation", selectData);
    handleOk()
  }
};

defineExpose({
  saveStations,
  showModal,
});
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
