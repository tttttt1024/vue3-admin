import { ref } from "vue";
/**
 * echarts样式
 */
export const useThemeValue = (styleVariables: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(
    styleVariables
  );
};

/**
 * 递归替换对象中的 CSS 变量字符串
 * @param source 原始对象/数组
 * @param onError 变量未找到时的错误处理回调
 * @returns 替换后的新对象
 */
export function replaceVarStrings<T extends unknown>(
  source: T,
  onError?: (varName: string) => void
): T {
  // 处理数组
  if (Array.isArray(source)) {
    return source.reduce((arr, item, index) => {
      arr[index] =
        typeof item === "object"
          ? replaceVarStrings(item, onError)
          : processValue(item, onError);
      return arr;
    }, [] as any[]) as T;
  }

  // 处理对象
  if (typeof source === "object" && source !== null) {
    return Object.entries(source).reduce((obj, [key, value]) => {
      obj[key] =
        typeof value === "object"
          ? replaceVarStrings(value, onError)
          : processValue(value, onError);
      return obj;
    }, {} as Record<string, any>) as T;
  }

  // 处理基本类型
  return processValue(source, onError) as T;
}

// 处理单个值
function processValue<T>(value: T, onError?: (varName: string) => void): T {
  if (typeof value !== "string") return value;

  // 全局替换所有 var(...) 变量
  return value.replace(/var$([^)]+)$/g, (_, varName) => {
    const trimmedName = varName.trim();
    const themeValue = useThemeValue(trimmedName);

    if (themeValue === undefined) {
      onError?.(trimmedName);
      console.warn(`[replaceVarStrings] 主题变量未找到: ${trimmedName}`);
      return trimmedName; // 返回原变量名作为回退
    }

    return themeValue;
  }) as T;
}

/**
 * @name: 判断当前主题hook
 * @desc:
 * @return {*}
 */
export const useTheme = () => {
  const htmlDom = document.querySelector("html");
  if (!htmlDom) return { isDark: ref(false) };
  const isDark = ref(!!htmlDom.classList.contains("dark"));

  // 创建 MutationObserver 实例
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const currentClass = (mutation.target as any).className;
        isDark.value = currentClass.includes("dark");
      }
    }
  });

  // 配置 MutationObserver 监听的选项
  const observerOptions = {
    attributes: true,
    attributeFilter: ["class"],
  };

  // 开始监听目标节点
  observer.observe(htmlDom, observerOptions);

  return {
    isDark,
  };
};

//保留2位小数 去末尾0
export const unifyNumber = (num: number | string) => {
  if (num === "") {
    return 0;
  } else {
    let handleNum = parseFloat(num as string);
    let isToFixed =
      handleNum.toString().includes(".") &&
      handleNum.toString().split(".")[1].length > 2;
    if (isToFixed) {
      return handleNum.toFixed(2);
    } else {
      return handleNum;
    }
  }
};