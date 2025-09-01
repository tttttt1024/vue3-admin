import request from '@/lib/request'
import axios from 'axios'
/***
 * @description 获取用户信息
 */

export const getPermission = () => {
  return request({
    url: '/permission/getPermission',
    method: 'GET',
  })
}

/**
 * @description 注销登录
 * **/
export function logoutAPI() {
  return request({
    url: '/permission/loginOut',
    method: 'GET',
  })
}

/**
 * @description 登录
 * **/
export function loginAPI(data: ILoginParams) {
  return request({
    url: window.APP_CONFIG.loginBaseUrl,
    method: 'POST',
    data,
  })
}

// 获取生产单位树 /permission/getProductOrgTree
export function getProductOrgTree() {
  return request({
    url: `/permission/getProductOrgTree`,
    method: 'GET',
  })
}
/**
 * @description /business/outter/getDictByCode 获取根据code码获取字典
 * **/
export function getDictByCode(code) {
  return request({
    url: `/business/outter/getDictByCode?code=${code}`,
    method: 'GET',
  })
}


/***
 * @description 导出接口
 */

export const exportApi = async (data: any,url:string,method='post') => {
  const responseData = await request({
    url,
    method,
    responseType: "arraybuffer",
    [method==='post'? 'data':'params']:data,
  });
  try {
    const res = await new Response(responseData as any, {
      status: 200,
      type: "application/json;charset=utf-8",
    } as any).json();
    return Promise.reject(res);
  } catch (error) {
    return new Response(responseData as any, {
      status: 200,
      type: "application/octet-stream;charset=utf-8",
    } as any).blob();
  }
}
// 数据管理获取生产单位树 /dataManage/sys/getOrgTree
export function getOrgTree() {
  return axios.get(`${window.APP_CONFIG.sjglUrl}/dataManage/sys/getOrgTree`, {
    headers: {
      token: localStorage.getItem('token')
    }
  })
}