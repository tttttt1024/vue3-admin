<template>
  <div class="PreviewPop">
    <a-modal
      v-model:open="open"
      width="100%"
      wrap-class-name="full-modal"
      :title="props.title"
      :footer="null"
      :zIndex="9999"
      @ok="handleOk"
    >
      <embed
        v-if="link"
        :src="link"
        type="application/pdf"
        width="100%"
        height="100%"
      />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch , onBeforeUnmount} from "vue";
const props = defineProps({
  title: String,
  src: String,
});
const open = ref<boolean>(false);

const showModal = () => {
  open.value = true;
};

const handleOk = (e: MouseEvent) => {
  open.value = false;
};
const link = ref(null);
watch(
  () => props.src,
  (newValue, oldValue) => {
    // console.log(newValue,'newValue');
    fetch(newValue)
      .then((response) => response.blob())
      .then((b) => {
        link.value = URL.createObjectURL(
          new Blob([b], {
            type: "application/pdf",
          })
        );
        // console.log('link.value',link.value);
      });
  },
  { immediate: true ,deep: true}
);

onBeforeUnmount(() => {
  URL.revokeObjectURL(link.value);
});

defineExpose({
  showModal,
});
</script>

<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(100vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
