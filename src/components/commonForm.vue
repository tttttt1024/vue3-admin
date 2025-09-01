<template>
  <div class="commonForm">
    <a-form ref="ruleForm" autocomplete="off" :rules="init.rules" :model="init.ruleForm" class="form-inline" layout="inline">
      <div
        v-for="(item, index) in init.itemList"
        :key="index"
        :style="{
          width: item.width || '100%',
          height: item.height || '50px',
        }"
      >
        <a-form-item :name="item.name">
          <div slot="label" :class="[isRequire(item.name), item.name, 'form-border', 'form-label']">
            {{ item.label }}
          </div>
          <div :class="[item.name + 'content', 'form-border', 'form-content']">
            <slot :name="item.name">
              <!-- 文字超出显示tooltip -->
              <a-tooltip v-if="isShowTooltip" placement="top" :title="init.ruleForm[item.name]">
                <a-input
                  v-model:value="init.ruleForm[item.name]"
                  :disabled="!(canOperate && (item.disabled ?? true))"
                  :placeholder="item.placeholder ? item.placeholder : ''"
                  @blur="init.ruleForm[item.name] = $event.target.value.trim()"
                  @mouseover="inputOnMouseOver($event)"
                ></a-input>
              </a-tooltip>
              <a-input
                v-else
                v-model:value="init.ruleForm[item.name]"
                :disabled="!(canOperate && (item.disabled ?? true))"
                :placeholder="item.placeholder ? item.placeholder : ''"
                @blur="init.ruleForm[item.name] = $event.target.value.trim()"
                @mouseover.native="inputOnMouseOver($event)"
                class="disabled-input"
              ></a-input>
            </slot>
          </div>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
interface Props {
  init?: any
  // 是否可操作表单
  canOperate?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  init: {
    rules: {},
    ruleForm: {},
    itemList: [],
  },
  canOperate: true,
})
// 提示框
let isShowTooltip = ref(false)
// 判断是否开启tooltip功能
function inputOnMouseOver(e) {
  // 容器宽度--预处理了中文字符显示宽度
  let boxWidth = e.target.offsetWidth
  let testWidth = e.target?.value?.length * 14 || e.target?.innerText.length * 14 || 0
  // console.log(e.target.value, boxWidth, testWidth)
  // 比较文字宽度和容器宽度
  if (testWidth > boxWidth) {
    isShowTooltip.value = true
  } else {
    isShowTooltip.value = false
  }
  // console.log(isShowTooltip.value);
}
// 必填项图标样式
function isRequire(name) {
  if (props.init.rules.hasOwnProperty(name) && props.init.rules[name][0].hasOwnProperty('required') && props.init.rules[name][0].required) {
    return 'required-icon'
  }
}
// 表单校验
const ruleForm = ref(null)
const validate = () => ruleForm.value.validate()
const validateFields = (NamePath) => ruleForm.value.validateFields(NamePath)
defineExpose({
  validate,
  validateFields,
})
</script>

<style lang="scss" scoped>
.commonForm {
  .form-border {
    border: 1px solid rgba(140, 198, 251, 1);
    margin: 0;
    padding: 3px;
  }
  .form-label {
    display: flex;
    align-items: center;
    height: 100%;
    width: 40%;
    line-height: 1.3;
    padding-left: 20px;
    background-color: #edf4fb;
  }
  .required-icon {
    &::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
  }

  .form-content {
    width: 60%;
  }
}
:deep(.ant-form-item) {
  width: 100%;
}
:deep(.ant-select-selector),
:deep(.ant-select),
:deep(.ant-input-affix-wrapper),
:deep(.ant-select-selection-search-input) {
  height: 100% !important;
}
:deep(.ant-select-single .ant-select-selector .ant-select-selection-item, .ant-select-single .ant-select-selector .ant-select-selection-placeholder) {
  line-height: 40px;
}
:deep(.ant-select-selection-placeholder) {
  line-height: 40px !important;
}
:deep(.ant-form-item-control-input-content) {
  display: flex;
  min-height: 50px;
  height: 100%;
}

:deep(.ant-form-item-explain-error) {
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding-top: 4px;
  position: absolute;
  top: 20%;
  right: 20px;
  // left: 44%;
  // width: 40px;
  // width: 54%;
}
:deep(.ant-input-affix-wrapper-disabled) {
  color: #f2f2f2;
}
:deep(.ant-input-disabled) {
  border: none;
  background-color: #fff;
  color: #000;
  cursor: auto;
}
:deep(.ant-input-affix-wrapper > input.ant-input) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
:deep(.ant-input) {
  height: 100%;
}
:deep(.disabled-input) {
  background-color: #fff;
  color: #000;
  cursor: auto;
}
</style>
