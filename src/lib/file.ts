// file.js 封装下载本地文件方法
import { saveAs } from 'file-saver'
/**
 * @params {stream} fileStream 服务器返回的文件流
 * @params {string} saveFileName 下载的文件名称
 * @retuen {promise}
 */
export const downloadFile = (fileStream: BlobPart, saveFileName: string | undefined) => {
  return new Promise<void>((resolve, _reject) => {
    const blob = new Blob([fileStream])
    if ((navigator as any)?.msSaveBlob) {
      // 兼容IE
      ;(navigator as any)?.msSaveBlob(blob, saveFileName)
    } else {
      const url = window.URL.createObjectURL(blob)
      saveAs(url, saveFileName)
    }
    resolve()
  })
}
export function downLoadBlob(res: Blob | ArrayBuffer, fileName?: string, options: { type?: string } = {}): void {
  switch (options.type) {
    case 'zip':
      options.type = 'application/zip'
      break
    case 'xls':
      options.type = 'application/vnd.ms-excel'
      break
    case 'xlsx':
      options.type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      break
    case 'docx':
      options.type = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      break
    case 'doc':
      options.type = 'application/msword'
      break
    case 'pdf':
      options.type = 'application/pdf'
      break
    case 'png':
      options.type = 'image/png'
      break
    case 'jpg':
    case 'jpeg':
      options.type = 'image/jpeg'
      break
    case 'gif':
      options.type = 'image/gif'
      break
    case 'bmp':
      options.type = 'image/bmp'
      break
    case 'svg':
      options.type = 'image/svg+xml'
      break
    case 'webp':
      options.type = 'image/webp'
      break
    default:
      throw new Error(`type not supported: ${options.type}`)
  }

  const blob = res instanceof Blob ? res : new Blob([res], options) // 构造一个 blob 对象来处理数据
  const name = fileName || '导出表.xlsx'
  if ('download' in document.createElement('a')) {
    // 支持 a 标签 download 的浏览器
    const link = document.createElement('a') // 创建 a 标签
    link.download = name // a 标签添加属性
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    document.body.appendChild(link)
    link.click() // 执行下载
    URL.revokeObjectURL(link.href) // 释放 URL
    document.body.removeChild(link) // 释放标签
  } else {
    // 不支持 a 标签 download 的浏览器
    //@ts-ignore
    navigator.msSaveBlob(blob, name)
  }
}

export const downloadImage = (url: string, name: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      saveAs(url, name)
    } catch (error) {
      reject(error)
    } finally {
      setTimeout(() => {
        resolve()
      }, 500)
    }
  })
}
