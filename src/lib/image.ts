export type IFileType = "pdf" | "word" | "excel" | "image" | "unknown";

/**
 * 通过文件扩展名判断文件类型
 * @param filePath 文件路径或文件名
 * @returns 文件类型
 */
export function getFileTypeByExtension(filePath: string): IFileType {
  if (!filePath) return "unknown";

  // 获取文件扩展名（不区分大小写）
  const extension = filePath.toLowerCase().split(".").pop() || "";

  // 文件类型映射
  const fileTypeMap: Record<string, string> = {
    // PDF 文件
    pdf: "pdf",

    // Word 文档
    doc: "word",
    docx: "word",
    docm: "word",
    dot: "word",
    dotx: "word",

    // Excel 表格
    xls: "excel",
    xlsx: "excel",
    xlsm: "excel",
    xlt: "excel",
    xltx: "excel",
    csv: "excel",

    // 图片文件
    jpg: "image",
    jpeg: "image",
    png: "image",
    gif: "image",
    bmp: "image",
    webp: "image",
    svg: "image",
    ico: "image",
    tiff: "image",
    tif: "image",

    // // PowerPoint 演示文稿
    // ppt: "powerpoint",
    // pptx: "powerpoint",
    // pptm: "powerpoint",
    // pot: "powerpoint",
    // potx: "powerpoint",

    // // 文本文件
    // txt: "text",
    // md: "text",
    // json: "text",
    // xml: "text",
    // html: "text",
    // htm: "text",
    // css: "text",
    // js: "text",
    // ts: "text",

    // // 压缩文件
    // zip: "archive",
    // rar: "archive",
    // "7z": "archive",
    // tar: "archive",
    // gz: "archive",

    // // 视频文件
    // mp4: "video",
    // avi: "video",
    // mov: "video",
    // wmv: "video",
    // flv: "video",
    // mkv: "video",

    // // 音频文件
    // mp3: "audio",
    // wav: "audio",
    // flac: "audio",
    // aac: "audio",
    // ogg: "audio",
  };

  return (fileTypeMap[extension] as IFileType) || "unknown";
}
