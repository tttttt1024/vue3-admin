export interface IChartOption {
  itemName?: string;
  sourceType?: string;
  chartType?: string;
  defaultValue:string | null;
  remarks?: string | null;
  itemId?:string;
  formItemId?:string;
  requestType?:string;
}

export interface EventType {
  eventName: string;
  query?: string | Object;
  handler: Function;
  context?: Object;
}