// 接口获取
const dictNamesAdd = [
  // 检测提取
  {
    typeName: 'CG_CONDITION_BASIS',
    label: '储罐提取条件依据',
  },
  {
    typeName: 'ZN_CONDITION_BASIS',
    label: '站内管道提取条件依据',
  },
  {
    typeName: 'ZW_CONDITION_BASIS',
    label: '站外管道提取条件依据',
  },
  // 站内修复管道
  {
    typeName: 'PROCESS_PIPELINE_PART',
    label: '修复管道部位',
  },
  // 站外提取
  {
    typeName: 'PIPE_SSXT',
    label: '所属系统',
  },
  {
    typeName: 'INNER_COATING_TYPE',
    label: '管线内防腐方式 ',
  },
  {
    typeName: 'OUT_COATING_TYPE',
    label: '管线外防腐方式 ',
  },
  {
    typeName: 'PIPE_TYPE',
    label: '管道类型 ',
  },
  {
    typeName: 'PIPE_LEVEL',
    label: '管道分类 ',
  },
  {
    typeName: 'PIPE_GDYJBH',
    label: '管道阴极保护 ',
  },
  {
    typeName: 'PIPE_YJBHLX',
    label: '阴极保护类型 ',
  },
  {
    typeName: 'PIPE_GFXDG',
    label: '高风险管段 ',
  },
  //站外管道失效数据基础信息
  {
    typeName: 'DISCOVERY_METHOD',
    label: '发现方式',
  },
  {
    typeName: 'invalid_clock',
    label: '失效时钟位置',
  },
  {
    typeName: 'FAILURE_MODE',
    label: '失效模式',
  },
  {
    typeName: 'FAILURE_TYPE',
    label: '失效类型',
  },
  {
    typeName: 'YES_OR_NO',
    label: '是否上报',
  },
  {
    typeName: 'AXIAL_POSITION',
    label: '失效轴向位置',
  },
  {
    typeName: 'MAINTENANCE_MANNER',
    label: '维修方式',
  },
  //年计划检测管道数据基础数据

  {
    typeName: 'PIPE_GDCZ',
    label: '管道材质类型',
  },
  {
    typeName: 'TRANSFER_MEDIUM_INTERNAL',
    label: '输送介质',
  },
  {
    typeName: 'PIPE_MATERIAL',
    label: '管道材质',
  },
  {
    typeName: 'INNER_COATING_TYPE',
    label: '管线内防腐方式',
  },
  {
    typeName: 'OUT_COATING_TYPE',
    label: '管线外防腐方式',
  },
  {
    typeName: 'INSULATION_MATERIAL',
    label: '管线保温材料类型',
  },
  {
    typeName: 'PIPE_GHGQ',
    label: '管道高后果区',
  },
  {
    typeName: 'PIPE_FSYS',
    label: '管线腐蚀因素',
  },
  {
    typeName: 'PIPE_TYPE',
    label: '管道类型',
  },
  {
    typeName: 'PIPE_LEVEL',
    label: '管道分类',
  },
  {
    typeName: 'PIPE_GDYJBH',
    label: '管道阴极保护',
  },
  {
    typeName: 'PIPE_YJBHLX',
    label: '阴极保护类型',
  },
  {
    typeName: 'PIPE_GFXDG',
    label: '高风险管段',
  },

  {
    typeName: 'DETECTION_REASON',
    label: '检测原因',
  },
  {
    typeName: 'DETECTION_EVALUATION_METHODS',
    label: '检测评价方法',
  },
  {
    typeName: 'YES_OR_NO',
    label: '是否确定为次年工作量',
  },

]
// 写死
const dictMapAdd = {}
export { dictNamesAdd, dictMapAdd }
