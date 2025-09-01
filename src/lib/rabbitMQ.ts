import Stomp from 'stompjs'
import useStore from "@/store";

let client = null;

export function connectMq() {
  return new Promise((resolve, reject) => {
    if (typeof WebSocket == 'undefined') {
      console.log('不支持websocket');
      reject();
    }
    const store = useStore();
    if (store.socket.socketReady) {
      resolve(true);
    } else {
      // 初始化weosocket
      const wsUrl = window.APP_CONFIG.socketConfig.URL;
      const ws = new WebSocket(wsUrl);
      // 获得Stomp client对象
      client = Stomp.over(ws);
      client.heartbeat.outgoing = 10000;
      client.heartbeat.incoming = 10000;
      client.debug = null;
      // 链接RabbitMQ
      client.connect(
        window.APP_CONFIG.socketConfig.username,
        window.APP_CONFIG.socketConfig.password,
        () => {
          console.log('MQ登陆成功');
          store.socket.SET_SOCKET_STATE(true);
          resolve(true)
        },
        () => {
          console.log('MQ登陆失败');
          store.socket.SET_SOCKET_STATE(false);
          reject();
        },
        'ImportHost'
      )
    }
  })
}

export { client }
