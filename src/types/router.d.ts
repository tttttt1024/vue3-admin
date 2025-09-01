import type { Router } from "vue-router";

declare module "vue-router" {
  export interface Router {
    addDynamicRouter?: Func;
  }
}
