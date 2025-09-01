import { defineStore } from "pinia";
import { getStatus, setStatus } from "@/api/examine";

export default defineStore("status", {
  state: () => {
    return {
      statusCode: "",
      workInstructionInfo: "",
      palnInstructionInfo:'',
      statusData:[],
      btnFlag:true,
      toggle:true,
    };
  },
  actions: {
    async getStatusCode(orderId) {
      const { code, data } = await getStatus(orderId);
      if (code === 200) {
        console.log('任务状态',data);
        
        this.statusCode = data[0].statusCode;
        this.statusData = data
        sessionStorage.setItem('taskStatus', data[1].statusCode);

        if(["4","5","6"].includes(data[1].statusCode)){
            this.btnFlag = false;
        }else{
            this.btnFlag = true;
        }
      }
    },

    async setStatusCode(orderId, num) {
      const { code, data } = await setStatus(orderId, num);
      if (code === 200 && data !== '设置失败') {
        this.statusCode = num;
      }
    },

    setToggel(val){
      console.log('setToggel',val);
       this.toggle = val
    },

    setInstructionInfo(val,type) {
      if(type == '2'){
        this.workInstructionInfo = val
      }
      if(type == '3'){
        this.palnInstructionInfo = val
      }
    },
  },
});
