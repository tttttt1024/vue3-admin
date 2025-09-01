interface rowPLan {
  row: rowData
}

interface FileInfo {
  type?: string | null
  fileForm?: string | null
  filePath?: string | null
  id?: string | null
  originalId?: string | null
  remarks?: string | null
  previewPath?: string | null
  editPath?: string | null
  saveName?: string | null
  originalName?: string | null
  token?: string | null
}
interface rowData {
  fileIds?: string | null
  fileInfo?: FileInfo[]
  id?: string | null
  name?: string | null
  orgId?: string | null
  orgName?: string | null
  remarks?: string | null
  type?: string | null
  updateDate?: string | null
  uploadingTime?: string | null
  uploadingUser?: string | null
  originType?: number | null
  isAuthorize?: boolean | null
  fileType?: number | null
  fileTypeName?: string | null
  remarks?:string|null
}
