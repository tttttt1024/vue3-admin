/**
 * @description 判断用户角色
 * **/
import useStore from '@/store'
import { message } from 'ant-design-vue'
export const getUserType = () => {
  let { user } = useStore()
  let menu = {
    tb: 'zcwhwx_sjdw',
    sh: 'zcwhwx_ejdw',
    zc: 'zcwhwx_zcdw',
  }
  let arr = user.info.roles.map((v) => v.roleCode)
  // console.log('arr', arr, arr.includes(menu.tb))
  let tb = arr.includes(menu.tb)
  let sh = arr.includes(menu.sh)
  let zc = arr.includes(menu.zc)
  if (tb && !sh && !zc) {
    return 'tb'
  }
  if (!tb && sh && !zc) {
    return 'sh'
  }
  if (!tb && !sh && zc) {
    return 'zc'
  }
  if (!tb && !sh && !zc) {
    message.info('该用户暂未配置审核或者填报权限！', 4)
  }
  if (tb && (sh || zc)) {
    message.info('该用户同时配置审核和填报权限，以二级审核为准！', 4)
    return 'sh'
  }
  if (!tb && sh && zc) {
    message.info('该用户同时配置二级审核和支撑审核权限，以二级审核为准！', 4)
    return 'sh'
  }
}
export const getOrgId = () => {
  let { user } = useStore()
  return user.info.orgId + ',' + user.info.orgUid
}
