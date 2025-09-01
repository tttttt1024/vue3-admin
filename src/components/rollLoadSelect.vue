<template>
  <Select
    v-loading="loading>0"
    loading-text=""
    show-search
    placeholder="请选择"
    style="width: 100%"
    @popupScroll="handlePopupScroll"
    @search="searchDataList"
    :field-names="props.fieldNames"
    v-bind="$attrs"
    v-on="$attrs"
    :options="dataList"
    :optionFilterProp="props?.fieldNames?.label"
  >
  </Select>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch, useAttrs } from "vue";
import { Select } from "ant-design-vue";
import request from "@/lib/request";
import { removeDuplicateByField } from "@/lib/arrayUtils";


const loading = ref(0);
let currentPage = 1;
let pageSize = 20;
let totalRecord = 0; // totalRecord
let mineNameSearch = ""; // 模糊查询
const dataList = ref([]);

const attrs = useAttrs();

const props = defineProps({
  url: {
    type: String,
    default: "",
  },
  searchKey: {
    type: String,
    default: "name",
  },
  defaultParams: {
    type: Object,
    default: () => ({}),
  },
  defaultLoad: {
    type: Boolean,
    default: true,
  },
  fieldNames: {
    type: Object,
    default: () => {
      return {
        label: "name",
        value: "code",
      };
    },
  },
  // 新增：根据value获取单条数据的API
  getSingleDataUrl: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(['initData']);

const PARAMS = {};


function hasName(value:string){
  const exists = dataList.value.find(item => item[props.fieldNames.label] === value);
  console.warn({exists,dataList:dataList.value,value,name:props.fieldNames.name})
  return exists;
}

// 根据value获取单条数据
const getSingleData = async (value: string) => {
  const _url = props.getSingleDataUrl || props.url;
  if (!_url || !value) {
    return;
  }
  try {
    loading.value ++;
    const res = await request({
      url: _url,
      method: "POST",
      data: {
        [props.searchKey]: value,
        ...props.defaultParams,
      },
    });
    const data = res?.data?.data || []
    if (data && data.length > 0) {
      // 检查是否已经存在于dataList中
      if (!hasName(value)) {
        // 如果不存在，添加到dataList开头
        dataList.value.unshift(data[0]);
      }
    }
  } catch (error) {
    console.error("获取单条数据失败:", error);
  } finally {
    loading.value --;
  }
};

const toGetUnderlyingGreenMinePage = async () => {
  try {
    if (!props.url) {
      return;
    }
    loading.value ++;
    const { data } = await request({
      url: props.url,
      method: "POST",
      data: {
        pageNo: currentPage,
        pageSize: pageSize,
        [props.searchKey]: mineNameSearch,
        ...PARAMS,
        ...props.defaultParams,
      },
    });
    const _list = dataList.value.concat(data?.data || []);
    dataList.value = removeDuplicateByField(_list, props.fieldNames.value);
    !mineNameSearch&&checkAndLoadValue();
    totalRecord = Number(data.totalCount);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value --;
  }
};

const handlePopupScroll = (e: any) => {
  // 触底了就让页码page加1并判断是否小于总数，执行函数
  const { scrollHeight, scrollTop, clientHeight } = e.target;

  if (scrollHeight - scrollTop === clientHeight) {
    if (currentPage * pageSize <= totalRecord) {
      currentPage = currentPage + 1;
      toGetUnderlyingGreenMinePage();
    }
  }
};

let searchTumer: any = null;
const searchDataList = (e: any) => {
  // 防抖搜索
  if (searchTumer) {
    clearTimeout(searchTumer);
  }
  searchTumer = setTimeout(() => {
    mineNameSearch = e;
    currentPage = 1;
    dataList.value = [];
    toGetUnderlyingGreenMinePage();
  }, 800);
};

const initData = (val: string, k = "orgCode") => {
  mineNameSearch = "";
  currentPage = 1;
  dataList.value = [];
  PARAMS[k] = val;
  toGetUnderlyingGreenMinePage();
};

emit("initData", initData);

onMounted(() => {
  props.defaultLoad && toGetUnderlyingGreenMinePage();
});

watch(
  () => props.defaultParams,
  (val, oldVal) => {
    console.log(JSON.stringify(oldVal), JSON.stringify(val));
    if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
      searchDataList("");
    }
  },
  { deep: true, immediate: true }
);


// 或者使用nextTick来确保在DOM更新后检查
const checkAndLoadValue = async () => {
  const currentValue = (attrs.name as string)

  if (currentValue) {
    const exists = hasName(currentValue);
    if (!exists) {
      await getSingleData(currentValue);
    }
  }
};

onMounted(() => {
  props.defaultLoad && toGetUnderlyingGreenMinePage();
});
</script>

<style lang="scss" scoped></style>
