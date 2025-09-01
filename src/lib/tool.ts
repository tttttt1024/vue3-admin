import qs from 'qs'

/**
 * @description 判断是否为空对象
 * **/
export const isEmptyObj = (obj: object): boolean => {
  return JSON.stringify(obj) === '{}'
}

/**
 * @description 数组扁平化
 * **/
export const getFlatArr = (arr: Array<any>, prop: string) => {
  return arr.reduce((a, item) => {
    let flatArr = [...a, item]
    if (item[prop]) {
      flatArr = [...flatArr, ...getFlatArr(item[prop], prop)]
    }
    return flatArr
  }, [])
}

/**
 * @description 根据路由获取功能配置
 * **/
export const getFunConfig = (arr: Array<any>, route: string): IFunConfig => {
  return getFlatArr(arr, 'children').filter((item: IFunConfig) => item.route === route)[0]
}

/**
 * @description 合并url参数
 * **/
export const urlParamsMerge = (url1: string, url2: string): string => {
  if(!url1 || !url2) {
    console.warn(`urlParamsMerge参数错误`)
    return ''
  }
  const [path, url1ParamsString] = url1.split('?')
  const [, url2ParamsString] = url2.split('?')
  const url1ParamsObj = qs.parse(url1ParamsString)
  const url2ParamsObj = qs.parse(url2ParamsString)
  const params = Object.assign({}, url1ParamsObj, url2ParamsObj)
  return `${path}${qs.stringify(params) ? '?' + qs.stringify(params) : ''}`
}

//节流
export const throttle = (fn: Function, interval = 200) => {
  let last: number
  let timer: ITime
  return (...args: any[]) => {
    const th = this
    const now = +new Date()
    if (last && now - last < interval) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        fn.apply(th, args)
      }, interval)
    } else {
      last = now
      fn.apply(th, args)
    }
  }
}

//防抖
export const debounce = (fn: Function, delay = 200, immediate = false) => {
  let timer: ITime
  return (...args: any[]) => {
    const th = this
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(th, args)
        timer = void 0
      }, delay)
      if (immediate) {
        fn.apply(th, args)
      }
    } else {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(th, args)
        timer = void 0
      }, delay)
    }
  }
}

// 递归级联数组
export const generateOptions = (arr) => {
  if (!Array.isArray(arr)) {
    return []
  }

  return arr.map((item) => {
    interface Option {
      label: string
      value: string
      orgLevel: number
      children?: Array<Option>
    }
    let option: Option = {
      value: item.orgCode,
      label: item.orgName,
      orgLevel: item.orgLevel,
    }

    if (item.children && item.children.length > 0) {
      option.children = generateOptions(item.children)
    }

    return option
  })
}
// 递归级联数组A
export const generateOptionsA = (arr) => {
  if (!Array.isArray(arr)) {
    return []
  }

  return arr.map((item) => {
    interface Option {
      label: string
      value: string
      children?: Array<Option>
    }
    let option: Option = {
      value: JSON.stringify({
        orgName: item.orgName,
        orgLevel: item.orgLevel,
        orgCode: item.orgCode,
      }),
      label: item.orgName,
    }

    if (item.children && item.children.length > 0) {
      option.children = generateOptionsA(item.children)
    }

    return option
  })
}
// 递归级联数组B-valuea:id
export const generateOptionsB = (arr) => {
  if (!Array.isArray(arr)) {
    return []
  }

  return arr.map((item) => {
    interface Option {
      label: string
      value: string
      children?: Array<Option>
    }
    let option: Option = {
      value: item.id,
      label: item.orgName,
    }

    if (item.children && item.children.length > 0) {
      option.children = generateOptions(item.children)
    }

    return option
  })
}
/**@description 通过URL下载文件 */
export function downloadURL(url, name = '默认名称') {
  const link = document.createElement('a')
  link.download = name
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
/**@description 字典转换 */
export const getLabelByValue = (value, arr) => {
  // console.log('字典转换', value, arr)
  let res = ''
  arr.forEach((v) => {
    if (v.value == value) {
      res = v.label
    }
  })
  return res
}
/**@description 字典转换 */
export const getValueByLabel = (value, arr) => {
  // console.log('字典转换', value, arr)
  let res = ''
  arr.forEach((v) => {
    if (v.label == value) {
      res = v.value
    }
  })
  return res
}
// 点座标转换
export const getPOINT = (wkt) => {
  let a = wkt.indexOf('(')
  let b = wkt.indexOf(')')
  let c = wkt.slice(a + 1, b)
  let d = c.split(' ')
  let e = d.map((v) => Number(v))
  return e
}

export function defaultColumn(title: string, dataIndex: string, column: { [name: string]: any } = {}): ITableColumn {
  return {
    title,
    dataIndex,
    key: dataIndex,
    width: 100,
    align: 'center',
    ellipsis: true,
    isSlot: false,
    ...column,
  }
}
export function defaultColumnBySorted(title: string, dataIndex: string, column: { [name: string]: any } = {}): ITableColumn {
  return {
    title,
    dataIndex,
    key: dataIndex,
    width: 100,
    align: 'center',
    ellipsis: true,
    isSlot: false,
    sorted: true,
    ...column,
  }
}
/**生成唯一ID */

export function generateUniqueID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


/**
 * @description 拼接路由路径
 * @param path 路径
 */
export function createRouterPath(path: string) {
  const VITE_APP_BASE_PATH = import.meta.env.VITE_APP_BASE_PATH || ''
  return VITE_APP_BASE_PATH + path
}

/** 异步下载文件 */
export const downloadBlobAsync = (blob: Blob | string, fileName: string, isUrl = false) => {
  return new Promise<void>((resolve, reject) => {
    try {
      //对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
      //IE10以上支持blob但是依然不支持download
      if ('download' in document.createElement('a')) {
        //支持a标签download的浏览器
        const link = document.createElement('a'); //创建a标签
        link.download = fileName; //a标签添加属性
        link.style.display = 'none';
        link.href = isUrl ? blob as string : URL.createObjectURL(blob as Blob);
        document.body.appendChild(link);
        link.click(); //执行下载
        URL.revokeObjectURL(link.href); //释放url
        document.body.removeChild(link); //释放标签
      } else {
        //其他浏览器
        (navigator as any)?.msSaveBlob(blob, fileName);
      }
    } catch (error) {
      console.log(error)
      reject(error);
    } finally {
      setTimeout(() => {
        resolve()
      }, 500)
    }
  })
};

/** 异步下载图片 */
export const downloadImageAsync = (imgSrc: string, name: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      //下载图片地址和图片名
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context: any = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据'
        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window
        }); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgSrc;
    } catch (error) {
      console.log(error)
      reject(error);
    } finally {
      setTimeout(() => {
        resolve()
      }, 500)
    }
  })
};

// 深拷贝
export function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (hash.has(obj)) {
    return hash.get(obj);
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (Array.isArray(obj)) {
    const arrCopy = [];
    hash.set(obj, arrCopy);
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i], hash);
    }
    return arrCopy;
  }

  const objCopy = {};
  hash.set(obj, objCopy);
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key], hash);
    }
  }
  return objCopy;
}

/**
 * 根据列配置生成表单验证规则
 * @param {Array} columns 列配置数组，每个列配置对象中应包含require和dataIndex等属性
 * @returns {Object} 返回一个对象，键为dataIndex，值为对应的验证规则数组
 */
export function getRules(columns: any[]): object {
  const rules: any = {};
  // 遍历列配置，为需要验证的列生成验证规则
  columns.forEach((e) => {
    if (e.required) {
      // 如果列配置中require为true，则为该列添加验证规则
      rules[e.name] = [
        {
          required: true, // 规则要求该字段必填
          message: `${e.label}不能为空`, // 验证不通过时的提示信息
          trigger: e.element == "a-input" ? "blur" : "change", // 根据字段类型选择触发验证的事件
        } as any,
      ].concat(e.rules || []);
    } else if (e.forceRules) {
      rules[e.name] = e.rules
    }
  });

  return rules;
}

export function isNotExist(val: string | null | undefined) {
  return val === null || val === undefined || val === '' || val === 'null' || val === 'undefined'
}


export function filterTree(treeData: any[], searchText: string, fk = "title") {
  const lowerSearch = searchText.toLowerCase();
  // 递归过滤函数
  const filterFn = (node: { [k: string]: any }) => {
    // 创建节点副本避免污染原数据
    const newNode = { ...node };

    // 处理子节点（深度克隆后过滤）
    if (newNode.children && newNode.children.length) {
      newNode.children = newNode.children.map(filterFn).filter(Boolean);
    }

    // 判断条件：当前节点匹配 或 子节点存在匹配项
    const isMatch = newNode[fk].toLowerCase().includes(lowerSearch);
    const hasMatchedChild = newNode.children && newNode.children.length > 0;

    // 保留条件：当前节点匹配，或子节点有匹配时保留路径
    if (isMatch || hasMatchedChild) {
      // 当节点本身不匹配但子节点匹配时，需要克隆子节点但保持自身结构
      return !isMatch && hasMatchedChild ? { ...newNode } : newNode;
    }

    return null;
  };

  // 过滤顶层树结构
  return treeData.map(filterFn).filter(Boolean);
}
export function isValueInTree(
  treeData: any[],
  targetPath: string | number,
  targetKey = "key"
) {
  if (!targetPath || treeData?.length === 0) {
    return false;
  }
  // 处理 null/undefined 的特殊情况
  const isTargetNull = targetPath === null || targetPath === undefined;

  // 递归检查函数
  const checkNode = (node: any) => {
    // 匹配条件判断
    const isMatch = isTargetNull
      ? node[targetKey] === targetPath
      : node[targetKey] === String(targetPath);

    if (isMatch) return true;

    // 检查子节点
    if (node.children?.length) {
      return node.children.some(checkNode);
    }

    return false;
  };

  return treeData.some(checkNode);
}