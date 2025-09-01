declare interface Window {
  APP_CONFIG: IAppConfig
}

declare let __LOCAL__: boolean

interface IAppConfig {
  [x: string]: any
  importExportUrl?: string
  taskUrl?: string
  baseUrl: string
  appCode: string
  webUrl: string
  loginBaseUrl: string
  listenMsg: boolean
  uploadUrl: string
  socketConfig: {
    URL: string
    username: string
    password: string
  }
  messageCenterPath: string
  missionTodoPath: string
}

interface IResponse {
  code: number
  data: any
  msg: string
}

interface IFunConfig {
  checked: string
  children: Array<IFunConfig>
  funCode: string
  funName: string
  funType: number
  hasCache: number
  hasDisplay: number
  icon: string
  id: string
  note: string
  openMode: string
  pid: string
  remark: string
  reqPath: string
  route: string
  sortNum: number
}

interface ILoginParams {
  userAccount: string
  password: string
  appCode: string
  type: number
  forceLogin: number
  serviceUrl: string
  uuid: string
}

interface IMenuParam {
  route: string
  icon: string
  funName: string
  children: IMenuParam[]
}
/**
 * 组织机构选项类型
 */
interface OrgOption {
  orgCode: string;
  orgLevel: number;
  orgName: string;
  children?: OrgOption[];
}
