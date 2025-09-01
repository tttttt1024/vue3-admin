<template>
  <base-iframe
    :src="router.currentRoute.value.meta.iframeSrc"
    :micro-app-code="router.currentRoute.value.meta.code"
    :state="router.currentRoute.value"
  ></base-iframe>
</template>

<script lang="ts" setup>
import BaseIframe from "@/components/iframe/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();
</script>
