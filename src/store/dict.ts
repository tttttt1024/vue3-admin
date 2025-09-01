
function getDict(_d:Record<string,any>){
}

import { defineStore } from 'pinia'


import { dictNamesAdd, dictMapAdd } from './dictAdd'

const dictNames = [{
  typeName: 'PIPE_GDCZ',
  label: '管道材质'
}, {
  typeName: 'TRANSFER_MEDIUM_INTERNAL',
  label: '输送介质'
}, {
  typeName: 'LAYING_METHOD',
  label: '敷设方式'
}, {
  typeName: 'YES_OR_NO',
  label: '是否'
},
...dictNamesAdd
  , {
  typeName: 'PIPE_MATERIAL',
  label: '材质'
}
  , {
  typeName: '有无',
  label: '有无'
}
  , {
  typeName: 'INSULATION_MATERIAL',
  label: '保温材料'
}
  , {
  typeName: 'PIPE_STATUS',
  label: '管道状态'
}, {
  typeName: 'STATION_LEVEL',
  label: '站场分类'
}, {
  typeName: 'PIPE_GHGQ',
  label: '管道高后果区'
},{
  typeName: 'REPORT_STATUS',
  label: '检测报告-报告状态'
}
]
// 1拟稿 2待审 3不同意 4同意 5已完成 6已变更 AuditStatusOpts
const AUDIT_STATUS_OPTS = [
  { name: '拟稿', code: 1 },
  { name: '待审', code: 2 },
  { name: '不同意', code: 3 },
  { name: '同意', code: 4 },
  { name: '已完成', code: 5 },
  { name: '已变更', code: 6 },
]
const AUDIT_STATUS_OPTS_MORE = [
  { name: '待提交', code: 1 },
  { name: '二级单位审核（计划）', code: 2 },
  { name: '实验院审核（计划）', code: 3 },
  { name: '二级单位驳回（计划）', code: 4 },
  { name: '实验院驳回（计划）', code: 5 },
  { name: '实验院通过（计划）', code: 6 },
  { name: '二级单位审核（实际）', code: 7 },
  { name: '实验院审核（实际）', code: 8 },
  { name: '二级单位驳回（实际）', code: 9 },
  { name: '实验院通过（实际）', code: 10 },
  { name: '完成（实际）', code: 11 },
  { name: '实验院驳回（实际）', code: 12 },
  { name: '二级单位审核（变更）', code: 96 },
  { name: '实验院审核（变更）', code: 97 },
  { name: '二级单位驳回（变更）', code: 98 },
  { name: '实验院通过（变更）', code: 99 },
  { name: '实验院驳回（变更）', code: 100 },
]

const YES_OR_NO_OPTS = [
  { name: '是', code: 1 },
  { name: '否', code: 0 },
]

// avtualStatus 进度状态
const AVTUAL_STATUS_OPTS = [
  { name: '滞后 ', code: 1 },
  { name: '正常', code: 2 },
  { name: '提前', code: 3 },
]

// avtualStatus 进度状态
const AUDIT_STATUS_OPTS_1 = [
  { name: '通过 ', code: 1 },
  { name: '驳回', code: 0 },
]

export default defineStore('dict', {
  state: () => ({
    dictNames,
    dictMap: {
      AUDIT_STATUS_OPTS,
      AUDIT_STATUS_OPTS_MORE,
      AVTUAL_STATUS_OPTS,
      YES_OR_NO_OPTS,
      AUDIT_STATUS_OPTS_1,
      ...dictMapAdd
    },
  }),
  actions: {
    // 请求字典列表
    async FETCH_DICT_LIST() {
      try {
        // 使用Promise.all()方法，同时获取多个字典
        const results = await Promise.all(
          this.dictNames.map(async ({ typeName }) => await getDict({ typeName }))
        );
        // 遍历获取到的字典，将它们存入dictMap
        results.forEach((result, index) => {
          this.dictMap[this.dictNames[index].typeName] = result?.data || [];
        });
      } catch (error) {
        console.error(error)
      }
    },
  },
})
