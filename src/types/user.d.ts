interface Permission {
  orgIds?: OrgId[]
  roles?: Roles[]
  appCode?: string;
  appName?: string;
  appNote?: string;
  attributeCode?: string;
  fatherOrgCode?: string;
  /**
   * 所属单位上级部门编号
   */
  fatherOrgId?: number; // int64
  fatherOrgName?: string;
  fatherOrgUid?: string;
  /**
   * 用户所属功能菜单
   */
  fun?: IFunConfig[];
  funCode?: string[];
  /**
   * Iam_token
   */
  iamToken?: string;
  /**
   * 唯一标识码
   */
  id?: number; // int64
  /**
   * 组织结构别名
   */
  orgAlias?: string;
  orgCode?: string;
  /**
   * 所属单位唯一标识码
   */
  orgId?: number; // int64
  /**
   * 所属部门级别
   */
  orgLevel?: number; // int32
  /**
   * 所属单位名称
   */
  orgName?: string;
  /**
   * 所属部门类型
   */
  orgType?: number; // int32
  orgUid?: string;
  /**
   * 联系电话
   */
  phone?: string;
  /**
   * 所属生产单位对象
   */
  productionOrg?: IProductionOrg;
  /**
   * 性别
   */
  sex?: number; // int32
  /**
   * token
   */
  token?: string;
  uid?: string;
  /**
   * 登陆账户
   */
  userAccount?: string;
  /**
   * 姓名
   */
  userName?: string;
  /**
   * 用户类型
   */
  userType?: number; // int32
}
interface OrgId {
  attributeCode?: string
  id?: string
  lat?: number
  lon?: number
  orgAlias?: string | null
  orgName?: string
  orgCode?: string
  orgLevel?: number
  orgType?: number
  pid: string
  productionId: string
  productionUnit: string
  puid: string
  uid: string
}
interface Roles {
  id?: string
  roleCode?: string
  roleName?: string
}


/**
   * 组织机构信息
   */
interface IProductionOrg {
  attributeCode?: string;
  /**
   * 组织机构id
   */
  id?: number; // int64
  lat?: number; // double
  lon?: number; // double
  /**
   * 组织结构别名
   */
  orgAlias?: string;
  /**
   * 组织机构编码
   */
  orgCode?: string;
  /**
   * 机构等级
   */
  orgLevel?: number; // int32
  /**
   * 组织机构名称
   */
  orgName?: string;
  /**
   * 所属部门类型
   */
  orgType?: number; // int32
  /**
   * 上级机构id
   */
  pid?: number; // int64
  productionId?: number; // int64
  productionUnit?: string;
  puid?: string;
  uid?: string;
}