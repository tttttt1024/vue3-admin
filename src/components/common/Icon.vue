<template>
  <span v-if="icon" class="icon-wrapper">
    <!-- 如果是URL地址，显示图片 -->
    <img v-if="isIconUrl(icon)" :src="icon" :alt="alt" :class="['icon-img', customClass]" @error="handleImageError"
      @load="handleImageLoad" v-show="!imageError" />
    <!-- 如果是CSS类名，显示图标 -->
    <i v-else :class="[icon, 'icon-class', customClass]"></i>
  </span>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

/**
 * Icon组件 - 通用图标显示组件
 * 
 * 功能特性：
 * 1. 支持图片图标（URL地址）
 * 2. 支持字体图标（CSS类名）
 * 3. 自动判断图标类型
 * 4. 图片加载失败时自动隐藏
 * 5. 支持自定义样式类
 * 
 * 注意：Ant Design Vue图标建议直接使用组件形式，如：
 * <AppstoreOutlined class="my-icon" />
 * 
 * 使用示例：
 * <Icon icon="/src/assets/icons/dashboard.png" alt="驾驶舱" />
 * <Icon icon="fas fa-tachometer-alt" customClass="my-icon" />
 */
interface Props {
  /** 图标路径或CSS类名 */
  icon?: string;
  /** 图片的alt属性（仅对图片图标有效） */
  alt?: string;
  /** 自定义CSS类名 */
  customClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  customClass: ''
});

const imageError = ref(false);

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

// 处理图片加载错误
function handleImageError() {
  imageError.value = true;
  console.warn(`图片加载失败: ${props.icon}`);
}

// 处理图片加载成功
function handleImageLoad() {
  imageError.value = false;
}
</script>

<style lang="scss" scoped>
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  .icon-img {
    width: 20px;
    height: 20px;
    object-fit: contain;
    display: block;
  }

  .icon-class {
    font-size: 20px;
    color: inherit;
    display: block;
  }
}
</style>
