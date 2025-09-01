# form 组件参数说明

## form 组件参数说明

| 参数     | 说明         | 类型   | 默认值 |
| -------- | ------------ | ------ | ------ |
| ruleForm | 表单数据     | object | {}     |
| ruleForm | 表单数据     | object | {}     |
| itemList | 表单项       | array  | []     |
| rules    | 表单验证规则 | object | {}     |

### 示例

```html
<template>
  <updateForm
    :rule-form="formData"
    :itemList="itemList"
    :rules="rules"
    ref="commonFormRef"
  >
  </updateForm>
</template>

<script lang="ts" setup>
  import updateForm from "@/components/form/index.vue";

  const formData = ref({ model: "1" });

  const itemList = computed(() => {
    return [
      {
        label: "模板",
        name: "model",
        width: "100%",
        element: "a-select",
        required: true,
        optsName: "RESOURCE_TYPE",
        attrs: {
          placeholder: "请选择",
          options: [{ label: "模板1", value: "1" }],
        },
        on: {},
        formItemAttrs: {
          class: "w-full",
          colon: false,
        },
      },
    ];
  });

  /**
   * 根据列配置生成表单验证规则
   * @param {Array} columns 列配置数组，每个列配置对象中应包含require和dataIndex等属性
   * @returns {Object} 返回一个对象，键为dataIndex，值为对应的验证规则数组
   */
  function getRules(columns: any[]): object {
    const rules: any = {};
    // 遍历列配置，为需要验证的列生成验证规则
    columns.forEach((e) => {
      if (e.required) {
        // 如果列配置中require为true，则为该列添加验证规则
        rules[e.name] = [
          {
            required: true, // 规则要求该字段必填
            message: `${e.label}不能为空`, // 验证不通过时的提示信息
            trigger: e.element == "a-input" ? "blur" : "change", // 根据字段类型选择触发验证的事件
          } as any,
        ].concat(e.rules || []);
      }
    });
    return rules;
  }

  const rules = computed(() => {
    return getRules(props.itemList);
  });
</script>
```
