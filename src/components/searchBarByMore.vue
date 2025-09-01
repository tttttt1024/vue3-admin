<template>
  <div ref="searchBoxRef"
    :class="`search-box search-bar-box custom-search-bar-box ${isExpand ? 'expand-search' : ''} ${isClosing ? 'closing-search' : ''}`">
    <a-form layout="inline" :model="props.formData">
      <a-form-item v-for="item in displayItem" :key="item.value" :label="item.label">
        <slot :name="item.value" :item="item">
          <component :is="item.element" v-model:value="props.formData[item.value]" v-bind="item.attrs"
            v-on="item.event || {}">
          </component>
        </slot>
      </a-form-item>
      <a-form-item>
        <div class="search-btns">
          <template v-for="item in props.btns" :key="item.key">
            <slot v-if="item.show" :name="item.key" :item="item">
              <template v-if="item.isMore">
                <a-button v-bind="item.attrs" @click="expand" :class="{ 'rotate-icon': isExpand }">
                  <span>
                    <img :style="{
                      width: '18px', height: '17px'
                    }" v-if="isExpand" src="@/assets/image/reportIntelligentRecognition/u512.svg" alt="">
                    <img :style="{
                      width: '20px', height: '20px'
                    }" v-else="isExpand" src="@/assets/image/reportIntelligentRecognition/u309.png" alt="">
                    {{ isExpand ? '关闭' : '更多' }}
                  </span>
                </a-button>
              </template>
              <a-button v-else v-bind="item.attrs" :loading="loading[item.key]" @click="btnClick(item)">
                <span>
                  <template v-if="item.icon">
                    <component v-if="typeof item.icon === 'string' && !isIconUrl(item.icon)" :is="item.icon">
                    </component>
                    <img :style="item.iconStyle ? item.iconStyle : {
                      width: '20px', height: '20px'
                    }" :src="item.icon" alt="">
                  </template>
                  {{ item.label }}
                </span>
              </a-button>
            </slot>
          </template>
        </div>

      </a-form-item>
    </a-form>
    <div class="search-bar-right">
      <slot name="searchBarRight"></slot>
    </div>
  </div>
  <div v-if="isMore && isExpand" class="expand-spacer"></div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref, onMounted, onUnmounted, nextTick, onBeforeUnmount } from "vue";


const props = withDefaults(
  defineProps<{
    formItem: ISearchFormItem[];
    btns: ISearchBtns[];
    formData: any;
  }>(),
  {}
);

console.log({ props })

const loading = reactive<any>({});
const searchBoxRef = ref<HTMLElement>();
const containerWidth = ref<number>(0);

function btnClick(item: ISearchBtns) {
  loading[item.key] = true;
  const done = () => {
    loading[item.key] = false;
  };
  item.callFn(props.formData, done);
}

const isMore = computed(() => props.btns.some(item => item.isMore))

// 计算每个表单项的宽度
const itemWidth = computed(() => {
  if (!containerWidth.value) return '270px';

  // 展开时一排显示5个，计算可用宽度
  if (isExpand.value) {
    // 减去padding和gap的宽度
    const availableWidth = containerWidth.value - 24 - (4 * 16); // 左右padding各12px，4个gap各6px
    const itemWidth = Math.max(180, Math.floor(availableWidth / 5)); // 最小宽度180px
    console.log({ itemWidth, containerWidth: containerWidth.value, availableWidth })
    return `${itemWidth}px`;
  }

  // 收起时保持原有宽度
  return '270px';
});

const displayItem = computed(() => {
  let res = JSON.parse(JSON.stringify(props.formItem))
  if ((isMore.value && !isExpand.value) || isClosing.value) {
    // 只显示前4个（包括关闭状态）
    return res = res.slice(0, 4)
  }
  return res.map((e) => {
    return {
      ...e,
      attrs: {
        ...e.attrs,
        style: {
          ...e.attrs.style,
          width: itemWidth.value,
        }
      }
    }
  })
})

const isExpand = ref(false)
const isClosing = ref(false)

// 更新容器宽度
function updateContainerWidth() {
  if (searchBoxRef.value) {
    const rect = searchBoxRef.value.getBoundingClientRect();
    containerWidth.value = rect.width;
  }
}

// 窗口尺寸变化监听
function handleResize() {
  nextTick(() => {
    updateContainerWidth();
  });
}

function expand() {
  if (isExpand.value) {
    // 关闭时先添加关闭动画
    isClosing.value = true
    setTimeout(() => {
      isExpand.value = false
      isClosing.value = false
    }, 300) // 等待动画完成
  } else {
    isExpand.value = true
  }
}

function onMessage(_d: any) {
  const { data } = _d;
  if (data.type === 'menuCollapse') {
    return handleResize()
  }
}

// 组件挂载时获取容器宽度
onMounted(() => {
  nextTick(() => {
    updateContainerWidth();
  });

  // 监听窗口尺寸变化
  window.addEventListener('resize', handleResize);
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 判断图标是否为URL地址
function isIconUrl(icon: string): boolean {
  // 首先检查是否包含文件扩展名
  const hasFileExtension = /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i.test(icon);

  // 检查是否以协议或路径开头
  const isPath = icon.startsWith('http://') ||
    icon.startsWith('https://') ||
    icon.startsWith('/') ||
    icon.startsWith('./') ||
    icon.startsWith('../') ||
    icon.startsWith('data:') ||
    icon.startsWith('blob:');

  // 如果包含文件扩展名或是路径，则认为是图片
  return hasFileExtension || isPath;
}
</script>

<style scoped lang="scss">
:deep(.ant-form-item-label) {
  label {
    color: rgba(0, 0, 0, 0.3);
  }
}

.search-box {
  flex-wrap: nowrap;
  overflow: hidden;
  height: 50px;
  display: flex !important;
  display: -webkit-flex !important;
  align-items: center;
  -webkit-align-items: center;
  justify-content: space-between;
  -webkit-justify-content: space-between;
  position: relative;

  // 添加基础过渡动画
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;

  :deep(form) {
    flex: 1;
    gap: 12px;
    display: flex;
    flex-wrap: wrap; // 允许换行
    align-items: center;

    .ant-form-item {
      margin-inline-end: 0;
      flex-shrink: 0;
    }
  }
}

.expand-search {
  padding: 12px;
  height: auto;
  position: absolute;
  z-index: 102;
  background-color: #fff;
  box-shadow: 0px 0px 16px rgba(36, 112, 255, 0.23921568627450981);
  border-radius: 8px;

  // 添加展开动画
  animation: expandAnimation 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;

  :deep(form) {
    flex: 1;
    gap: 16px;
    opacity: 0;
    animation: fadeInForm 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;

    // 展开时优化表单项布局，支持换行
    .ant-form-item {
      margin-inline-end: 0;
      flex-shrink: 0;

      // 确保表单项能够正确换行
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }

  // 展开时显示所有表单项，并添加延迟动画
  :deep(.ant-form-item:nth-child(n+6)) {
    opacity: 0;
    transform: translateY(10px);
    animation: fadeInFormItem 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
  }
}

// 关闭动画状态
.closing-search {
  animation: closeAnimation 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;

  :deep(form) {
    animation: fadeOutForm 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;


  }

  // 关闭时隐藏第二排及以后的表单项
  :deep(.ant-form-item:nth-child(n+5)) {
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }
}

// 关闭状态的基础样式
.search-box:not(.expand-search) {
  // 确保关闭状态也有平滑过渡
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

// 展开动画
@keyframes expandAnimation {
  0% {
    opacity: 0;
    transform: scaleY(0.8) translateY(-10px);
    box-shadow: 0px 0px 0px rgba(36, 112, 255, 0);
  }

  100% {
    opacity: 1;
    transform: scaleY(1) translateY(0);
    box-shadow: 0px 0px 16px rgba(36, 112, 255, 0.23921568627450981);
  }
}

// 关闭动画
@keyframes closeAnimation {
  0% {
    opacity: 1;
    transform: scaleY(1) translateY(0);
    box-shadow: 0px 0px 16px rgba(36, 112, 255, 0.23921568627450981);
  }

  100% {
    opacity: 0;
    transform: scaleY(0.8) translateY(-10px);
    box-shadow: 0px 0px 0px rgba(36, 112, 255, 0);
  }
}

// 表单内容淡入动画
@keyframes fadeInForm {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

// 表单内容淡出动画
@keyframes fadeOutForm {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}

// 表单项淡入动画
@keyframes fadeInFormItem {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

// 更多按钮图标旋转动画
.rotate-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  span {
    display: flex;
    align-items: center;
    gap: 4px;

    img {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
}

// 展开状态下的按钮样式
.expand-search .rotate-icon {

  span img {
    transform: rotate(180deg);
  }
}

// 关闭状态下的按钮样式
.search-box:not(.expand-search) .rotate-icon {
  span img {
    transform: rotate(0deg);
  }
}

// 展开占位符的动画
.expand-spacer {
  height: 50px;
  animation: spacerAnimation 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes spacerAnimation {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

// 表单项的动画
:deep(.ant-form-item) {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  // &:hover {
  //   transform: translateY(-2px);
  // }
}

// 按钮悬停效果
:deep(.ant-btn) {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  // &:hover {
  //   transform: translateY(-1px);
  //   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  // }

  &:active {
    transform: translateY(0);
  }
}

.search-btns {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.expand-search .search-bar-right {
  position: absolute;
  right: 12px;
  bottom: 16px;
}
</style>
