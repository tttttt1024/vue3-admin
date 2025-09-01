import { defineStore } from "pinia";
import { RouteLocationNormalizedLoaded } from "vue-router";

export default defineStore("page", {
  state: () => {
    return {
      cacheMap: new Map(),
    };
  },
  actions: {
    resetChache() {
      this.cacheMap.clear();
    },
    addChache(route: RouteLocationNormalizedLoaded) {
      this.cacheMap.set(route.path, route.meta);
    },
    removeChache(route: string) {
      if (this.chache.length === 1) return false;
      this.cacheMap.delete(route);
    },
  },
  getters: {
    chache(state: any) {
      return Array.from(state.cacheMap);
    },
  },
});
