/**
 * 数组工具类
 */

// 存储已生成的颜色
let generatedColors: string[] = [];

/**
 * 计算两个颜色之间的相似度（0-1，0表示完全不同，1表示完全相同）
 */
function calculateColorSimilarity(color1: string, color2: string): number {
  // 将十六进制颜色转换为RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 0;

  // 计算欧几里得距离
  const distance = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );

  // 转换为相似度（0-1）
  return 1 - distance / Math.sqrt(3 * Math.pow(255, 2));
}

/**
 * 生成随机颜色
 */
function generateRandomColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * 生成不重复且不相近的随机颜色
 * @param minSimilarity 最小相似度阈值（0-1），低于此值认为颜色不相近
 * @param maxAttempts 最大尝试次数
 * @returns 生成的随机颜色
 */
export function generateUniqueRandomColor(
  minSimilarity: number = 0.3,
  maxAttempts: number = 100
): string {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const newColor = generateRandomColor();

    // 检查是否与已生成的颜色相近
    let isTooSimilar = false;
    for (const existingColor of generatedColors) {
      const similarity = calculateColorSimilarity(newColor, existingColor);
      if (similarity > minSimilarity) {
        isTooSimilar = true;
        break;
      }
    }

    if (!isTooSimilar) {
      generatedColors.push(newColor);
      return newColor;
    }

    attempts++;
  }

  // 如果尝试次数过多，返回一个稍微调整的颜色
  const fallbackColor = generateRandomColor();
  generatedColors.push(fallbackColor);
  return fallbackColor;
}

/**
 * 重置已生成的颜色列表
 */
export function resetGeneratedColors(): void {
  generatedColors = [];
}

/**
 * 获取已生成的颜色列表
 */
export function getGeneratedColors(): string[] {
  return [...generatedColors];
}

/**
 * 预定义一些常用的颜色，避免生成过于相似的颜色
 */
export function initializeColorPalette(): void {
  const predefinedColors = [
    "#f56c6c", // 红色
    "#f6be1b", // 橙色
    "#ffff00", // 黄色
    "#19be6b", // 绿色
    "#2571FF", // 蓝色
    "#909399", // 灰色
    "#E6A23C", // 金色
    "#67C23A", // 浅绿
    "#409EFF", // 浅蓝
    "#F56C6C", // 深红
  ];

  generatedColors = [...predefinedColors];
}

/**
 * 将对象数组转换为键值对对象
 * @param array 对象数组
 * @param config 配置对象，包含 key 和 value 字段名
 * @returns 转换后的键值对对象
 */
export function arrayToKeyValue<T extends Record<string, any>>(
  array: T[],
  config: { key: keyof T; value: keyof T }
): Record<string, any> {
  const result: Record<string, any> = {};

  array.forEach((item) => {
    const key = item[config.key];
    const value = item[config.value];
    if (key !== undefined) {
      result[key] = value;
    }
  });

  return result;
}

/**
 * 将对象数组转换为键值对对象（简化版本）
 * @param array 对象数组
 * @param keyField 键字段名
 * @param valueField 值字段名
 * @returns 转换后的键值对对象
 */
export function convertArrayToMap<T extends Record<string, any>>(
  array: T[],
  keyField: keyof T,
  valueField: keyof T
): Record<string, any> {
  return arrayToKeyValue(array, { key: keyField, value: valueField });
}

/**
 * 使用示例：
 *
 * const evalLevelOpts = [
 *   { name: "红色等级", code: 1, color: '#f56c6c' },
 *   { name: "橙色等级", code: 2, color: '#f6be1b' },
 *   { name: "黄色等级", code: 3, color: '#ffff00' },
 *   { name: "绿色等级", code: 4, color: '#19be6b' },
 *   { name: "无", code: 5, color: '#ddd' },
 * ];
 *
 * // 方法1：使用配置对象
 * const result1 = arrayToKeyValue(evalLevelOpts, { key: 'name', value: 'code' });
 * // 返回: { "红色等级": 1, "橙色等级": 2, "黄色等级": 3, "绿色等级": 4, "无": 5 }
 *
 * // 方法2：使用简化版本
 * const result2 = convertArrayToMap(evalLevelOpts, 'name', 'code');
 * // 返回: { "红色等级": 1, "橙色等级": 2, "黄色等级": 3, "绿色等级": 4, "无": 5 }
 *
 * // 其他用法示例：
 * const colorMap = convertArrayToMap(evalLevelOpts, 'name', 'color');
 * // 返回: { "红色等级": "#f56c6c", "橙色等级": "#f6be1b", ... }
 */

/**
 * 根据指定字段去重
 * @param {Array} dataList - 原始数据数组
 * @param {string} fieldName - 用于去重的字段名，默认为'equipmentCode'
 * @returns {Array} - 去重后的数组
 */
export function removeDuplicateByField<T extends Record<string, any>>(
  dataList: T[],
  fieldName: keyof T = "equipmentCode" as keyof T
): T[] {
  if (!Array.isArray(dataList) || dataList.length === 0) {
    return [];
  }

  const seen = new Set<T[keyof T]>();
  const result: T[] = [];

  dataList.forEach((item: T) => {
    const fieldValue = item[fieldName];
    if (fieldValue && !seen.has(fieldValue)) {
      seen.add(fieldValue);
      result.push(item);
    }
  });

  return result;
}
