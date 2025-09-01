import { App, createApp } from "vue";
import Antd from "ant-design-vue";
import * as Icons from "@ant-design/icons-vue";
import "ant-design-vue/dist/reset.css";
import "@/assets/style/index.scss";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

const createModalComponent = (Modal) => {
  let modalApp: App<Element> | null = null;
  let dom: Element | null = null;
  let modalInstance: any = null; // 添加变量来存储组件实例
  dayjs.locale("zh-cn");

  const locale = zhCN;
  return {
    openModal: (options = {} as any) => {
      // 安全地移除已存在的容器
      const existingContainer = document.querySelector("#gjgx-model-container");
      if (existingContainer && document.body.contains(existingContainer)) {
        document.body.removeChild(existingContainer);
      }

      // 1. 创建 Vue 实例
      modalApp = createApp(Modal, {
        ...options,
        locale,
        close: () => {
          if (modalApp) {
            modalApp.unmount();
            modalApp = null;
          }
          if (dom && document.body.contains(dom)) {
            document.body.removeChild(dom);
            dom = null;
          }
          modalInstance = null;
        },
      });
      console.log({ modalApp });
      modalApp.use(Antd);
      for (const key in Icons) {
        modalApp.component(key, (Icons as any)[key]);
      }

      // 2. 创建渲染节点
      dom = document.createElement("div");
      dom.setAttribute("id", "gjgx-model-container");
      document.body.appendChild(dom);
      // 3. 将实例挂载到页面节点上
      modalInstance = modalApp.mount(dom);
      // 4. 调用 Modal 组件的 openModal 方法
      if (modalInstance && typeof modalInstance.openModal === "function") {
        modalInstance.openModal();
      }
      return modalApp;
    },
    close: () => {
      if (modalApp) {
        modalApp.unmount();
        modalApp = null;
      }
      if (dom && document.body.contains(dom)) {
        document.body.removeChild(dom);
        dom = null;
      }
      modalInstance = null;
    },
  };
};

export default createModalComponent;
