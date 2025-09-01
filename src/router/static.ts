import { createRouterPath } from '@/lib/tool';

export default [
  //登录页面
  {
    path: createRouterPath('/login'),
    name: 'local-login',
    component: () => import('@/views/login.vue'),
  }
]
