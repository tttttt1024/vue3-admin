
import { createApp, Directive } from "vue";
import { createPinia } from "pinia";
import { nextTick } from "@vue/runtime-core";
import Antd from "ant-design-vue";
import App from "@/App.vue";
import router from "@/router/index";
import * as Icons from "@ant-design/icons-vue";
import contextmenu from "v-contextmenu";
import "ant-design-vue/dist/reset.css";
import "@/assets/style/index.scss";
import "v-contextmenu/dist/themes/default.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";


import * as directive from "@/directives";

import loading from "@/directives/loading/index";
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
import AuthBtn from "@/components/AuthBtn.vue";
import commonForm from "@/components/form/index.vue";
import foldTableLayout from "@/components/foldTableLayout.vue";
import searchBar from "@/components/searchBar.vue";
import rollLoadSelect from "@/components/rollLoadSelect.vue";
import orgSelect from "@/components/orgSelect.vue";
import orgSelectTree from "@/components/orgS/index.vue";
import operationAreaSelect from "@/components/operationArea/index.vue";
const app = createApp(App);
// app.component('micro-app', components.MicroMessageApp)
app.component("Auth-btn", AuthBtn);
app.component("commonForm", commonForm);
app.component("foldTableLayout", foldTableLayout);
app.component("searchBar", searchBar);
app.component("rollLoadSelect", rollLoadSelect);
app.component("orgSelect", orgSelect);
app.component("orgSelectTree", orgSelectTree);
app.component("operationAreaSelect", operationAreaSelect);
app.use(pinia);
app.use(Antd);
app.use(router);
app.use(contextmenu);

// 加载自定义指令
Object.keys(directive).forEach((key: string) => {
  app.directive(key, (directive as { [key: string]: Directive })[key]);
});
app.directive(`loading`, loading);
app.mount("#app");

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $icons: any;
  }
}
nextTick(() => {
  // 自定义类型申明

  // 配置全局对象
  app.config.globalProperties.$icons = Icons;
  for (const key in Icons) {
    app.component(key, (Icons as any)[key]);
  }
});
