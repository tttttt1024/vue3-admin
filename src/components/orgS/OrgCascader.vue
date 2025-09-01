<template>
  <a-cascader :options="options" :value="selectedValue" :change-on-select="true" ref="orgsRef" @change="handleChange"
    @clear="handleClear" placeholder="请选择组织机构" v-bind="$attrs" style="width: 100%" :fieldNames="fieldNames" />
</template>

<script setup lang="ts">
import { ref, watch } from "vue";


const props = defineProps<{
  options: OrgOption[];
  orgCode2: string | undefined;
  orgCode3: string | undefined;
  orgName?: string;
  secOrgName?: string;
  initialValue?: string;
}>();

const emit = defineEmits<{
  (e: "update:orgCode2", value: string | undefined): void;
  (e: "update:orgCode3", value: string | undefined): void;
  (e: "update:orgName", value: string | undefined): void;
  (e: "update:secOrgName", value: string | undefined): void;
}>();

const fieldNames = {
          label: "orgName",
          value: "orgCode",
          children: "children",
        }
// 当前选中的值（路径）
const selectedValue = ref<string[]>([]);

// 标志位，确保只初始化一次
const inited = ref(false);

// 监听外部 v-model 变化，回显
watch(
  () => [props.orgCode2, props.orgCode3, props.initialValue],
  ([orgCode2, orgCode3, initialValue]) => {
    console.log({ orgCode2, orgCode3, initialValue, options: props.options })
    if (
      !inited.value &&
      initialValue &&
      !orgCode2 &&
      !orgCode3 &&
      props.options &&
      props.options.length
    ) {
      // 查找 initialValue 所在的层级
      const result = findOrgLevelAndPath(props.options, initialValue);
      if (result) {
        selectedValue.value = result.path;
        if (result.level === 2) {
          emit("update:orgCode2", String(initialValue));
          emit("update:orgCode3", undefined);
        } else if (result.level === 3) {
          // 找到二级父节点
          const parentCode = result.path[result.path.length - 2];
          emit("update:orgCode2", parentCode);
          emit("update:orgCode3", String(initialValue));
        } else if (result.level === 1) {
          emit("update:orgCode2", undefined);
          emit("update:orgCode3", undefined);
        }
        inited.value = true;
        return;
      }
    }
    // 后续正常回显逻辑
    if (orgCode3) {
      const path = findPathByOrgCode(props.options, orgCode3, 3);
      selectedValue.value = path || [];
      // 找到三级和二级的 orgName
      const org3 = findOrgByCode(props.options, orgCode3);
      const org2 = org3 && org3.parent ? org3.parent : findOrgByCode(props.options, orgCode2);
      emit("update:orgName", org3 ? org3.orgName : undefined);
      emit("update:secOrgName", org2 ? org2.orgName : undefined);
    } else if (orgCode2) {
      const path = findPathByOrgCode(props.options, orgCode2, 2);
      selectedValue.value = path || [];
      const org2 = findOrgByCode(props.options, orgCode2);
      emit("update:orgName", undefined);
      emit("update:secOrgName", org2 ? org2.orgName : undefined);
    } else {
      selectedValue.value = [];
      emit("update:orgName", undefined);
      emit("update:secOrgName", undefined);
    }
  },
  { immediate: true }
);

const orgsRef = ref();
// 选择变化
function handleChange(_value: string[], selectedOptions: OrgOption[] = []) {
  const last = selectedOptions[selectedOptions.length - 1];
  if (!last) {
    handleClear();
    return;
  }
  if (last.orgLevel === 2) {
    emit("update:orgCode2", last.orgCode);
    emit("update:orgCode3", undefined);
    emit("update:secOrgName", last.orgName);
    emit("update:orgName", undefined);
  } else if (last.orgLevel === 3) {
    const parent = selectedOptions.find((opt) => opt.orgLevel === 2);
    emit("update:orgCode2", parent ? parent.orgCode : undefined);
    emit("update:orgCode3", last.orgCode);
    emit("update:secOrgName", parent ? parent.orgName : undefined);
    emit("update:orgName", last.orgName);
  } else if (last.orgLevel === 1) {
    emit("update:orgCode2", undefined);
    emit("update:orgCode3", undefined);
    emit("update:secOrgName", undefined);
    emit("update:orgName", undefined);
    selectedValue.value = [last.orgCode];
  } else {
    emit("update:orgCode2", undefined);
    emit("update:orgCode3", undefined);
    emit("update:secOrgName", undefined);
    emit("update:orgName", undefined);
  }
}

// 工具函数：根据 orgCode 和 orgLevel 找到路径
function findPathByOrgCode(
  options: OrgOption[],
  code: string,
  level: number,
  path: string[] = []
): string[] | null {
  for (const item of options) {
    const newPath = [...path, item.orgCode];
    if (item.orgLevel === level && item.orgCode === code) {
      return newPath;
    }
    if (item.children) {
      const childPath = findPathByOrgCode(item.children, code, level, newPath);
      if (childPath) return childPath;
    }
  }
  return undefined;
}

// 新增工具函数：查找 orgCode 所在层级和路径
function findOrgLevelAndPath(
  options: OrgOption[],
  code: string,
  path: string[] = []
): { level: number; path: string[] } | null {
  for (const item of options) {
    const newPath = [...path, item.orgCode];
    if (item.orgCode === code) {
      return { level: item.orgLevel, path: newPath };
    }
    if (item.children) {
      const childResult = findOrgLevelAndPath(item.children, code, newPath);
      if (childResult) return childResult;
    }
  }
  return null;
}

function handleClear() {
  emit("update:orgCode2", undefined);
  emit("update:orgCode3", undefined);
  emit("update:secOrgName", undefined);
  emit("update:orgName", undefined);
  selectedValue.value = [];
}

function findOrgByCode(
  options: OrgOption[],
  code: string,
  parent: OrgOption | null = null
): (OrgOption & { parent?: OrgOption }) | null {
  for (const item of options) {
    if (item.orgCode === code) {
      return { ...item, parent };
    }
    if (item.children) {
      const found = findOrgByCode(item.children, code, item);
      if (found) return found;
    }
  }
  return null;
}
</script>
