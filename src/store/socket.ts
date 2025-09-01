import { defineStore } from "pinia";

export default defineStore("socket", {
  state: () => {
    return {
      socketReady: false,
    };
  },
  actions: {
    SET_SOCKET_STATE(flag: boolean) {
      this.socketReady = flag;
    },
  }
})