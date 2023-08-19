<template>
  <!-- 选择地图抽屉 -->
  <el-drawer
    title="服务地址"
    :visible.sync="drawer"
    :direction="direction"
    :append-to-body="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :destroy-on-close="true"
    :before-close="closeMapDrawer"
    :size="680"
  >
    <div class="map-container">
      <el-form :rules="rules" :model="form" ref="mapForm" class="height-100">
        <div
          ref="areaModal"
          class="container-map pos-relative mb-20"
          id="container-map"
          :style="{ height: drawerHeight + 'px' }"
        >
          <div class="search-wrap pos-absolute">
            <el-autocomplete
              style="width: 100%"
              v-model="form.searchMap"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入地址搜索"
              @select="handleSelect"
              @focus="handleFocus"
              @blur="handleBlur"
            >
              <template slot-scope="{ item }">
                <el-row :span="24">
                  <span class="addr">
                    {{ item.title }}
                  </span>
                  <span style="transform: scale(0.8)">
                    ({{ item.province }}-{{ item.district }})
                  </span>
                </el-row>
              </template>
            </el-autocomplete>
            <el-button
              icon="el-icon-search"
              class="search-button"
              @click="searchSubmit"
            ></el-button>
          </div>
        </div>
        <el-form-item label="服务地址" prop="searchMap">
          <el-input placeholder="请输入服务地址" v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button class="el-cancel" @click="closeMapDrawer">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import Vue from "vue";
import { VueJsonp } from "vue-jsonp";
Vue.use(VueJsonp);
import TMap from "@/utils/map";
export default {
  name: "ChooseMap",
  components: {},
  props: {
    drawer: {
      type: Boolean,
      default: () => true,
    },
    locationData: {
      type: Object,
    },
  },
  data() {
    return {
      direction: "rtl",
      rules: {
        searchMap: {
          required: true,
          trigger: "blur",
          message: "请输入服务地址",
        },
      },
      form: {
        searchMap: "",
        address: "",
        location: {
          lat: "",
          lng: "",
        },
      },
      mapList: [],
      mapLock: false, // 输入框是否冒泡
      drawerHeight: 0,
    };
  },
  methods: {
    show(data) {
      this.drawer = true;
      let centerMark = null;
      if (data) {
        this.form.searchMap = data.searchMap;
        this.form.location.lat = data.location.lat;
        this.form.location.lng = data.location.lng;
        this.form.address = data.searchMap;
        centerMark = JSON.parse(JSON.stringify(data.location));
      }
      // 初始化地图
      if (!this.drawerHeight) {
        this.initMap(centerMark);
      }
      this.$nextTick(() => {
        this.drawerHeight = this.$refs["areaModal"].clientHeight;
      });
    },
    // 取消操作
    closeMapDrawer() {
      this.$emit("closeMapDrawer");
    },
    // 搜索框聚焦
    handleFocus() {
      this.mapLock = true;
    },
    // 搜索框失焦
    handleBlur() {
      this.mapLock = false;
    },
    // 搜索操作
    searchSubmit() {
      if (this.form.searchMap === "") return;
      if (this.mapList.length > 0) {
        this.form.address = `${this.mapList[0]["city"]}${this.mapList[0]["district"]}${this.mapList[0]["title"]}`;
      }
    },
    // 确认操作
    submit() {
      this.$refs["mapForm"].validate((valid) => {
        if (valid) {
          if (this.form.location.lng) {
            this.$emit("getMarkerLocation", this.form);
            this.$emit("closeMapDrawer");
          }
        }
      });
    },

    initMap(data) {
      let center = { lat: 31.226412, lng: 121.471082 };
      if (data) {
        center = { lat: data.lat, lng: data.lng };
      }
      TMap.init().then((TMap) => {
        //TMap地图接口 tMap map.ks
        this.TMap = TMap;
        this.tMap = new TMap.Map("container-map", {
          center: new TMap.LatLng(center.lat, center.lng), //设置地图中心点坐标
          zoom: 15, //设置地图缩放级别
          viewMode: "2D",
          disableDefaultUI: true,
        });
        this.tMap.on("click", (evt) => {
          if (this.mapLock) return;
          let { lat, lng } = evt["latLng"];
          this.MapOnMarker({ lat, lng });
        });
        if (data) {
          this.MapOnMarker(data);
        }
      });
    },
    MapOnMarker({ lat, lng }) {
      this.tMap.setCenter(new this.TMap.LatLng(lat, lng));
      // 存在先删除
      if (this.maker) {
        this.maker.setMap(null);
        this.maker = null;
      }
      this.maker = TMap.createMarker(this.tMap, this.TMap, lat, lng);
      let key = "ZN3BZ-RA5LI-4GOGI-55GTD-H453T-DEFKJ";
      this.$jsonp("https://apis.map.qq.com/ws/geocoder/v1/", {
        key: key,
        output: "jsonp",
        location: `${lat},${lng}`,
      }).then((res) => {
        this.form.searchMap = `${res.result.address_component.city}${res.result.address_component.district}${res.result.formatted_addresses.recommend}`;
        this.form.location = { lat, lng };
      });
    },
    querySearchAsync(keyword, cb) {
      let key = "ZN3BZ-RA5LI-4GOGI-55GTD-H453T-DEFKJ";
      this.$jsonp("https://apis.map.qq.com/ws/place/v1/suggestion", {
        key: key,
        output: "jsonp",
        keyword: keyword || "泰晤士小镇",
      }).then((res) => {
        if (res["data"]) {
          this.mapList = res["data"];
          cb(res["data"]);
        }
      });
    },
    handleSelect(item) {
      // 存在先删除
      if (this.maker) {
        this.maker.setMap(null);
        this.maker = null;
      }
      let { lat, lng } = item["location"];
      // let center = this.tMap.getCenter()
      this.tMap.setCenter(new this.TMap.LatLng(lat, lng));
      this.maker = TMap.createMarker(this.tMap, this.TMap, lat, lng);
      if (this.maker) {
        this.form["searchMap"] = `${item["city"]}${item["district"]}${item["title"]}`;
        this.form.location = item["location"];
        this.form.address = `${item["city"]}${item["district"]}${item["title"]}`;
      }
    },
  },

  created() {
    if (this.locationData) {
      this.form.searchMap = this.locationData.searchMap;
      this.form.location.lat = this.locationData.location.lat;
      this.form.location.lng = this.locationData.location.lng;
      this.form.address = this.locationData.searchMap;
    }
  },
};
</script>
<style lang="scss" scoped>
.map-container {
  height: 100% !important;
}
// 隐藏腾讯地图无用信息
::v-deep .container-map {
  height: calc(100% - 100px) !important;
  div {
    display: none;
  }
  .search-wrap {
    div {
      display: block;
    }
    display: block;
    left: 16px;
    top: 16px;
    right: 16px;
    height: 40px;
    .search-button {
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      background: $base-Brand1-6;
      color: #fff;
      font-size: 16px;
      font-weight: bold;
    }
  }
}
li {
  line-height: normal;
  padding: 7px;
  .addr {
    margin: 0;
    line-height: 34px;
    cursor: pointer;
    color: #606266;
    font-size: 14px;
    list-style: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .highlighted .addr {
    color: #ddd;
  }
}
</style>
