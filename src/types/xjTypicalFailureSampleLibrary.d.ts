interface ISearchFormItem {
  value: string;
  element: string;
  key?: string;
  label?: string;
  opts?: {
    label: string;
    value: string;
  }[];
  attrs?: {
    [name: string]: any;
  },
  event?: {
    [name: string]: Function;
  }
}

interface ISearchBtns {
  label: string;
  attrs?: { [name: string]: any };
  callFn: Function;
  key: string;
  show?: boolean;
  loading?: boolean;
  funCode?: string;
  [name: string]: any
}

interface ISearchFormData {
  pipeMaterial?: string;
  failureMajorType?: string;
  failureMinorType?: string;
  failureMinorTypeArr?: string[];
  pipeName?: string;
  time?: any[];
  endTime?: string;
  startTime?: string;
  sampleType: string;
}


interface IImgSaveField {
  imgName: 'pipeImgName' | 'inspectionImgName' | 'defectImgName';
  imgUrl: 'pipeImgUrl' | 'inspectionImgUrl' | 'defectImgUrl';
}

type ITime = ReturnType<typeof setTimeout> | undefined