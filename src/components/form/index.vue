<template>
  <div style="width: 100%" :class="`common-form-container ${props.border ? 'form-border' : 'form-not-border'
    } ${labelBold ? 'common-form-label-bold' : ''}`">
    <a-form layout="inline" ref="formRef" :rules="formRules" :model="props.ruleForm" autocomplete="off"
      :labelCol="labelCol" v-bind="$attrs">
      <template v-for="item in props.itemList" :key="item.name">
        <a-form-item :label="item.label" :name="getItemName(item)" v-bind="item.formItemAttrs || {}">
          <a-tooltip v-if="item.showTooltip" destroyTooltipOnHide color="rgba(255,255,255,1)"
          :overlayStyle="{
            zIndex:2
          }"
          >
            <template #title>
              <h5 :style="item.toolTipConfig.titleStyle">异常数据</h5>
              <span :style="item.toolTipConfig.contentStyle">{{
                item.toolTipConfig.showTooltipFn(item, props.ruleForm)
              }}</span>
            </template>
            <template v-if="
              (props.disabled || item.attrs?.disabled) && displayValueVisible
            ">
              <div class="display-value">
                {{ getDisplayValue(item, props.ruleForm[item.name]) }}
              </div>
            </template>
            <template v-else>
              <slot :name="item.name" :record="item" :value="props.ruleForm[item.name]">
                <component v-if="item.element" :is="item.element" v-model:value="props.ruleForm[item.name]"
                  v-bind="getAttrs(item)" v-on="item.on || {}">
                </component>
              </slot>
            </template>
          </a-tooltip>
          <template v-else>
            <template v-if="
              (props.disabled || item.attrs?.disabled) && displayValueVisible
            ">
              <div class="display-value">
                {{ getDisplayValue(item, props.ruleForm[item.name]) }}
              </div>
            </template>
            <template v-else>
              <slot :name="item.name" :record="item" :value="props.ruleForm[item.name]">
                <component v-if="item.element" :is="item.element" v-model:value="props.ruleForm[item.name]"
                  v-bind="getAttrs(item)" v-on="item.on || {}">
                </component>
              </slot>
            </template>
          </template>
        </a-form-item>
      </template>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
interface Props {
  ruleForm?: any;
  // 是否可操作表单
  disabled?: boolean;
  itemList?: any;
  rules?: any;
  border?: boolean;
  labelCol?: any;
  displayValueVisible?: boolean;
  labelBold?: boolean;
  generateRules?: boolean;
  type?: string;
}
const props = withDefaults(defineProps<Props>(), {
  ruleForm: {},
  rules: {},
  itemList: [],
  border: true,
  labelCol: {
    style: {
      width: "200px",
    },
  },
  displayValueVisible: true,
  type: ''
});

const formRules = computed(() => {
  if (props.generateRules && props.type !== 'view') {
    return getRules(props.itemList)
  }
  return props.rules
})
/**
 * 根据列配置生成表单验证规则
 * @param {Array} columns 列配置数组，每个列配置对象中应包含require和dataIndex等属性
 * @returns {Object} 返回一个对象，键为dataIndex，值为对应的验证规则数组
 */
function getRules(columns: any[]): object {
  const rules = {}
  // 遍历列配置，为需要验证的列生成验证规则
  columns.forEach((e) => {
    if (e.required) {
      // 如果列配置中require为true，则为该列添加验证规则
      rules[e.name] = [
        {
          required: true, // 规则要求该字段必填
          message: `${e.label}不能为空`, // 验证不通过时的提示信息
          trigger: e.element == 'a-select' ? 'change' : 'blur' // 根据字段类型选择触发验证的事件
        } as any
      ].concat(e.rules || [])
    }
  })
  return rules
}
function getAttrs(item: any) {
  const attrs = item.attrs || {};
  const style = item.attrs?.style || {};
  style.width = style.width || "100%";
  attrs.style = style;
  if (["a-input"].includes(item.element)) {
    attrs["maxlength"] = attrs.maxlength === undefined ? 50 : attrs.maxlength;
  } else if (["a-input-number"].includes(item.element)) {
    attrs["precision"] = attrs.precision === undefined ? 2 : attrs.precision;
    attrs["max"] = attrs.max === undefined ? 999999.99 : attrs.max;
  } else if (["a-textarea"].includes(item.element)) {
    attrs["maxlength"] = attrs.maxlength === undefined ? 150 : attrs.maxlength;
  }
  return {
    ...attrs,
    disabled: props.disabled || item.attrs.disabled,
  };
}

function getItemName(item: any) {
  if (item.formItemName !== undefined) {
    return item.formItemName;
  }
  return item.name;
}

function getDisplayValue(item: any, value: any) {
  // 判断是否是下拉框
  if (item.element === 'a-select') {
    // 取 fieldNames
    const fieldNames = item.attrs?.fieldNames || { label: 'label', value: 'value', options: 'options' };
    const options = item.attrs?.[fieldNames.options] || item.attrs?.options || [];
    // 支持多选
    if (Array.isArray(value)) {
      return value.map(val => {
        const opt = options.find((o: any) => o[fieldNames.value] === val);
        return opt ? opt[fieldNames.label] : val;
      }).join(', ');
    } else {
      const opt = options.find((o: any) => o[fieldNames.value] === value);
      return opt ? opt[fieldNames.label] : value;
    }
  }
  // 其他类型直接显示
  return value;
}

// 表单校验
const formRef = ref();
const validate = () => formRef.value.validate();
const validateFields = (NamePath?: any) =>
  formRef.value.validateFields(NamePath);
const clearValidate = (NamePath?: string | string[]) =>
  formRef.value.clearValidate(NamePath);
const resetFields = () => formRef.value.resetFields();
const getFormRef = () => formRef.value;
defineExpose({
  validate,
  validateFields,
  clearValidate,
  getFormRef,
  resetFields,
});

const controlMaxWidth = computed(() => {
  const { width = '0px' } = props.labelCol?.style || {};
  return `calc(100% - ${width})`;
});

</script>

<style scoped lang="scss">
:deep(.ant-form) {
  .ant-form-item {
    margin-bottom: 0;
    margin-inline-end: 0;

    .ant-form-item-row,
    .ant-form-row {
      height: 100%;
    }

    .ant-form-item-label {
      background-color: #edf4fb;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      min-height: 48px;

      label {
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: break-spaces;
        /* 确保文本在一行内显示 */
        text-overflow: ellipsis;
        /* 超出部分用省略号表示 */
        overflow: hidden;
        /* 超出部分隐藏 */
        padding: 0 8px;
        min-height: 48px;
        height: fit-content;
        font-family: "微软雅黑", sans-serif;
        font-weight: 400;
        color: #333333;
      }
    }

    .ant-form-item-control {
      text-align: center;
      padding: 8px;
      justify-content: center;
      max-width: v-bind(controlMaxWidth);
    }
  }
}

.form-border {
  :deep(.ant-form) {
    border-top: 1px solid #9ccdfb;
    border-left: 1px solid #9ccdfb;

    .ant-form-item {
      border-right: 1px solid #9ccdfb;
      border-bottom: 1px solid #9ccdfb;

      .ant-form-item-label {
        border-right: 1px solid #9ccdfb;
      }
    }

    .red-label .ant-form-item-label label {
      color: #f56c6c;
    }
  }
}

.form-not-border {
  :deep(.ant-form) {
    .ant-form-item-label {
      background-color: #fff;
    }
  }
}

.w-25 {
  width: calc(100% / 4);
}

.w-33 {
  width: calc(100% / 3);
}

.w-50 {
  width: calc(100% / 2);
}

.w-full,
.w-100 {
  width: calc(100%);
}
</style>
