
import { defineStore } from 'pinia'
import { getPermission } from '@/api/base'
import { getProductOrgTree, getOrgTree as getOrgTreeApi } from '@/api/base'
import router from '@/router'


export default defineStore('user', {
  state: () => {
    return {
      info: {} as Permission,
      orgTree: [] as any[],
      secOrgName: "",
      orgName: "",
    }
  },
  actions: {
    async getUserInfo() {
      const { code, data } = await getPermission()
      if (code === 200) {
        this.info = data
        if (this.info.productionOrg.orgLevel == 1) { }
        if (this.info.productionOrg.orgLevel == 2) {
          this.secOrgName = this.info.productionOrg.orgName
        }
        if (this.info.productionOrg.orgLevel == 3) {
          this.orgName = this.info.productionOrg.orgName
        }
        //修改title标签
        document.title = data.appName
        //生成路由
        router.addDynamicRouter(data.fun)
      }
    },
    async getOrgTree() {
      const { status, data } = await getOrgTreeApi()
      if (status === 200) {
        this.orgTree = data
      }
    },
  },
  getters: {
    menuList(state: any) {
      function recursiveFilter(list: Array<IFunConfig>) {
        return list.filter((item) => {
          if (item.children && item.children.length) {
            item.children = recursiveFilter(item.children)
          }
          return item.funType === 0
        })
      }
      return recursiveFilter(state.info.fun)
    },
  },
})
