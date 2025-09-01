interface IPipeNameDTO {
  pipeName: string;
}


interface IImageUploadDTO {
  fileType: string;
  originalFileName: string;
  path: string;
  previewPath: string;
  previewRelativePath: string;
  relativePath: string;
  suffix: string;
}

interface ISampleImagesDTO {
  defectImgName?: string;
  defectImgUrl?: string;
  id?: string;
  inspectionImgName?: string;
  inspectionImgUrl?: string;
  sortMark?: string;
  pipeImgName?: string;
  pipeImgUrl?: string;
  sampleId?: string;
  token?: string;
}

interface ISampleDTO {
  failureMajorType: string;
  failureMinorType: string;
  id: string;
  pipeSegmentCode: string;
  remark: string;
  sampleType: string;
  uploadTime: string;
  uploadUnitCode: string;
  uploadUnitName: string;
  uploader: string;
  uploaderUid: string
}

interface ISampleSaveDTO {
  delIds?: string[];
  images: ISampleImagesDTO[];
  sampleDTO: ISampleDTO
}