interface IPipelinePageDTO {
  name?: string;
  pageSize?: number;
  pageNo?: number;
}

interface IOutsidePipeRepairDTO {
  dataCode?: string;
  taskYear?: string;
  [n: string]: any;
  outsidePipeRepair?: {
    planRepairPlanRemarks?: string;
    [n: string]: any;
  }
}

interface IOutsidePipeRepairDelDTO {
  ids: string[];
  remarks: string;
}
interface IOutsidePipeRepairBatchSubmitDTO {
  ids: string[];
}
/**
 * 站外管段基础信息
 */
interface IZWGDJCXXDTO {
  /**
   * 实际输量
   */
  actualCapacity?: number; // double
  /**
   * 管线防腐等级
   */
  antiGradeCode?: string;
  /**
   * areaGrade
   */
  areaGrade?: string;
  /**
   * 管线连接方式代码
   */
  atndModeCode?: string;
  /**
   * 起点场站阀室
   */
  beginCode?: string;
  /**
   * 起点阀室站场名称
   */
  beginName?: string;
  /**
   * 管线破漏次数（次）
   */
  blcs?: number; // int32
  /**
   * 施工单位
   */
  buildOrgName?: string;
  /**
   * 建设时间
   */
  buildTime?: string;
  /**
   * 业务板块
   */
  businessSegment?: string;
  /**
   * 管线保温层厚度（mm)
   */
  bwchd?: number; // double
  /**
   * 钢材级别
   */
  carbonSteelClass?: string;
  /**
   * 数据编码
   */
  code?: string;
  /**
   * 审核意见
   */
  dataAuditOpinion?: string;
  /**
   * 审核人
   */
  dataAuditPerson?: string;
  /**
   * 审核状态
   */
  dataAuditStatus?: number; // int32
  /**
   * 审核时间
   */
  dataAuditTime?: string;
  /**
   * 设计压力
   */
  desgnPressure?: number; // double
  /**
   * 设计输量
   */
  designCapacity?: number; // double
  /**
   * 设计CO2含量
   */
  designCarbonDioxide?: number; // double
  /**
   * 设计H2S含量
   */
  designHydrogenSulfide?: number; // double
  /**
   * 设计管线编号
   */
  designPipelineId?: string;
  /**
   * 设计温度
   */
  designTemp?: number; // double
  /**
   * 管道公称直径
   */
  diameter?: number; // double
  /**
   * dicOther
   */
  dicOther?: string;
  /**
   * 泄漏监测标志代码
   */
  discmonitorCode?: string;
  /**
   * 排流设施
   */
  drainageFacilitiesCode?: string;
  /**
   * 终点场站阀室
   */
  endCode?: string;
  /**
   * 终点阀室站场名称
   */
  endName?: string;
  /**
   * 管道外径
   */
  externalDiameter?: number; // double
  /**
   * 管线起点类型代码
   */
  fromTypeCode?: string;
  /**
   * 管线敷设方式
   */
  fsfs?: string;
  /**
   * 管线集输类型
   */
  gathTypeCode?: string;
  /**
   * 管道材质类型
   */
  gdcz?: string;
  /**
   * 管道阴极保护
   */
  gdyjbh?: string;
  /**
   * 高风险管段
   */
  gfxgd?: string;
  /**
   * A4数据编码
   */
  gisCode?: string;
  /**
   * 管线腐蚀因素
   */
  gxfsys?: string;
  /**
   * 焊后热处理标志代
   */
  heatTremntCode?: string;
  /**
   * 伴热方式
   */
  heatType?: string;
  /**
   * 管道高后果区
   */
  highConsequence?: string;
  /**
   * 编号
   */
  id?: number; // int64
  /**
   * 内防腐方式
   */
  innerCoatingType?: string;
  /**
   * 保温方式
   */
  insulationType?: string;
  /**
   * 检测时间
   */
  jcsj?: string;
  /**
   * 长度
   */
  length?: number; // double
  /**
   * 硫化氢含量（%）
   */
  lhqhl?: number; // double
  /**
   * 使用许可证号
   */
  licenseNo?: string;
  /**
   * mainCode
   */
  mainCode?: string;
  /**
   * 最大允许操作压力
   */
  maxOperationPressure?: number; // double
  /**
   * 管线制造方式
   */
  mopModeCode?: string;
  /**
   * 管线埋深（m）
   */
  ms?: number; // double
  /**
   * 管段名称
   */
  name?: string;
  /**
   * 所属油气田名称
   */
  oilfieldName?: string;
  /**
   * 运行压力
   */
  operatingPressure?: number; // double
  /**
   * 所属三级机构编码
   */
  orgCode?: string;
  /**
   * 所属三级机构名称
   */
  orgName?: string;
  /**
   * 外防腐方式
   */
  outCoatingType?: string;
  /**
   * 父级管道编码
   */
  parentCode?: string;
  /**
   * 父级管道名称
   */
  parentName?: string;
  /**
   * 清管装置
   */
  piggingDeviceCode?: string;
  /**
   * 管线终点
   */
  pipeEnd?: string;
  /**
   * 气田/油田管道  PIPE_KIND1气田2油田
   */
  pipeKind?: string;
  /**
   * 管道分类
   */
  pipeLevel?: string;
  /**
   * 管道材质
   */
  pipeMaterial?: string;
  /**
   * 管线起点
   */
  pipeStart?: string;
  /**
   * 管道类型
   */
  pipeType?: string;
  /**
   * 管线简称
   */
  pipelineSimpleName?: string;
  /**
   * 管线用途
   */
  pipelineUsageCode?: string;
  /**
   * 压力管道等级
   */
  pnstckLvlCode?: string;
  /**
   * 压力级别
   */
  presGradeCode?: string;
  /**
   * 近三件最高运行压力
   */
  pressureThree?: number; // double
  /**
   * 投产日期
   */
  prodDate?: string;
  /**
   * 阴保方式
   */
  protectType?: string;
  /**
   * 穿孔现象
   */
  punch?: string;
  /**
   * 穿孔次数
   */
  punchCount?: number; // double
  /**
   * 区块或区域
   */
  qk?: string;
  /**
   * 管线起终点高程差(m)
   */
  qzdgcc?: number; // double
  /**
   * 管道关系类别代码
   */
  relationshipCode?: string;
  /**
   * 备注
   */
  remarks?: string;
  /**
   * 备注1
   */
  remarksOne?: string;
  /**
   * 补口方式
   */
  repairedMouthType?: string;
  /**
   * 运行温度
   */
  runTemp?: number; // double
  /**
   * 所属二级机构编码
   */
  secOrgCode?: string;
  /**
   * 所属二级机构名称
   */
  secOrgName?: string;
  /**
   * 严密试压值(Mpa)
   */
  sevrPretstValue?: number; // double
  /**
   * 管线防护层材质
   */
  shldMtrlCode?: string;
  /**
   * 所属区块（油田）
   */
  ssqkmc?: string;
  /**
   * 所属系统
   */
  ssxt?: string;
  /**
   * 站库编号
   */
  stationId?: string;
  /**
   * 状态
   */
  status?: string;
  /**
   * 是否含硫
   */
  sulfurContaining?: string;
  /**
   * 管线终点类型代码
   */
  toTypeCode?: string;
  /**
   * 输送介质
   */
  transferMaterial?: string;
  /**
   * 壁厚
   */
  wallthick?: number; // double
  /**
   * 空间属性
   */
  wkt?: string;
  /**
   * 工艺档案
   */
  workmanshipRecordNo?: string;
  /**
   * 下次检测时间
   */
  xcjcsj?: string;
  /**
   * 阴极保护类型
   */
  yjbhlx?: string;
  /**
   * 管线近3年最高运行压力（MPa)
   */
  zgyxyl?: number; // double
}

/**
   * PmTaskInfoDTO
   */
interface IPmTaskInfoDTO {
  /**
   * 审核状态
   */
  auditStatus?: number; // int32
  /**
   * 二级审核审核状态
   */
  auditStatusEjsh?: number; // int32
  /**
   * 二级填报审核状态
   */
  auditStatusEjtb?: number; // int32
  /**
   * 实验院审核状态
   */
  auditStatusSyy?: number; // int32
  /**
   * 关联对象code
   */
  dataCode?: string;
  /**
   * 数据提交保存状态 1保存 2提交
   */
  dataStatus?: number; // int32
  /**
   * id
   */
  id?: number; // int64
  /**
   * ids
   */
  ids?: number /* int64 */[];
  /**
   * 是否通过 0驳回 1通过
   */
  isPass?: number; // int32
  /**
   * 审核意见
   */
  opinion?: string;
  /**
   * 站外管道修复进度
   */
  outsidePipeRepair?: PmOutsidePipeRepairDTO;
  /**
   * 管道基础信息
   */
  pipeline?: IZWGDJCXXDTO;
  /**
   * 业务年份
   */
  taskYear?: number; // int32
  /**
   * 业务类型：1-
   */
  type?: number; // int32
}
/**
 * PmOutsidePipeRepairDTO
 */
interface PmOutsidePipeRepairDTO {
  /**
   * 连续修复防腐层长度（m）
   */
  avtualAnticorrosiveLayerLength?: number; // double
  /**
   * 局部修复防腐层数
   */
  avtualAnticorrosiveLayerNum?: number; // int32
  /**
   * 审核意见
   */
  avtualAuditOpinion?: string;
  /**
   * 审核状态
   */
  avtualAuditStatus?: number; // int32
  /**
   * 审核时间
   */
  avtualAuditTime?: string;
  /**
   * 审核人
   */
  avtualAuditor?: string;
  /**
   * 修复工作量简述
   */
  avtualDescriptionEffort?: string;
  /**
   * 录入人
   */
  avtualEntryClerk?: string;
  /**
   * 录入时间
   */
  avtualEntryTime?: string;
  /**
   * 实际完成时间
   */
  avtualFinishTime?: string;
  /**
   * 更换标志桩（处）
   */
  avtualMarkNum?: number; // int32
  /**
   * 修改时间
   */
  avtualModificationTime?: string;
  /**
   * 修改人
   */
  avtualModifier?: string;
  /**
   * 实际修复管段长度（km）
   */
  avtualPipeLength?: number; // double
  /**
   * 修复进度备注
   */
  avtualRepairProgressRemarks?: string;
  /**
   * 局部换管（m）
   */
  avtualReplaceTubesLength?: number; // double
  /**
   * 管线覆土（m）
   */
  avtualSoilCoverLength?: number; // double
  /**
   * 进度状态
   */
  avtualStatus?: number; // int32
  /**
   * 局部修复管体数
   */
  avtualTubesNum?: number; // int32
  /**
   * id
   */
  id?: number; // int64
  /**
   * 变更原因
   */
  planAlterationReason?: string;
  /**
   * 变更人
   */
  planAlterationer?: string;
  /**
   * 计划完成时间
   */
  planFinishTime?: string;
  /**
   * 是否新增
   */
  planIsAdd?: number; // int32
  /**
   * 是否变更
   */
  planIsAlteration?: number; // int32
  /**
   * 计划修复管道长度
   */
  planPipeLength?: number; // double
  /**
   * 修复计划备注
   */
  planRepairPlanRemarks?: string;
  /**
   * 上传日期
   */
  planUploadTime?: string;
  /**
   * 上传人
   */
  planUploader?: string;
  /**
   * 进度任务ID
   */
  taskId?: number; // int64
  /**
   * 检测年度
   */
  year?: number; // int32
}

interface ZWGDJCJD extends IPmTaskInfoDTO{
  outsidePipeInspectionDTO?:OutsidePipeInspectionDTO
}
/**
 * 实际-ZWGDJCJD
 */
interface OutsidePipeInspectionDTO{
  actualOnsiteInspectTime:string
  actualExcavationVerifyTime:string
  actualInitialReportTime:string
  actualFinalReportTime:string
}