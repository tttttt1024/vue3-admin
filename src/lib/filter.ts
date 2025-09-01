import { stationType , stationLevel } from "./opts"

export const formatStationType = (val:string)=>{
    const arr = stationType.filter(item => item.value == val);
    return arr[0].label || ''
}
export const formatStationLevel= (val:string)=>{
    const arr = stationLevel.filter(item => item?.value == val);
    return arr[0]?.label || ''
}