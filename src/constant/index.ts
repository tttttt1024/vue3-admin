import dayjs, { Dayjs, OpUnitType } from "dayjs";

export const disabledTime = {
  /**大于等于当前时间 */
  currentDayLessThanOrEqual: (current: Dayjs, type: OpUnitType) => {
    return current && current >= dayjs().endOf(type);
  },
  /**大于等于一年后 */
  currentDayDelayByOneYear: (current: Dayjs, type: OpUnitType) => {
    return current && current >= dayjs().add(1, 'years').endOf(type);
  }
}

export const yearItem = {
  value: "year",
  element: "a-date-picker",
  attrs: {
    picker: 'year',
    valueFormat: 'YYYY',
    allowClear: false,
    style: { width: '200px' },
    disabledDate: (current: Dayjs) => {
      return disabledTime.currentDayDelayByOneYear(current, 'year')
    },
  },
}
export const createYearItem = (attrs = {}, event = {}) => {
  return {
    value: "year",
    element: "a-date-picker",
    attrs: {
      picker: 'year',
      valueFormat: 'YYYY',
      allowClear: false,
      style: { width: '200px' },
      disabledDate: (current: Dayjs) => {
        return disabledTime.currentDayDelayByOneYear(current, 'year')
      },
      ...attrs
    },
    event: {
      ...event
    }
  }

}

export const valueFormatByDay = "YYYY-MM-DD"

export const MonthOptions = [
  {label:'1月',value:'01'},
  {label:'2月',value:'02'},
  {label:'3月',value:'03'},
  {label:'4月',value:'04'},
  {label:'5月',value:'05'},
  {label:'6月',value:'06'},
  {label:'7月',value:'07'},
  {label:'8月',value:'08'},
  {label:'9月',value:'09'},
  {label:'10月',value:'10'},
  {label:'11月',value:'11'},
  {label:'12月',value:'12'},
]