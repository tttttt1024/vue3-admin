
interface ITableColumn {
  dataIndex: string;
  title: string;
  width?: string | number;
  sorted?: boolean;
  formatter?: Function;
  render?: Function;
  fixed?: string;
  [name: string]: any
  children?: ITableColumn[]
}

interface IItemList {
  label?: string;
  name?: string;
  element?: string;
  key?: string;
  label?: string;
  required: boolean;
  type?: number;
  width: string;
  formItemAttrs?: {
    [name: string]: any;
  },
  attrs?: {
    [name: string]: any;
  },
  on?: {
    [name: string]: Function;
  }
}
