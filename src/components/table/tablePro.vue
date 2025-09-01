<template>
    <div ref="tableWrapRef" class="table-box" :id="props.id">
        <a-table class="table-content" :rowKey="(record: any) => record[props.rowKey]" :row-selection="rowSelection"
            :pagination="false" :scroll="{
                x,
                y: props.scrollY || state.scrollY,
                scrollToFirstRowOnChange: true,
            }" :columns="props.columns" :loading="state.loading" :data-source="state.tableData" :size="props.size"
            :bordered="props.bordered" v-bind="$attrs" v-on="props.tableEvents || {}">
            <template v-slot:headerCell="{ column }: any">
                <p :class="`table-title ${tableTitleClass(column)}`">
                    {{ column.title }}
                    <template v-if="column.sorted">
                        <div class="table-sort">
                            <CaretUpOutlined #999 @click="handleSort(column, 'asc')" :style="`width: 12px; height: 12px;cursor: pointer;color:${sortedInfoMap[column.dataIndex] === 'asc' ? '#999' : '#D9D9D9'
                                }`" />
                            <CaretDownOutlined @click="handleSort(column, 'desc')" :style="`width: 12px; height: 12px;cursor: pointer;color:${sortedInfoMap[column.dataIndex] === 'desc'
                                ? '#999'
                                : '#D9D9D9'
                                }`" />
                        </div>
                    </template>
                </p>
            </template>
            <template v-if="props.isCustomEmpty" v-slot:emptyText>
                <slot name="emptyText">
                    <div style="position: relative; min-height: 200px;">
                        <noData />
                    </div>
                </slot>
            </template>
            <template v-slot:bodyCell="{ column, record, index }">
                <template v-for="slotName of defaultSlots">
                    <slot v-if="
                        slotName === column?.dataIndex && column?.dataIndex !== 'index'
                    " :name="slotName" :column="column" :record="record" :row="record" :index="index">
                        <span
                            :title="parseDefaultValue(record, column, index) as string !== '--' ? parseDefaultValue(record, column, index) as string : ''"
                            v-if="column && column?.dataIndex !== 'index'">{{ parseDefaultValue(record, column, index)
                            }}</span>
                    </slot>
                </template>
                <span v-if="column && column?.dataIndex === 'index'">
                    {{ getRowIndex(index) }}
                </span>
            </template>
        </a-table>
        <a-pagination v-if="props.isPagination" v-model:current="state.pagination.current"
            v-model:page-size="state.pagination.pageSize" :total="state.pagination.total"
            :showQuickJumper="props.showQuickJumper" :showSizeChanger="props.showSizeChanger"
            @change="state.pagination.onChange" :show-total="state.pagination.showTotal"
            :position="state.pagination.position" :size="getPageSize()" v-bind="paginationDynamicParams" />
    </div>
</template>
<script lang="ts" setup>
import noData from '@/components/common/noData.vue';
import { TablePaginationConfig } from "ant-design-vue";
import request from "@/lib/request";
import { AxiosRequestConfig } from "axios";
import _ from "lodash";
import { SizeType } from "ant-design-vue/es/config-provider";

import {
    ref,
    onMounted,
    onBeforeUnmount,
    reactive,
    computed,
    onUnmounted,
    watch,
    nextTick,
} from "vue";
type IOrder = "asc" | "desc";

const props = withDefaults(
    defineProps<{
        columns: any[]; // 表格列的配置描述 列描述数据对象 sorted是否开启排序
        pagination?: false | TablePaginationConfig; // 分页器配置
        dataSource?: any[]; // 数据源
        slots?: string[]; // 插槽
        scrollY?: number | "auto"; // 滚动高度
        rowKey?: string; // 表格行键
        url?: string; // 请求地址
        baseURL?: string; // 请求地址
        reqMethods?: "GET" | "POST"; // 请求方法
        reqHeaders?: object; // 请求头
        query?: object; // 请求参数
        parseTableData?: Function; // 表格数据解析数据方法
        isPagination?: boolean; // 是否分页
        defaultLoad?: boolean; // 是否默认加载
        pageParams?: any; // 分页参数
        pageNo?: string | number; // 当前页码
        pageSize?: string | number; // 每页条数
        isSelected?: boolean; // 是否有选择框
        size?: SizeType; // 表格大小
        updateLoading?: Function; // 更新loading
        isCustomEmpty?: boolean; // 自定义空数据
        isClearSelectKeys?: boolean; // 是否清空选中
        currentKeys?: string[]; // 当前选中的keys
        currentKeysTable?: any[]; // 当前选中的keys表格
        id?: string; // 表格id
        tableEvents?: { [name: string]: Function }; // table事件
        showSizeChanger?: boolean; // 显示页码切换器
        showQuickJumper?: boolean; // 显示快速跳转
        defaultSort?: { dataIndex: string; order: IOrder }[];
        paginationDynamicParams?: any;
        paginationParams?: any;
        sortMode?: "single" | "multiple";
        withSort?: boolean;
        bordered?: boolean; // 是否显示边框
        paginationSize?: 'small' | 'default' | 'large'
        praseSort?: Function
        sortRefresh?: boolean;
        selectConfig?: any
    }>(),
    {
        defaultLoad: true,
        pagination: false,
        isPagination: false,
        isSelected: false,
        size: "small",
        isCustomEmpty: false,
        reqMethods: "POST",
        parseTableData: ({ data, code }: any) => {
            if (code == 200) {
                return { data: data?.data || [], total: data?.totalCount || 0 };
            }
            return {};
        },
        rowKey: "id",
        id:
            "BaseTable" +
            (function generateUniqueID() {
                var ts = new Date().getTime().toString();
                var parts = ts.split("").reverse();
                var id = "";
                for (var i = 0; i < 5; ++i) {
                    var index = Math.floor(Math.random() * parts.length);
                    id += parts[index];
                }
                return id;
            })(),
        isClearSelectKeys: true,
        showSizeChanger: true,
        showQuickJumper: true,
        paginationDynamicParams: {},
        sortMode: "multiple",
        withSort: false,
        paginationSize: 'large',
        praseSort: (data: any, sorts: any) => {
            const _data = data || {}
            _data.orderItemList = (sorts || []).map(
                (item: { column: string; order: IOrder }) => ({
                    column: item.column,
                    asc: item.order === "asc",
                })
            );
            return _data
        },
        sortRefresh: true,
    }
);

const tableWrapRef = ref();
const x = ref(0);
const y = ref(0);
let resizeObserver: any = null;

onMounted(() => {
    resizeObserver = new ResizeObserver(() => {
        nextTick(() => {
            const { width, height } = tableWrapRef.value.getBoundingClientRect();
            const tableHead = tableWrapRef.value.querySelector(".ant-table-header");
            const tableHeadHight = tableHead?.getBoundingClientRect().height || 60;
            x.value = width - 9;
            y.value = height - tableHeadHight;
        });
    });
    resizeObserver.observe(tableWrapRef.value, {
        attributeFilter: ["style"],
    });
});

onBeforeUnmount(() => {
    resizeObserver?.disconnect();
    resizeObserver = null;
});
const {
    baseURL = window.APP_CONFIG.baseUrl,
    reqHeaders = {},
    pageParams = {
        pageNo: 1,
        pageSize: 10,
        total: 0,
    },
    paginationParams = {
        // 总条数
        total: pageParams.total,
        // 跳转位置
        position: ["bottomCenter"],
        // 展示总共有几条数据
        showTotal: (total: number) => `共 ${pageParams.total ? pageParams.total : total} 条`,

        // 修改每页显示条数
        onChange: pageChange,
    },
} = props;

/**
 * @description: 自定义事件名
 */
const $emit = defineEmits([
    "currentChange",
    "sizeChange",
    "onData",
    "selectChange",
    "tableChange",
    "sorterChange",
    "radioChange",
    "paginationChange"

]);

interface TypeState {
    loading: boolean;
    tableData?: any[];
    pagination: TablePaginationConfig;
    selectedVlanIds: number[] | string[];
    scrollY: number | "auto";
    tableHeight: string;
    selectedRows: any[];
    abortController?: null | AbortController;
}

const state: TypeState = reactive({
    // 加载状态
    loading: false,
    // 表格数据
    tableData: props.dataSource,
    // 分页参数
    pagination: {
        // 当前页码
        current: pageParams.pageNo,
        // 每页显示的条数
        pageSize: pageParams.pageSize,
        position: paginationParams.position || ["bottomCenter"],
        // 修改每页显示条数
        onChange: paginationParams.onChange || pageChange,
        ...paginationParams,
    },
    // 选择的唯一key数组
    selectedVlanIds: [] as string[] | number[],
    // 选择的行
    selectedRows: [] as any[],
    // 滚动Y
    scrollY: 0,
    // 表格高度
    tableHeight: `calc(100% - 56px)`,
    abortController: null,
});

/**排序字段信息
 *
 */
const sortedInfo = ref<any>([]);

/**计算当前排序信息 ，方便排序按钮计算样式 */
const sortedInfoMap = computed(() => {
    const map: any = {};
    sortedInfo.value.forEach((item: any) => {
        map[item.column] = item.order;
    });
    return map;
});

/**监听默认排序列表 */
watch(
    () => props.defaultSort,
    (n) => {
        (n || []).forEach((item) => {
            handleSort({ dataIndex: item.dataIndex }, item.order, true);
        });
    },
    { deep: true, immediate: true }
);

/**表格排序 */
function handleSort(column: any, order: IOrder, isDefault = false) {
    if (!column.dataIndex || !order) return;
    if (props.sortMode === "single") {
        // 单选排序：只保留当前列
        if (
            sortedInfo.value.length === 1 &&
            sortedInfo.value[0].column === column.dataIndex &&
            sortedInfo.value[0].order === order
        ) {
            // 如果点的是同一个，取消排序
            sortedInfo.value = [];
        } else {
            sortedInfo.value = [{ column: column.dataIndex, order }];
        }
    } else {
        // 多选排序：原有逻辑
        const findIndex = sortedInfo.value.findIndex(
            (item: any) => item.column == column.dataIndex
        );
        if (findIndex > -1) {
            if (sortedInfo.value[findIndex].order == order) {
                sortedInfo.value.splice(findIndex, 1);
            } else {
                sortedInfo.value[findIndex].order = order;
            }
        } else {
            sortedInfo.value.unshift({ column: column.dataIndex, order });
        }
    }
    $emit(
        "sorterChange",
        (sortedInfo.value || []).map((item: { column: string; order: IOrder }) => {
            return {
                column: item.column,
                asc: item.order == "asc",
            };
        })
    );
    props.sortRefresh && !isDefault && refresh();
}

/**
 * @description: 页码变化事件
 */
function pageChange(page: number, pageSize: number) {
    $emit("paginationChange", {page, pageSize})
    currentChange(page);
    pageSize != state.pagination.pageSize && sizeChange(pageSize);
}

/**
 * @description: 获取数据
 */
const getData = _.debounce(
    async function () {
        try {
            if (!props.url) return;
            // 如果存在未完成的请求，先取消
            if (state.abortController) {
                state.abortController.abort();
            }
            // 创建新的 AbortController
            const controller = new AbortController();
            state.abortController = controller;
            let params: AxiosRequestConfig = {
                baseURL: baseURL,
                url: props.url,
                method: props.reqMethods,
                headers: reqHeaders,
                signal: controller.signal,
            };
            const page = {
                pageNo: state.pagination.current,
                pageSize: state.pagination.pageSize,
            };
            const query = {
                ...props.query,
            };
            const isAddSort = props.withSort && sortedInfo.value.length > 0;
            if (props.reqMethods === "GET") {
                params = {
                    ...params,
                    params: props.isPagination ? { ...query, ...page } : query,
                };
                if (isAddSort) {
                    params.params = props.praseSort(params.params, sortedInfo.value)
                }
            } else {
                params = {
                    ...params,
                    data: props.isPagination ? { ...query, ...page } : query,
                };
                if (isAddSort) {
                    params.data = props.praseSort(params.data, sortedInfo.value)
                }
            }
            if (props?.updateLoading) {
                props.updateLoading(true);
            } else {
                state.loading = true;
            }

            console.log("params", params);
            let dataS = await request(params);
            if (dataS.code == 200) {
                let { data, total } = props.parseTableData(dataS);
                if (props?.isClearSelectKeys) {
                    if (props.selectConfig?.type !== 'radio') onSelectChange([], []);
                    if (props.selectConfig?.type == 'radio') state.selectedVlanIds = []
                }
                nextTick(() => {
                    if (props?.currentKeys && props?.currentKeys?.length) {
                        onSelectChange(props?.currentKeys, props?.currentKeysTable);
                    }
                });
                state.tableData = data;
                state.pagination.total = total;
                $emit("onData", data);
            }
        } catch (error: any) {
            console.error(error);
            console.log(error);
            if (error?.name === "CanceledError") {
                console.log("Request canceled");
                return;
            }
        } finally {
            state.abortController = null;
            if (props?.updateLoading) {
                state.tableData = [];
                state.pagination.total = 0;
                props.updateLoading(false);
            } else {
                state.loading = false;
            }
        }
    }, 300
)
/**
 * 刷新
 */
function refresh(keepPage: boolean = false) {
    if (props.isPagination) {
        console.log('state.pagination', state.pagination)
        currentChange(
            keepPage && state.pagination.current ? state.pagination.current : 1
        );
    } else {
        getData();
    }
}
/**
 * 当前页码变化事件
 */
function currentChange(val: number) {
    state.pagination.current = val;
    getData();
}
/**
 * 每页条数变化事件
 */
function sizeChange(val: number) {
    state.pagination.pageSize = val;
    $emit("sizeChange", val);
    currentChange(1);
}
/**
 * @description: 选择变化事件
 * @param changeAbleRowKeys 选中的table全部数据数组
 * @param selectedRows  选中的table唯一Key数组
 */
const onSelectChange = (changeAbleRowKeys: any[], selectedRows: any) => {
    state.selectedVlanIds = changeAbleRowKeys;
    state.selectedRows = selectedRows;
    $emit("selectChange", changeAbleRowKeys, selectedRows);
};
/**
 * @description: 表格选择事件
 * @param record 选中的table一行数据
 * @param selected 选中状态
 * @param _selectedRows 选中的table全部数据数组
 */
const onSelect = (record: any, selected: any, _selectedRows: any) => {
    let arr = state.selectedVlanIds as any[];
    if (selected) {
        // onSelectChange(selectedRows?.map((e: any) => e[props.rowKey]), selectedRows)
        arr.push(record[props.rowKey] as string);
        state.selectedRows.push(record);
        onSelectChange(state.selectedVlanIds, state.selectedRows);
    } else {
        const arrI = arr.findIndex((e) => e === record[props.rowKey]);
        const rowI = state.selectedRows.findIndex(
            (e) => e[props.rowKey] === record[props.rowKey]
        );
        state.selectedRows.splice(rowI, 1);
        arr.splice(arrI, 1);
        onSelectChange(arr, state.selectedRows);
    }
};
/**
 * @description: 全选事件
 */
const onSelectAll = (
    selected: boolean,
    _selectedRows: any,
    _changeRows: any
) => {
    if (selected) {
        if (state.tableData) {
            const sRows = [
                ...(state.selectedRows || []),
                ...state.tableData.filter((r) =>
                    (state.selectedRows || []).every(
                        (r1) => r1[props.rowKey] !== r[props.rowKey]
                    )
                ),
            ];
            onSelectChange(
                sRows.map((e: any) => e[props.rowKey]),
                sRows
            );
        }
    } else {
        onSelectChange([], []);
    }
};

/**
 * @description 根据传入的值，设置表格选择配置
 */
const rowSelection = computed(() => {
    let result: {} | undefined = undefined;
    if (props.selectConfig?.type == 'radio') {
        result = {
            selectedRowKeys: state.selectedVlanIds,
            onChange,
            ...props.selectConfig
        }
        return result;
    }
    if (props.isSelected) {
        result = {
            selectedRowKeys: state.selectedVlanIds,
            // onChange: onSelectChange,
            onSelectAll: onSelectAll,
            hideDefaultSelections: true,
            onSelect: onSelect,
        };
    }
    return result;
});
// 单选设置
function onChange(selectedRowKeys, selectedRows) {
    console.log(selectedRowKeys, selectedRows);
    state.selectedVlanIds = selectedRowKeys
    $emit("radioChange", selectedRows, selectedRowKeys)
}

/**
 * 计算表格插槽
 */
const defaultSlots = computed(() => {
    if (props?.slots && props?.slots?.length > 0) {
        return props.slots;
    }
    function flattenColumns(columns: any[]) {
        let result: any[] = [];
        columns.forEach((column) => {
            if (column.dataIndex != "index") {
                result.push(column.dataIndex);
            }

            if (column.children && Array.isArray(column.children)) {
                result = result.concat(flattenColumns(column.children));
            }
        });
        return result;
    }
    return (props.columns && [...new Set(flattenColumns(props.columns))]) || [];
});
props.defaultLoad && refresh();

/**
 * 对表格内容显示进行转化：
 * 如果为null，则显示为'--'
 */

const parseDefaultValue = (record: Record<string, any>, column: Record<string, any>, index: number) => {
    const { dataIndex, customRender } = column;
    if (customRender) {
        return customRender({ record, column, index, text: record[dataIndex] });
    }
    const dataIndexs = dataIndex.split(".");
    let result = record;
    dataIndexs.forEach((element) => {
        if (result) {
            result = result[element];
        }
    });
    if (result == null) {
        return "--";
    }
    return result;
};
/**
 * 获取表格行索引
 * @param index
 * @returns number
 */
function getRowIndex(index: number) {
    const pageParams = {
        pageNo: state?.pagination?.current || 1,
        pageSize: state?.pagination?.pageSize,
    };
    if (pageParams && pageParams.pageSize) {
        return pageParams.pageSize * (pageParams?.pageNo - 1) + index + 1;
    }
    return index + 1;
}
/**
 * 特殊表头样式设置，isRequired为真时，设置必填样式
 */
function tableTitleClass(column: any) {
    const requiredClass = `${column?.isRequired ? "is-required" : ""}`;
    const sortedClass = `${column?.sorted ? "sorted-table-box" : ""}`;
    return `${requiredClass} ${sortedClass}`;
}
/**
 * 返回表格当前数据
 */
function getTableData() {
    return state.tableData;
}
/**
 * 返回表格当前选中数据
 */
function getSelectKeys() {
    return state.selectedVlanIds;
}
/**
 * 在resize事件中调用，重新计算表格滚动高度
 */
const doLayout = _.debounce(function () {
    nextTick(() => {
        const tableMain = (
            document.querySelector(`#${props.id} .table-content`) as HTMLDivElement
        )?.offsetHeight;
        const headerH = (
            document.querySelector(`#${props.id} .ant-table-header`) as HTMLDivElement
        )?.offsetHeight;
        state.scrollY = tableMain - headerH;
        fixTableScrollbar();
    });
}, 200);

/**
 * 表格内容不足滚动时，表头错位处理
 */
function fixTableScrollbar() {
    nextTick(() => {
        const table = document.querySelector(`#${props.id} .ant-table`);
        if (!table) return;
        const body = table.querySelector(".ant-table-body") as HTMLElement;
        const hasScroll = body && body.scrollHeight > body.clientHeight;
        const scrollbarCell = table.querySelector(
            ".ant-table-cell-scrollbar"
        ) as HTMLElement;
        const rightFixedFirst = table.querySelector(
            ".ant-table-cell-fix-right-first"
        ) as HTMLElement;
        console.log({ hasScroll });
        if (scrollbarCell) {
            scrollbarCell.style.display = hasScroll ? "" : "none";
        }
        if (rightFixedFirst) {
            const className = `right-0`;
            // rightFixedFirst.style.right = hasScroll ? `${scrollW}px` : '0'
            if (hasScroll && rightFixedFirst.classList.contains(className)) {
                rightFixedFirst.classList.remove(className);
            }
            if (!rightFixedFirst.classList.contains(className) && !hasScroll) {
                rightFixedFirst.classList.add(className);
            }
            console.dir({ rightFixedFirst });
        }
    });
}
doLayout();
window.addEventListener("resize", doLayout);
onUnmounted(() => {
    window.removeEventListener("resize", doLayout);
});

/**
 * 监听分页变化,设置表格高度
 */
watch(
    () => props.isPagination,
    (val) => {
        nextTick(() => {
            const paginationH = (
                document.querySelector(`#${props.id} .ant-pagination`) as HTMLDivElement
            )?.offsetHeight;
            state.tableHeight = val ? `calc(100% - ${paginationH}px)` : `100%`;
        });
    },
    { immediate: true }
);
/**
 * 监听传入的数据变化事件
 */
watch(
    () => props.dataSource,
    (val) => {
        state.tableData = val;
    },
    { immediate: true, deep: true }
);
/**
 * 表格数据变化时，抛出事件，并且重新布局
 */
watch(
    () => state.tableData,
    (val) => {
        $emit("tableChange", val);
        doLayout();
    },
    { immediate: true }
);

function getPageSize() {
    return props.paginationSize as "default" | "large" | undefined;
}

defineExpose({
    refresh,
    getTableData,
    doLayout,
    onSelectChange,
    getSelectKeys,
});
</script>

<style scoped lang="scss">
@mixin border-style {
    border-width: 1px;
    border-style: solid;
    border-color: rgba(229, 229, 229, 1)
}

@mixin page-w-h-style {
    min-width: 35px;
    height: 35px;
}

// @include mixin-name;

.table-box {
    height: 100%;
    background-color: $--cas-general-white;
    display: block !important;
    width: 100%;

    .table-content {
        height: v-bind("state.tableHeight");
        overflow: auto;
    }

    :deep(.ant-pagination) {
        padding: 12px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        background-color: $--cas-general-white;
        gap: 5px;
        color: #999999;

        .ant-pagination-total-text {
            order: 3;
        }

        .ant-pagination-total-text,
        .ant-pagination-options-quick-jumper {
            font-family: "Arial Normal", "Arial", sans-serif;
            font-weight: 400;
            font-style: normal;
            font-size: 18px;
            color: #999999;
            height: 35px;
            line-height: 35px;
        }

        .ant-pagination-prev,
        .ant-pagination-next {

            @include page-w-h-style;
            @include border-style;

            .ant-pagination-item-link {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            svg {
                font-size: 20px;
                color: #B1B1B1;
            }
        }

        .ant-pagination-item {
            @include page-w-h-style;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 16px;
            color: #999999;
            @include border-style;

            a {
                color: #999999;
            }
        }

        .ant-pagination-item-active {
            background-color: $--cas-color1;
            border: none;

            a {
                color: #FFFFFF;
            }
        }

        .ant-pagination-options {
            .ant-select {
                height: 35px;

                .ant-select-selector {
                    height: 35px;

                    .ant-select-selection-item {
                        height: 35px;
                        line-height: 35px;
                    }
                }
            }
        }

        .ant-select-selection-item {
            color: #999999;
            font-size: 16px;
        }
    }

    :deep(.ant-table-thead),
    :deep(.ant-table-body) {

        td,
        th {
            border-color: #E4EEF5 !important;
            height: 50px;
        }
    }

    :deep(.ant-table-body) {
        overflow: auto !important;

        .ant-table-row:nth-child(2n+1) {
            background-color: $--cas-th-bg !important;

            &>.ant-table-cell-fix-left,
            &>.ant-table-cell-fix-right {
                background-color: $--cas-th-bg;
            }
        }

    }
}

.is-required {
    &:before {
        content: "*";
        color: $--cas-required--red;
    }
}

.sorted-table-box {
    padding-right: 12px;
}

.table-title {
    text-align: center;
    white-space: break-spaces;
    margin: 0;
    position: relative;
    color: #333;
    font-family: "Arial Negreta", "Arial Normal", "Arial", sans-serif;
    font-weight: 700;
    font-style: normal;
    font-size: 14px;

    .table-sort {
        position: absolute;
        display: flex;
        flex-direction: column;
        right: 0;
        top: 0;
        color: $--cas-color10;
    }
}

:deep(.ant-table-fixed-left) table,
:deep(.ant-table-fixed-right) table {
    width: min-content;
}

:deep(.ant-table-cell) {
    text-align: center;
}
</style>