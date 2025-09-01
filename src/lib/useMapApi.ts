import { reactive, ref } from 'vue'
export default function useMapApi(params?: any): any {
  const { appCode, baseUrl } = window.APP_CONFIG
  const mapState: any = reactive({
    mapApi: null,
    mapLoadStatus: false,
    waitTimer: {},
  })
  let mapApi = ref()
  const mapProps = params || {
    appCode,
    baseUrl,
    requestHeader: {
      token: localStorage.token,
    },
    mapSubComponentsVisible: {
      mapSwitch: false,
      layerTree: false,
      query: false,
    },
    esIndex: 'gjgx',
  }
  const onload = (api: any) => {
    mapState.mapApi = api
    mapState.mapLoadStatus = true
  }
  function addMark(wkt: string, url: any, infos = {}, scale = 0.2) {
    const params = {
      wkt, //wkt
      url, //图片地址，相对index.html
      infos,
      scale, //缩放 二维地图图标大小用此属性控制,设置宽高无效
    }
    return mapState.mapApi.renderMarker(params)
  }
  function addLabel(wkt: string, text: string, fontsize = 16, color = 'red') {
    const params = {
      wkt,
      text,
      fontsize,
      color,
    }

    return mapState.mapApi.renderLabel(params)
  }
  /** 绘制多条线（自动飞行定位）
   * @param LineArr wkt线段数组
   * @param shapeKey 数组内 wkt 数据键名 （默认shape）
   * @param colorKey 数组内 线颜色 数据键名 （默认color）
   * @param width 数组内 线宽度
   * @param remove 开始前是否移除管线图层
   */
  function drawMultiLine(
    LineArr: any[],
    shapeKey = 'shape',
    colorKey = 'color',
    width = 5,
    remove = true,
    locationByWkt?: any
  ) {
    // console.log('划线',LineArr);
    if (!LineArr.length) return
    let a = null
    waitFunc(
      function () {
        let points: string | any[] = []
        // 移除所有管线
        if (remove && mapState.mapApi?.removeGeometryByType)
          mapState.mapApi?.removeGeometryByType('polyline')
        LineArr.filter((v: any) => v).forEach((item: { [x: string]: any }, _ix: any) => {
          // 没有空间数据类型则绘制空
          if (!item[shapeKey]) return
          a = mapState.mapApi.renderPolyline({
            wkt: item[shapeKey],
            color: item[colorKey] || 'yellow',
            width: width,
            info: item,
          })

          let point = window.Terraformer.WKT.parse(item[shapeKey])?.coordinates
          points = [...points, ...point]
        })
        if (!points?.length) return
        mapState.mapApi.locationByWkt(
          locationByWkt ? locationByWkt[shapeKey] : LineArr[0][shapeKey]
        )
      },
      'mapState.mapLoadStatus',
      'drawMultiLine'
    )
    return a
  }
  function waitFunc(fn: Function, condition: string, id: string) {
    if (eval(condition)) {
      if (mapState.waitTimer[id]) clearTimeout(mapState.waitTimer[id])
      fn()
      return
    }
    mapState.waitTimer[id] = setTimeout(() => {
      waitFunc(fn, condition, id)
    }, 200)
  }
  function removeGeoLayerById(layers: any[]) {
    return new Promise<void>((resolve, reject) => {
      try {
        if (!layers.length) return

        layers.forEach((e) => {
          mapState.mapApi.removeGeoLayerById(e)
        })
      } catch (error) {
        reject(error)
      } finally {
        resolve()
      }
    })
  }
  // 打开默认弹窗
  function openDetailPopover(config: any, position: Array<number>) {
    mapState.mapApi.locationByWkt(`LINESTRING(${position[0]} ${position[1]})`)
    mapState.mapApi.openDetailPopover(config, position)
    flyTo(position)
  }
  // 单点飞行定位
  function flyTo(postion: any) {
    mapState.mapApi.instance2d.map.flyTo({
      center: postion || null,
      zoom: 17.3,
      bearing: 0,
      speed: 1.5, // make the flying slow
      curve: 2, // change the speed at which it zooms out
      easing: function (t) {
        return t
      },
    })
  }
  // 点座标转换
  const getPOINT = (wkt) => {
    let a = wkt.indexOf('(')
    let b = wkt.indexOf(')')
    let c = wkt.slice(a + 1, b)
    let d = c.split(' ')
    let e = d.map((v) => Number(v))
    return e
  }
  // 获取中心店的位置
  function calculateCenter(points) {
    const totalPoints = points.length
    let sumLatitude = 0
    let sumLongitude = 0

    for (const point of points) {
      // 解析 WKT 字符串，提取经纬度值
      const coordinates = point.match(/\d+\.\d+/g)
      const latitude = parseFloat(coordinates[1])
      const longitude = parseFloat(coordinates[0])

      sumLatitude += latitude
      sumLongitude += longitude
    }

    const centerLatitude = sumLatitude / totalPoints
    const centerLongitude = sumLongitude / totalPoints

    // 构建包含平均经纬度的新点
    const centerPoint = `POINT(${centerLongitude} ${centerLatitude})`
    return centerPoint
  }
  /** 展示点图层集合(单图层)）
   * @param a:['106.01983 32.248505']
   * @param makers ['监测015']-点标注
   * @param choosePoint 点图标
   */
  const createPointsLayer = async (a, makers = [], Points, data = []) => {
    console.log('图层参数', a, makers, Points, data)

    mapApi.value = mapState.mapApi.instance2d.map
    // 0.组合坐标数据
    let b = []
    a.forEach((v) => {
      let c = v.split(' ')
      let d = [Number(c[0]), Number(c[1])]
      b.push(d)
    })

    // 1.创建一个空的图层集合
    mapApi.value.addSource('polygon-layer', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    })
    // 2.添加要素到图层集合
    let c = []
    b.forEach((v, i) => {
      const iconType = data[i] || 'default' // 获取当前图标的类型，默认为'default'
      let iconImage = 'polygon-layer' // 默认图标
      if (iconType == '完好') {
        iconImage = 'icon-type1' // 类型1的图标
      } else if (iconType == '损坏') {
        iconImage = 'icon-type2' // 类型2的图标
      }
      c.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: v,
        },
        properties: {
          title: makers[i],
          iconType: iconType, // 将图标类型存储在属性中，以便在渲染时使用
        },
      })
    })
    console.log('c', c)

    const source = mapApi.value.getSource('polygon-layer')
    source.setData({
      type: 'FeatureCollection',
      features: c,
    })

    // 3.自定义标注图标样式+渲染图层
    mapApi.value.loadImage(Points[0], function (error, image) {
      if (error) throw error

      mapApi.value.addImage('polygon-layer', image)
    })
    // 3.自定义标注图标样式+渲染图层
    if (Points.length == 2) {
      mapApi.value.loadImage(Points[0], function (error, image) {
        mapApi.value.addImage('icon-type1', image)
      })
      mapApi.value.loadImage(Points[1], function (error, image) {
        mapApi.value.addImage('icon-type2', image)
      })
    }
    // 添加标注图层
    mapApi.value.addLayer({
      id: 'polygon-layer',
      type: 'symbol',
      source: 'polygon-layer',
      minzoom: 0,
      maxzoom: 21,
      layout: {
        // 'icon-image': 'polygon-layer', // 使用自定义图标
        'icon-image': [
          'match',
          ['get', 'iconType'],
          '完好',
          'icon-type1',
          '损坏',
          'icon-type2',
          'polygon-layer',
        ], // 根据图标类型选择图标
        'icon-rotate': ['get', 'angle'], // 动态计算点的角度 // 随机旋转角度
        'icon-allow-overlap': false,
        'icon-ignore-placement': false,
        'icon-offset': [0, -10],
        'icon-size': 0.2, // 设置标注图标大小为原始大小的0.2倍
        'text-rotate': 360,
        'text-allow-overlap': false,
        'text-ignore-placement': false,
        'text-field': ['get', 'title'], // 获取注解集合属性中的文本作为标注文本
        'text-size': 16,
        'text-offset': [0, 1.5],
        'text-anchor': 'center',
      },
      paint: {
        'text-halo-color': '#000000', // 设置标注文本的阴影颜色为黑色
        'text-halo-width': 1.5, // 设置标注文本的阴影宽度
        'text-color': '#ffffff', // 设置标注文本颜色为白色
      },
      filter: ['in', '$type', 'Point'],
    })
    // 4.飞行
    let as = `LINESTRING(${a.join(',')})`
    mapState.mapApi.locationByWkt(as)
    console.log('mapApi.value', mapApi.value.getStyle())
    // 监听地图缩放事件
    // mapApi.value.on('zoomend', handleZoomEnd)
    setTimeout(() => {
      let zoom = mapApi.value.getZoom()
      if (zoom > 17.3) flyTo(null)
    }, 1500)
  }
  function removePointsLayer(currentPoints) {
    mapApi.value = mapState.mapApi.instance2d.map
    let hasLayer = mapApi.value.getLayer(currentPoints)
    let hasSource = mapApi.value.getSource(currentPoints)
    // 先删
    if (hasLayer) {
      mapApi.value.removeLayer(currentPoints)
    }
    if (hasSource) {
      mapApi.value.removeSource(currentPoints)
      mapApi.value.removeImage(currentPoints)
    }
    if (mapApi.value.getSource('icon-type1')) {
      mapApi.value.removeImage('icon-type1')
    }
    if (mapApi.value.getSource('icon-type2')) {
      mapApi.value.removeImage('icon-type2')
    }
  }
  // 查看点坐标数组中是否有相近点（标记分散）-待优化
  function findDuplicateElements(arr) {
    const countMap = {}

    for (let i = 0; i < arr.length; i++) {
      const element = arr[i]
      const key = `${element[0].toFixed(4)}_${element[1].toFixed(4)}`

      if (countMap[key]) {
        countMap[key]++
      } else {
        countMap[key] = 1
      }
    }

    const duplicates = []

    for (const key in countMap) {
      if (countMap[key] >= 2) {
        const [intPart, decimalPart] = key.split('_')
        // duplicates.push(`${parseFloat(intPart)} ${parseFloat(decimalPart)}`)
        duplicates.push([parseFloat(intPart), parseFloat(decimalPart)])
      }
    }

    return duplicates
  }

  return {
    mapProps,
    onload,
    mapState,
    waitFunc,
    drawMultiLine,
    addMark,
    addLabel,
    removeGeoLayerById,
    openDetailPopover,
    flyTo,
    getPOINT,
    calculateCenter,
    createPointsLayer,
    removePointsLayer,
  }
}
