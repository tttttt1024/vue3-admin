<template>
  <div ref="loginMain" class="login-main">
    <div class="login-head">
      <h1>
        <img class="logo-img" src="/src/assets/image/logo.png" alt="" />共建共享完整性管理模块
      </h1>
    </div>
    <div class="login-form">
      <div class="form-title">
        <p :class="`${state.isIAMLogin ? 'login-active' : ''}`" @click="state.isIAMLogin = true">
          IAM登录
        </p>
        <p :class="`${!state.isIAMLogin ? 'login-active' : ''}`" @click="state.isIAMLogin = false">
          系统登录
        </p>
      </div>
      <a-form
        ref="formRef"
        :model="state.loginForm"
        :rules="state.rules"
        status-icon
        @submit.prevent
      >
        <a-form-item name="userName">
          <a-input
            v-model:value="state.loginForm.userName"
            placeholder="请输入用户名"
            @keyup.enter="submitForm"
          >
            <template #prefix>
              <img class="input-icon" src="/src/assets/image/login/用户.png" alt="用户" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input
            v-model:value="state.loginForm.password"
            placeholder="请输入密码"
            :type="state.isShowPwd ? 'text' : 'password'"
            @keyup.enter="submitForm"
          >
            <template #prefix>
              <img class="input-icon" src="/src/assets/image/login/密码锁.png" alt="密码锁" />
            </template>
            <template #suffix>
              <img
                class="show-pwd-icon"
                :src="state.isShowPwd ? state.showPWDIcon : state.hideenPWDIcon"
                alt="显示密码"
                @click="state.isShowPwd = !state.isShowPwd"
              />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
      <div class="remember-pwd">
        <a-checkbox v-model:checked="state.checked">记住密码</a-checkbox>
      </div>
      <a-button @click="submitForm"> 登录 </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  reactive,
  ref,
  onMounted,
  createVNode,
  getCurrentInstance,
  ComponentInternalInstance,
} from 'vue'
import CryptoJS from 'crypto-js'
import { encode } from 'js-base64'
import { useRouter, Router } from 'vue-router'
import { loginAPI } from '@/api/base'
import { Modal } from 'ant-design-vue'
import { debounce } from 'lodash'
import showPWDIcon from '/src/assets/image/login/显示.png'
import hideenPWDIcon from '/src/assets/image/login/眼睛_隐藏.png'
const router: Router = useRouter()
const SECRET_KEY: string = 'BB123456AABBAA'
const { proxy } = getCurrentInstance() as ComponentInternalInstance
const state = reactive({
  isIAMLogin: false,
  loginForm: {
    userName: '',
    password: '',
  },
  showPWDIcon: showPWDIcon,
  hideenPWDIcon: hideenPWDIcon,
  isShowPwd: false,
  checked: false,
  rules: {
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  },
  forceLogin: 0,
})
const formRef = ref()

const submitForm = (() => {
  return debounce(function () {
    formRef.value.validate().then(() => {
      if (state.checked) {
        saveUserInfo()
      } else {
        localStorage.removeItem('encryptionInfo')
      }
      handleLogin()
    })
  }, 500)
})()

async function handleLogin() {
  const query: any = router.currentRoute.value.query
  const params = {
    userAccount: state.loginForm.userName,
    password: encode(state.loginForm.password),
    appCode: query.appCode,
    type: state.isIAMLogin ? 0 : 1,
    forceLogin: state.forceLogin,
    serviceUrl: query?.service,
    uuid: query?.uuid,
  }
  const { code, data } = await loginAPI(params)
  if (code === 10049) {
    Modal.confirm({
      title: '操作提示',
      icon: createVNode(proxy?.$icons['ExclamationCircleOutlined']),
      content: '用户已在其他地方登录，是否继续登录?',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        state.forceLogin = 1
        handleLogin()
      },
    })
  } else if (code === 200 && data) {
    window.location.replace(data)
  }
}

function saveUserInfo() {
  const loginForm = CryptoJS.AES.encrypt(JSON.stringify(state.loginForm), SECRET_KEY)
  localStorage.setItem('encryptionInfo', loginForm)
}

function judgeIsChecked() {
  const checked = localStorage.getItem('loginRemeberPWD') === 'true'
  state.checked = checked
  if (checked) {
    const encryptionInfo = localStorage.getItem('encryptionInfo')
    if (encryptionInfo) {
      const loginForm = JSON.parse(
        CryptoJS.AES.decrypt(encryptionInfo, SECRET_KEY).toString(CryptoJS.enc.Utf8)
      )
      state.loginForm = {
        ...loginForm,
      }
    }
  }
}

onMounted(() => {
  judgeIsChecked()
})
</script>

<style lang="scss" scoped>
.login-main {
  height: 100vh;
  width: 100vw;
  background: url('/src/assets/image/login/login_bg.png') 0/100% 100% no-repeat;
  overflow: auto;
  overflow-x: hidden;

  .login-head {
    width: 100vw;
    text-align: center;
    font-weight: 600;
    font-size: 30px;
    letter-spacing: 10px;
    padding-top: 10px;
    height: 80px;
    box-sizing: border-box;
    background: url('/src/assets/image/login/系统名展示.png') no-repeat;
    background-size: 100% 100%;
    position: sticky;
    top: 0;

    h1 {
      font-size: inherit;
      font-weight: inherit;
      color: #00e0db;

      img {
        margin-right: 10px;
      }
    }
  }

  .login-form {
    width: 420px;
    height: 450px;
    background: url('/src/assets/image/login/登录框.png') no-repeat;
    background-size: 100% 100%;
    float: right;
    margin-right: 100px;
    margin-top: 200px;
    box-sizing: border-box;
    padding: 50px;
    position: relative;
    transition: all 1s;

    .form-title {
      display: flex;
      justify-content: center;
      color: #fff;
      font-size: 24px;
      font-weight: 400;
      cursor: pointer;
      margin-bottom: 40px;

      P + p {
        margin-left: 40px;
      }

      .login-active {
        color: #00e0db;
        position: relative;

        &:after {
          content: '';
          background: url('/src/assets/image/login/选中下滑条.png') no-repeat;
          display: block;
          background-size: contain;
          margin-top: 10px;
          width: 100px;
          height: 5px;
          transition: all 1s;
        }
      }
    }

    .remember-pwd {
      float: right;
    }

    &:deep(.ant-form-item-control-input) {
      border: none;
      background: url('/src/assets/image/login/输入框.png') no-repeat;
      background-size: 100% 100%;
      height: 60px;
      font-size: 16px;

      .ant-input-affix-wrapper {
        background-color: transparent !important;
        border: 0 !important;
        box-shadow: none !important;

        .ant-input {
          background-color: transparent !important;
          border: 0 !important;
          border-color: transparent !important;
          color: #00e0db;
        }

        .ant-input::placeholder {
          border: 0;
          color: #00e0db;
        }
      }
    }

    &:deep(.el-input__prefix),
    &:deep(.el-input__suffix) {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 15px;
    }

    &:deep(.ant-btn) {
      position: absolute;
      bottom: 40px;
      left: 130px;
      width: 165px;
      height: 65px;
      background: url('/src/assets/image/login/登录按钮.png') no-repeat;
      background-size: 100% 100%;
      border: none;
      color: #00e0db;
      letter-spacing: 10px;
      font-weight: 600;
      font-size: 16px;
    }

    &:deep(.ant-checkbox-wrapper) {
      > span {
        color: #00e0db;
      }

      .ant-checkbox-checked {
        .ant-checkbox-inner {
          background-color: #00e0db;
        }
      }
    }
  }
}

.show-pwd-icon {
  cursor: pointer;
  margin-right: 10px;
}

.input-icon {
  width: 20px;
  height: 20px;
}

.logo-img {
  width: 50px;
  height: 50px;
}
</style>
