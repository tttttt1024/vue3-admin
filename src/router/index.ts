import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import type {
  Router,
} from "vue-router";
import staticRouter from "./static";
import { getFlatArr } from "@/lib/tool";
import MainLayout from "@/views/mainLayout.vue";
import MenuLayout from "@/views/menuLayout.vue";
import Iframe from "@/views/iframeLayout.vue";
import { handleLoginLoss } from "@/lib/request";


const routes: Array<RouteRecordRaw> = [...staticRouter] as RouteRecordRaw[];

const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const token = (to.query.token as string) || localStorage.getItem("token");
  const jwt = (to.query.jwt as string) || localStorage.getItem("jwt");
  if (!jwt && !token) {
    handleLoginLoss();
  } else if (jwt) {
    localStorage.setItem("jwt", jwt);
    delete to.query.jwt;
  } else if (token) {
    localStorage.setItem("token", token);
    delete to.query.token;
  }
  next();

});


function iframeSrcToLocal(url: string): string {
  if (import.meta.env.DEV && __LOCAL__) {
    const reg = /^http:\/\/[^/]+/;
    url = url.replace(reg, window.location.origin);
  }
  return url;
}

function createRoute(data: IFunConfig, flag?: boolean): RouteRecordRaw | void {
  const { route, funCode, funName, reqPath, funType, hasCache, children } =
    data;
  if (funType !== 0) return;
  const menuChildNode = children.filter((item) => item.funType === 0);
  //children中没有funType=0的节点则视为没有菜单的页面
  const noMenuFlag = !menuChildNode.length;
  let redirect = "";
  if (menuChildNode[0]) {
    redirect = menuChildNode[0].route || "";
  }
  const obj = {
    path: route,
    name: funCode,
    redirect,
    meta: {
      code: funCode,
      name: funName,
      iframeSrc:
        typeof reqPath === "string" ? iframeSrcToLocal(reqPath) : reqPath,
      type: funType,
      cache: hasCache === 1 ? true : false,
    },
    component: flag && noMenuFlag ? Iframe : MenuLayout,
    children: flag
      ? getFlatArr(children, "children")
          .filter((item: IFunConfig) => item.funType !== 1)
          .map((c: IFunConfig) =>
            c.openMode === "self" ? createSelfRoute(c) : createRoute(c, flag)
          )
      : [],
  };
  return obj;
}

function createSelfRoute(
  data: IFunConfig,
  flag?: boolean
): RouteRecordRaw | void {
  const {
    route,
    funCode,
    funName,
    reqPath,
    funType,
    hasCache,
    children,
    note,
  } = data;
  let iframeSrc = reqPath;
  if (import.meta.env.DEV && note === window.origin && URL.canParse(reqPath)) {
    iframeSrc = note + new URL(reqPath).pathname;
  }
  if (funType !== 0) return;
  const menuChildNode = children.filter((item) => item.funType === 0);
  //children中没有funType=0的节点则视为没有菜单的页面
  let redirect = "";
  if (menuChildNode[0]) {
    redirect = menuChildNode[0].route || "";
  }
  const meta = {
    code: funCode,
    name: funName,
    iframeSrc,
    type: funType,
    cache: hasCache === 1 ? true : false,
  };
  console.warn("未找到组件：" + data.funCode + "请配置");
  console.warn({ d: createRoute(data) });
  return createRoute(data, flag);
  return {
    path: route,
    name: funCode,
    redirect,
    meta: {
      ...meta,
      isSelf: true,
    },
    children: flag
      ? getFlatArr(children, "children")
          .filter((item: IFunConfig) => item.funType !== 1)
          .map((c: IFunConfig) =>
            c.openMode === "self" ? createSelfRoute(c) : createRoute(c, flag)
          )
      : [],
  };
}
//根据用户权限生成动态路由
router.addDynamicRouter = (list: Array<IFunConfig>) => {
  const route: RouteRecordRaw = {
    path: "/main",
    name: "main",
    redirect: "",
    component: MainLayout,
    children: [],
  };
  list.forEach((item) => {
    if (!route.redirect && item.route) {
      route.redirect = item.route;
    }
    let res = null;
    if (item.openMode === "self") {
      res = createSelfRoute(item, true);
    } else {
      res = createRoute(item, true);
    }
    res && res.path && route.children?.push(res);
  });
  router.addRoute(route);
};

export default router;
