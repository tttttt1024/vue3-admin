import useStore from "@/store";

const isSyysh = ()=>{
  const r = window.APP_CONFIG.scheduleRole.syysh
  console.log(window.APP_CONFIG.scheduleRole,r)
}
const isEjdwsh = ()=>{
  const r = window.APP_CONFIG.scheduleRole.ejsh
  console.log(window.APP_CONFIG.scheduleRole,r)
}
const isEjtb = ()=>{
  const r = window.APP_CONFIG.scheduleRole.tb
  console.log(window.APP_CONFIG.scheduleRole,r)
}


export default function useDataStatus() {
  const store = useStore();
  const userInfo = store.user.info;
  console.log(userInfo,isSyysh(),isEjdwsh(),isEjtb())
}