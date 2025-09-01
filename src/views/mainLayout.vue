<template>
  <page-header></page-header>
  <main v-height="60">
    <router-view></router-view>
  </main>
</template>

<script lang="ts" setup>
import { defineComponent } from "vue";
import PageHeader from "@/components/header/index.vue";

defineComponent({
  PageHeader,
});
</script>
