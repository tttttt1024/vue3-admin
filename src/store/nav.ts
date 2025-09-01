import { defineStore } from "pinia";

export default defineStore("nav", {
  state: () => {
    return {
      activeNavIndex: 0,
    };
  },
  actions: {
    setIndex(value: number) {
      this.activeNavIndex = value;
    },
  },
});
