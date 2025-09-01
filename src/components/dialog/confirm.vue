<template>
  <a-config-provider :locale="locale">
    <a-modal v-model:open="open" :wrap-style="{ overflow: 'hidden' }" wrapClassName="custom-modal" width="520px">
      <template #title>
        <span class="custom-modal-title">{{ title }}</span>
      </template>
      <div class="custom-modal-body">
        <div class="custom-modal-icon">
          <template v-if="icon">
            <component :is="icon" v-if="typeof icon === 'object'" />
            <img v-else :src="icon" alt="icon" />
          </template>
        </div>
        <div class="custom-modal-content">
          <slot name="content">
            {{ content || tips }}
          </slot>
        </div>
      </div>
      <template #footer>
        <a-button type="primary" class="custom-modal-btn-confirm main" :loading="loading" @click="ok">{{ okText
        }}</a-button>
        <a-button class="custom-modal-btn-cancel" @click="cancel">{{ cancelText }}</a-button>
      </template>
    </a-modal>
  </a-config-provider>

</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = withDefaults(defineProps<{
  tips?: string,
  title?: string,
  icon?: string | object,
  okText?: string,
  cancelText?: string,
  content?: string,
  locale: any;
  close?: () => void;
}>(), {
  title: '确定',
  tips: '确定',
  okText: '确认',
  cancelText: '取消',
  icon: '',
  content: '',
});

const open = ref(false);
const loading = ref(false);
const emit = defineEmits(["ok", "cancel"]);

function openModal() {
  open.value = true;
}

async function ok() {
  loading.value = true;
  const done = () => {
    loading.value = false;
  };
  const done2 = () => {
    open.value = false;
    props.close && props.close();
  };
  emit("ok", done, done2);
}
function cancel() {
  emit("cancel");
  open.value = false;
  props.close && props.close();
}


defineExpose({ openModal });
</script>

<style lang="scss" scoped></style>