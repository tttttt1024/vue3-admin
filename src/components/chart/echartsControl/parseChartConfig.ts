import { unifyNumber } from "./utils";
import * as echarts from "echarts";

const barOptions = JSON.parse(
  JSON.stringify({
    title: {},
    color: "#2470ff",
    tooltip: {
      confine: true,
      trigger: "item",
      axisPointer: { type: "shadow" },
    },
    xAxis: {
      type: "category",
      axisLabel: { color: "#666" },
    },
    yAxis: {
      name: "(%)",
      type: "value",
      splitLine: { lineStyle: { type: "dashed" } },
      nameGap: 20, // 名称与轴线的间距
      nameTextStyle: {
        verticalAlign: "bottom", // 文字底部对齐容器（向上推）
        padding: [0, 30, 0, 0], // 微调位置：下方向5px（根据实际情况调整）
      },
    },
    series: [
      {
        type: "bar",
        barWidth: 10,
        itemStyle: {},
        cIndex: 1,
        name: "",
        label: {
          // 动态数值标签
          show: false,
          // position: "top",
          // color: "#188df0",
          // fontSize: 14,
          // formatter: (params: any) =>
          //   `${params.value} ↑${params.dataIndex * 15}%`,
        },
        // emphasis: {
        //   // 悬停动画
        //   itemStyle: {
        //     shadowOffsetX: 0,
        //     shadowOffsetY: 5,
        //     shadowBlur: 10,
        //   },
        // },
      },
      // {
      //   name: "均线",
      //   type: "line",
      //   lineStyle: {
      //     color: "#f56c6c",
      //     type: "dashed", // 虚线
      //   },
      //   symbol: "none",
      // },
    ],
    dLen: 3,
  })
);

const lineOptions = JSON.parse(
  JSON.stringify({
    tooltip: {
      confine: true,
      trigger: "item",
      axisPointer: { type: "shadow" },
    },
    // legend: {
    //   data: ["个数", "均线"],
    //   top: "0%", // 调整图例的垂直位置，这里距离顶部 5%
    //   left: "center", // 调整图例的水平位置，这里居中
    // },
    grid: {
      left: "5%", // 调整图表距离左侧的距离
      right: "5%", // 调整图表距离右侧的距离
      top: "20%",
      bottom: "20%", // 调整图表距离底部的距离
      containLabel: true,
    },
    xAxis: {
      type: "category",
      name: null,
    },
    yAxis: {
      type: "value",
      name: "亿方",
      nameGap: 20, // 名称与轴线的间距
      nameTextStyle: {
        verticalAlign: "bottom", // 文字底部对齐容器（向上推）
        padding: [0, 30, 0, 0], // 微调位置：下方向5px（根据实际情况调整）
      },
    },
    series: [
      {
        name: "",
        type: "line",
        symbol: "circle", //将小圆点改成实心 不写symbol默认空心
        symbolSize: 10, //小圆点的大小
        lineStyle: {
          color: "#2470ff", // 青绿色
        },
        itemStyle: {
          color: "#2470ff", // 圆点填充色
        },

        label: {
          show: true, //开启显示
          position: "top", //在上方显示
          textStyle: {
            //数值样式
            color: "#7F7F7F",
            fontSize: 13,
          },
        },
        connectNulls: true,
      },
      {
        name: "均线",
        type: "line",
        lineStyle: {
          color: "#f56c6c",
          type: "dashed", // 虚线
        },
        symbol: "none",
      },
    ],
    dLen: 3,
  })
);
export const OPTIONS = {
  bar: barOptions,
  line: lineOptions,
};

export function getChartConfig(option: any) {
  return new Promise<any>((resolve, rej) => {
    try {
      const { styleCode } = option;
      const _c = styleCode ? JSON.parse(styleCode) : {};
      console.log({ _c });
      // if(_c.series?.[1]?.name==='均线'){
      // _c.series.splice(1,1);
      // _c.series[0].markLine = {
      //   data: [{
      //     silent: true,
      //     yAxis: 100,  // 固定在 y=100 的水平基准线
      //     lineStyle: { color: '#f56c6c', type: 'dashed' }, // 样式自定义
      //     label: { show: false, position: 'end', formatter: '标准值' } // 标签
      //   }],
      //   symbol: 'none' // 隐藏首尾标记
      // }
      // }
      resolve({
        code: 200,
        data: _c,
      });
    } catch (error) {
      rej(error);
    }
  });
}

export interface IPieOption {
  title: string;
  subtext: string;
  bgColor: string[] | Function;
  text: string;
  unit: string;
  yAxisUnit: string;
  barWidth: number;
  barMinWidth:number;
  dataZoomNum: number;
  yKey: string;
  xKey: string;
  percent: number;
  labelFormatter: Function;
  legend: Record<string, any>;
  center: string[];
  titleFn: Function;
  radius: string[];
  is3D: boolean;
  getSeries: Function;
  tooltipFormatter?: Function;
  yAxisName?: string;
}

export function createPieOption(
  cData: any[],
  option = {} as Partial<IPieOption>
) {
  const {
    subtext,
    bgColor = [`#2571FF`, `#F6BE1B`, `#ff9900`, `#f56c6c`, `#19be6b`],
    text,
    unit = "",
    yKey = "value",
    xKey = "name",
    percent,
    labelFormatter,
    center = ["50%", "45%"], // 将饼图向上移动，与底部产生间距
    radius = ["45%", "65%"],
    legend = {
      orient: "horizontal", // 水平排列
      bottom: 0, // 距离底部20px，增加与图表的间距
      left: "center", // 居中
      itemWidth: 16, // 图例小圆点宽度
      itemHeight: 8, // 图例小圆点高度
      itemGap: 30,
      icon: "circle",
      textStyle: {
        color: "#333", // 文字颜色
        fontSize: 14,
      },
    },
    titleFn = (titleOption: any) => {
      const { subtext, percent, total, unit } = titleOption;
      return {
        subtext: subtext ? subtext : "",
        // text: total + "个",
        text: `{value|${percent || total}}{unit|${percent ? "%" : unit}}`,
        left: "center",
        top: "middle",
        textStyle: {
          // color: "#333",
          // fontSize: 26,
          // textAlign: "center",
          rich: {
            value: {
              // 数值部分样式
              color: "#333",
              fontSize: 26,
              fontWeight: "bold",
              textAlign: "center",
            },
            unit: {
              // 单位部分样式
              color: "#333",
              fontSize: 14,
              padding: [0, 0, 0, 5], // 左侧留出5px间距
              fontWeight: "bold",
            },
          },
        },
        subtextStyle: {
          fontFamily: "微软雅黑",
          fontSize: 14,
          color: "#999",
          fontWeight: "bold",
        },
      };
    },
  } = option;
  const data =
    cData?.map((e) => {
      return {
        ...e,
        name: e[xKey],
        value: unifyNumber(Number(e[yKey])),
      };
    }) || [];
  let total = 0;
  data.forEach((e) => {
    total = total + Number(e[yKey]);
  });
  total = unifyNumber(total) as number;
  const chartOption: any = {
    backgroundColor: "#fff",
    tooltip: {
      trigger: "item",
      formatter: "{b} : {c} ({d}%)",
    },
    title: titleFn({ subtext, percent, total, unit }),
    color: typeof bgColor === "function" ? bgColor : bgColor, // 图形颜色
    graphic: {
      type: "text",
      left: "center",
      top: "center",
      style: {
        text,
        textAlign: "center",
        fill: "#82D1FD",
        fontSize: 16,
        fontWeight: 600,
      },
    },
    series: [
      {
        type: "pie",
        radius,
        center,
        data: data,
        itemStyle: {
          color: function (params: any) {
            // 如果 bgColor 是函数，则调用函数
            if (typeof bgColor === "function") {
              return bgColor(params);
            }
            // 如果 bgColor 是数组，则按索引取色
            if (Array.isArray(bgColor)) {
              return bgColor[params.dataIndex % bgColor.length];
            }
            // 默认颜色
            return bgColor;
          },
        },
        label: {
          // formatter: "{b} : {c} ({d}%)",
          overflow: "break",
          align: "center",
          position: "outside", // 确保标签在饼图外部
          distanceToLabelLine: 5, // 标签与引导线的距离
          formatter: labelFormatter
            ? labelFormatter?.(unit)
            : function (params: any) {
                // 分两行显示
                return `{a|${params.name}:}  {b|${params.value} ${unit}}`;
              },
          color: "#000",
          rich: {
            a: {
              fontSize: 14,
              color: "#999",
            },
            b: {
              fontSize: 14,
              color: "#333",
              padding: [1, 0, 0, 0], // 左边加8像素间距
            },
          },
        },
        labelLine: {
          show: true,
          length: 20, // 第一段线长度
          length2: 65, // 第二段线长度，调大一点间距就大
          smooth: false, // 曲线更自然
        },
        //  itemStyle: {        //饼图按块划分时是否需要用线隔开，  不需要注释即可
        //             normal: {
        //                 borderWidth: 2,
        //                 borderColor: '#05366F'
        //             }
        //         }
      },
    ],
  };
  if (cData && Array.isArray(cData) && cData.length > 0) {
    chartOption.legend = legend;
  }
  return chartOption;
}

export function createBarOption(
  cData: any[],
  option = {} as Partial<IPieOption>
) {
  const {
    bgColor = [`#2571FF`, `#F6BE1B`, `#ff9900`, `#f56c6c`, `#19be6b`],
    yAxisUnit,
    barWidth = 25,
    dataZoomNum = 6,
    yKey = "value",
    xKey = "name",
    unit = "",
    legend = {},
    getSeries = (yData: any[], bgColor: string[], barWidth: number) => {
      return [
        {
          data: yData,
          type: "bar",
          barWidth, // 固定柱子宽度为 25
          itemStyle: {
            color: function (params: any) {
              return bgColor?.[params.dataIndex] || bgColor?.[0] || "#2470FF";
            },
          },
          label: {
            show: true, // 显示标签
            position: "top", // 标签位置在柱子顶部
            formatter: "{c}", // 标签内容为数据值
          },
        },
      ];
    },
    tooltipFormatter = (params: any, unit: string) => {
      // params.marker 是小圆点
      // params.name 是x轴名
      // params.value 是y轴值
      // params.seriesName 是系列名
      return `${params.marker}<span style="margin-left:2px">${
        params.name
      }</span><br/>
      <span style="margin-left:16px;margin-right:6px">${params.value}</span>${
        unit || ""
      }
      `;
    },
    yAxisName = "",
  } = option;
  const xData = cData.map((item) => item[xKey]) || [];
  const yData = (cData || []).map((item) => {
    return {
      ...item,
      value: item[yKey],
    };
  });
  // 判断是否需要 dataZoom
  const needDataZoom = cData.length > dataZoomNum;
  // 图表配置项
  const chartOption: any = {
    backgroundColor: "#fff",
    grid: {
      left: "50px",
      right: "50px",
      top: "50px",
      bottom: "40px",
    },
    legend,
    tooltip: {
      trigger: "item",
      padding: [10, 16],
      formatter: function (params: any) {
        // params.marker 是小圆点
        // params.name 是x轴名
        // params.value 是y轴值
        // params.seriesName 是系列名
        return tooltipFormatter(params, unit);
      },
    },
    xAxis: {
      type: "category",
      data: xData,
      axisTick: {
        show: false, // 隐藏 X 轴刻度
      },
      axisLabel: {
        fontSize: 12,
        interval: 0,
        formatter: (value: string) => {
          if (xData.length > 3) {
            const maxLength = 5;
            const lines = [];
            for (let i = 0; i < value.length; i += maxLength) {
              lines.push(value.slice(i, i + maxLength));
            }
            return lines.join("\n");
          } else {
            return value;
          }
        },
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        show: false, // 取消 Y 轴轴线
      },
      axisTick: {
        show: false, // 隐藏 Y 轴刻度
      },
      name: yAxisName, // 设置 Y 轴单位
      nameTextStyle: {
        fontSize: 12,
        color: "#999",
        padding: [0, 20, 0, 0],
        align: "right", // 让Y轴名称居中
      },
    },
    series: getSeries(yData, bgColor, barWidth),
  };
  if (needDataZoom) {
    chartOption.dataZoom = [
      {
        type: "slider",
        show: true,
        xAxisIndex: 0,
        start: 0,
        end: 60,
        height: 16,
        bottom: 10,
      },
      {
        type: "inside",
        xAxisIndex: 0,
        start: 0,
        end: 60,
      },
    ];
  }
  return chartOption;
}

export function createLineOptionByAreaStyle(
  cData: any[],
  option = {} as Partial<IPieOption>
) {
  const { yAxisUnit, yKey = "count", xKey = "type", unit = "" } = option;
  const xData = cData.map((item) => item[xKey]) || [];
  const yData = cData.map((item) => item[yKey]) || [];
  // 图表配置项
  const chartOption: any = {
    backgroundColor: "#fff",
    tooltip: {
      confine: true,
      trigger: "item",
      axisPointer: { type: "shadow" },
      formatter: function (params: any) {
        // params.marker 是小圆点
        // params.name 是x轴名
        // params.value 是y轴值
        // params.seriesName 是系列名
        return `${params.marker}<span style="margin-left:2px">${
          params.name
        }</span><br/>
        <span style="margin-left:16px;margin-right:6px">${params.value}</span>${
          unit || ""
        }
        `;
      },
    },
    grid: {
      left: "5%", // 调整图表距离左侧的距离
      right: "5%", // 调整图表距离右侧的距离
      top: "20%",
      bottom: "20%", // 调整图表距离底部的距离
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xData,
    },
    yAxis: {
      type: "value",
      name: yAxisUnit,
      nameGap: 20, // 名称与轴线的间距
      nameTextStyle: {
        verticalAlign: "bottom", // 文字底部对齐容器（向上推）
        padding: [0, 30, 0, 0], // 微调位置：下方向5px（根据实际情况调整）
      },
    },
    series: [
      {
        name: "",
        data: yData,
        type: "line",
        symbol: "circle", //将小圆点改成实心 不写symbol默认空心
        symbolSize: 10, //小圆点的大小
        showSymbol: true,
        lineStyle: {
          color: "#2470FE", // 折线颜色
        },
        itemStyle: {
          color: "#2470FE", // 圆点填充色
        },
        // label: {
        //   show: true, //开启显示
        //   position: "top", //在上方显示
        //   textStyle: {
        //     //数值样式
        //     color: "#7F7F7F",
        //     fontSize: 13,
        //   },
        // },
        connectNulls: true,
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(42,123,255,0.3)" }, // 顶部颜色
            { offset: 1, color: "rgba(255,255,255,0)" }, // 底部颜色
          ]),
        },
      },
    ],
    dLen: 3,
  };
  return chartOption;
}

/**
 * 生成仪表盘 ECharts 配置
 * @param percent 百分比（0~100）
 * @param value 数值（可为字符串或数字，支持自定义显示）
 * @param unit 单位（如 'kg'）
 * @param title 标题（如 '加注量'）
 */
export function createGaugeOption(
  percent: number,
  value: number | string,
  unit: string = "",
  title: string = ""
) {
  return {
    backgroundColor: "#fff",
    series: [
      {
        type: "gauge",
        min: 0,
        max: 100,
        splitNumber: 4, // 4段=5刻度
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [percent / 100, "#2470ff"], // 已完成部分
              [1, "#AFCBFF"], // 剩余部分
            ],
          },
        },
        splitLine: {
          show: true,
          distance: 0, // 0 表示紧贴圆环，负值会更靠内
          lineStyle: {
            color: "#ccc", // 分隔线颜色
            width: 2, // 分隔线宽度
          },
          length: 15, // 分隔线长度
        },
        pointer: {
          itemStyle: {
            color: "#2470ff",
          },
          width: 6,
          length: "60%",
        },
        axisTick: {
          distance: -30,
          length: 8,
          show: false,
          lineStyle: {
            color: "#2470ff",
            width: 2,
          },
        },
        axisLabel: {
          color: "#2470ff",
          fontSize: 12,
          distance: -35,
          formatter: function (val: number) {
            // 只显示 0、25、50、75、100
            return [0, 25, 50, 75, 100].includes(val) ? val : "";
          },
        },
        detail: {
          valueAnimation: true,
          fontSize: 32,
          fontWeight: "bolder",
          color: "#333",
          offsetCenter: [0, "100%"],
          formatter: function () {
            // value 支持自定义内容
            return typeof value === "number" ? `${value}${unit}` : value;
          },
        },
        title: {
          offsetCenter: [0, "60%"],
          color: "#333",
          fontSize: 16,
        },
        data: [
          {
            value: percent, // 指针位置
            name: title,
          },
        ],
      },
    ],
  };
}
