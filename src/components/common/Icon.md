# Icon 组件使用说明

## 功能特性

Icon 组件是一个通用的图标显示组件，支持以下功能：

1. **支持图片图标**：通过URL地址显示图片
2. **支持字体图标**：通过CSS类名显示图标字体
3. **自动类型判断**：自动识别图标是URL还是CSS类名
4. **错误处理**：图片加载失败时自动隐藏
5. **样式定制**：支持自定义CSS类名

## 使用方法

### 基本用法

```vue
<template>
  <!-- 图片图标 -->
  <Icon icon="/src/assets/icons/dashboard.png" alt="驾驶舱" />
  
  <!-- 字体图标 -->
  <Icon icon="fas fa-tachometer-alt" />
  
  <!-- 自定义样式 -->
  <Icon icon="iconfont icon-dashboard" customClass="my-icon" />
</template>

<script setup>
import Icon from '@/components/common/Icon.vue';
</script>
```

### 在导航中使用

```vue
<template>
  <li v-for="item in navItems" :key="item.id">
    <Icon 
      v-if="item.icon" 
      :icon="item.icon" 
      :alt="item.name"
      class="nav-icon"
    />
    <span>{{ item.name }}</span>
  </li>
</template>
```

### Ant Design Vue 图标处理

对于 Ant Design Vue 图标，建议直接使用组件形式：

```vue
<template>
  <!-- 推荐：直接使用 Ant Design Vue 图标组件 -->
  <AppstoreOutlined class="nav-icon" />
  <UserOutlined class="nav-icon" />
  
  <!-- 或者使用 Icon 组件处理其他类型的图标 -->
  <Icon icon="/src/assets/icons/custom.png" alt="自定义图标" />
  <Icon icon="fas fa-user" />
</template>

<script setup>
import { AppstoreOutlined, UserOutlined } from '@ant-design/icons-vue';
import Icon from '@/components/common/Icon.vue';
</script>
```

## 实际项目使用示例

### 导航数据配置

```javascript
// 在您的数据配置中，可以这样设置图标
const navData = [
  {
    id: '1',
    funName: '驾驶舱',
    route: '/dashboard',
    icon: '/src/assets/icons/dashboard.png'  // 图片图标
  },
  {
    id: '2', 
    funName: '数据管理',
    route: '/data',
    icon: 'fas fa-database'  // 字体图标
  },
  {
    id: '3',
    funName: '预警管理', 
    route: '/alerts',
    icon: 'fas fa-exclamation-triangle'  // 字体图标
  },
  {
    id: '4',
    funName: '辅助工具',
    route: '/tools',
    icon: '/src/assets/icons/tools.svg'  // SVG图标
  }
];
```

### 混合使用示例（推荐方案）

```vue
<template>
  <nav>
    <ul>
      <li v-for="item in navItems" :key="item.id">
        <!-- 图片或字体图标 -->
        <Icon v-if="item.iconType === 'icon'" :icon="item.icon" :alt="item.name" />
        
        <!-- Ant Design Vue 图标 -->
        <component v-else-if="item.iconType === 'ant'" :is="item.iconComponent" />
        
        <span>{{ item.name }}</span>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { AppstoreOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons-vue';
import Icon from '@/components/common/Icon.vue';

const navItems = [
  { id: 1, name: '驾驶舱', iconType: 'icon', icon: '/src/assets/icons/dashboard.png' },
  { id: 2, name: '数据管理', iconType: 'ant', iconComponent: AppstoreOutlined },
  { id: 3, name: '用户管理', iconType: 'ant', iconComponent: UserOutlined },
  { id: 4, name: '设置', iconType: 'icon', icon: 'fas fa-cog' }
];
</script>
```

## 支持的图标格式

### 图片图标
- 支持的协议：`http://`、`https://`、`/`、`./`、`../`
- 支持的格式：`.png`、`.jpg`、`.jpeg`、`.gif`、`.svg`

### 字体图标
- Font Awesome：`fas fa-tachometer-alt`
- 自定义图标字体：`iconfont icon-dashboard`
- 其他图标库：`material-icons dashboard`

### Ant Design Vue 图标
- 直接使用组件：`<AppstoreOutlined />`
- 支持所有 Ant Design Vue 图标库

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| icon | string | - | 图标路径或CSS类名（必填） |
| alt | string | '' | 图片的alt属性（仅对图片图标有效） |
| customClass | string | '' | 自定义CSS类名 |

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| error | 图片加载失败时触发 | - |
| load | 图片加载成功时触发 | - |

## 样式定制

组件提供了基础的样式，您可以通过 `customClass` 属性进行样式定制：

```vue
<Icon 
  icon="fas fa-user" 
  customClass="user-icon"
/>

<style>
.user-icon {
  font-size: 24px;
  color: #1890ff;
}
</style>
```

## 最佳实践

### 1. 图标类型分类

```javascript
// 在数据中明确指定图标类型
const navItems = [
  {
    id: 1,
    name: '驾驶舱',
    iconType: 'image',  // 图片图标
    icon: '/src/assets/icons/dashboard.png'
  },
  {
    id: 2,
    name: '数据管理',
    iconType: 'ant',    // Ant Design Vue图标
    iconComponent: AppstoreOutlined
  },
  {
    id: 3,
    name: '用户管理',
    iconType: 'font',   // 字体图标
    icon: 'fas fa-users'
  }
];
```

### 2. 组件使用

```vue
<template>
  <li v-for="item in navItems" :key="item.id">
    <!-- 图片图标 -->
    <Icon v-if="item.iconType === 'image'" :icon="item.icon" :alt="item.name" />
    
    <!-- 字体图标 -->
    <Icon v-else-if="item.iconType === 'font'" :icon="item.icon" />
    
    <!-- Ant Design Vue 图标 -->
    <component v-else-if="item.iconType === 'ant'" :is="item.iconComponent" />
    
    <span>{{ item.name }}</span>
  </li>
</template>
```

## 注意事项

1. 图片加载失败时，组件会自动隐藏图片并输出警告信息到控制台
2. 字体图标需要确保相应的图标字体库已经正确引入
3. 组件的默认尺寸为 20px × 20px，可通过CSS进行覆盖
4. Ant Design Vue图标建议直接使用组件形式，可以获得更好的类型支持和性能
5. 如果需要动态图标名称，可以使用 `component` 标签配合计算属性
6. 在数据配置中，建议明确指定图标类型，便于管理和维护 