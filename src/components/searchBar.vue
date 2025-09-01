<template>
  <div class="search-box">
    <a-form layout="inline" :model="props.formData">
      <a-form-item
      v-if="props.formItem.length"
        v-for="item in props.formItem"
        :key="item.value"
        :label="item.label"
      >
        <slot :name="item.value" :item="item">
          <component
            :is="item.element"
            v-model:value="props.formData[item.value]"
            v-bind="item.attrs"
            v-on="item.event || {}"
          >
          </component>
        </slot>
      </a-form-item>
    </a-form>
    <div class="search-btns">
      <template v-for="item in props.btns" :key="item.key">
        <div v-if="item.show">
          <a-button
            v-bind="item.attrs"
            :loading="loading[item.key]"
            @click="btnClick(item)"
          >
            <slot :name="item.key" :item="item"
              ><span>
                <component :is="item.icon"></component>
                {{ item.label }}
              </span></slot
            >
          </a-button>
        </div>
      </template>
    </div>
    <slot name="searchBarRight"></slot>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
const props = withDefaults(
  defineProps<{
    formItem: ISearchFormItem[];
    btns: ISearchBtns[];
    formData: any;
  }>(),
  {}
);
const loading = reactive<any>({});

function btnClick(item: ISearchBtns) {
  loading[item.key] = true;
  const done = () => {
    loading[item.key] = false;
  };
  item.callFn(props.formData, done);
}
</script>

<style scoped lang="scss">
:deep(.ant-form-item-label) {
  label {
    color: rgba(0, 0, 0, 0.3);
  }
}
.search-box {
  width: 100%;
  flex-wrap: nowrap;
  overflow: auto;
  height: 50px;
  display: flex !important;
  display: -webkit-flex !important;
  align-items: center;
  -webkit-align-items: center;
  justify-content: space-between;
  -webkit-justify-content: space-between;

  :deep(form) {
    flex: none;
  }
  .search-btns {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    // align-items: center;
    overflow: auto;
    height: 50px;
    div + div {
      // margin-left: 5px;
    }
    & > div {
      height: 50px;
      display: flex;
      align-items: center;
      margin-left: 5px;
    }
  }
}
</style>
