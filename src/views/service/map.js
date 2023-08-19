export default {
    init (){
      const AK = 'ZN3BZ-RA5LI-4GOGI-55GTD-H453T-DEFKJ'
      const TMap_URL = "https://map.qq.com/api/gljs?v=2.exp&key="+ AK +"&callback=onMapCallback";
      return new Promise((resolve, reject) => {
        // 如果已加载直接返回
        if(typeof TMap !== "undefined") {
          resolve(TMap);
          return true;
        }
        // 地图异步加载回调处理
        window.onMapCallback = function () {
          resolve(TMap);
        };
  
        // 插入script脚本
        let scriptNode = document.createElement("script");
        scriptNode.setAttribute("type", "text/javascript");
        scriptNode.setAttribute("src", TMap_URL);
        document.body.appendChild(scriptNode);
      });
    },
    createMarker(tMap,TMap,lat,lng){
      let marker= new TMap.MultiMarker({
        map: tMap,
        styles: {
          // 点标记样式
          marker: new TMap.MarkerStyle({
            width: 20, // 样式宽
            height: 30, // 样式高
            anchor: { x: 10, y: 30 }, // 描点位置
          }),
        },
        geometries: [
          // 点标记数据数组
          {
            // 标记位置(纬度，经度，高度)
            position: new TMap.LatLng(lat, lng),
            id: 'marker',
          },
        ],
      })
      return marker
    }
  }  
