<template>
  <el-drawer
    title="服务地址"
    :visible.sync="showMap"
    :direction="direction"
    :append-to-body="modalToBody"
    :modal-append-to-body="modalToBody"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    ref="areaModal2"
    :destroy-on-close="true"
    :before-close="closeMapDrawer"
    :size="1052"
  >
    <el-form :rules="rules" :model="form" ref="mapForm" class="mapForm">
      <el-row>
        <el-col>
          <el-form-item label="服务地址" prop="searchMap">
            <el-autocomplete
              style="width: 100%"
              v-model="form.searchMap"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入服务地址"
              @select="handleSelect"
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
          </el-form-item>
        </el-col>
        <el-col>
          <div
            id="container-map"
            :style="{ height: drawerHeight - 247 + 'px' }"
          ></div>
        </el-col>
      </el-row>
    </el-form>
    <div class="drawer-footer">
      <el-button class="el-cancel" @click="closeMapDrawer">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import Vue from 'vue'
import { jsonp, VueJsonp } from 'vue-jsonp'
Vue.use(VueJsonp)
import TMap from '../../map'
export default {
  name: 'addDataManagement',
  components: {},
  props: {
    showMap: {
      type: Boolean,
      default: () => true,
    },
    locationData: {
      type: Object,
    },
    modalToBody: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      rules: {
        searchMap: {
          required: true,
          message: '请选择服务地址',
        },
      },
      form: { searchMap: '' },
      drawerHeight: 0,
      locationDesc: {},
      address_text: '',
    }
  },
  methods: {
    show(data) {
      this.drawer = true
      // 初始化地图
      if (!this.drawerHeight) {
        this.initMap(data)
      }
      this.$nextTick(() => {
        this.drawerHeight = this.$refs['areaModal2'].$el.clientHeight
      })
    },
    // 取消操作
    closeMapDrawer() {
      this.$emit('closeMap')
    },
    // 确认操作
    submit() {
      this.$refs['mapForm'].validate((valid) => {
        if (valid) {
          if (this.locationDesc.lng) {
            let params = {
              location: this.locationDesc,
              address_text: this.form.searchMap,
            }
            this.$emit('getMarkerLocation', params)
            this.$emit('closeMap')
          }
        } else {
          return
        }
      })
    },

    initMap(data) {
      let center = { lat: 31.226412, lng: 121.471082 }
      if (data) {
        center = { lat: data.lat, lng: data.lng }
      }
      TMap.init().then((TMap) => {
        //TMap地图接口 tMap map.ks
        this.TMap = TMap
        this.tMap = new TMap.Map('container-map', {
          center: new TMap.LatLng(center.lat, center.lng), //设置地图中心点坐标
          zoom: 15, //设置地图缩放级别
          viewMode: '2D',
          disableDefaultUI: true,
        })
        this.tMap.on('click', (evt) => {
          let { lat, lng } = evt['latLng']
          this.MapOnMarker({ lat, lng })
        })
        if (data) {
          this.MapOnMarker(data)
        }
      })
    },
    MapOnMarker({ lat, lng }) {
      this.tMap.setCenter(new this.TMap.LatLng(lat, lng))
      // 存在先删除
      if (this.maker) {
        this.maker.setMap(null)
        this.maker = null
      }
      this.maker = TMap.createMarker(this.tMap, this.TMap, lat, lng)
      let key = 'ZN3BZ-RA5LI-4GOGI-55GTD-H453T-DEFKJ'
      this.$jsonp('https://apis.map.qq.com/ws/geocoder/v1/', {
        key: key,
        output: 'jsonp',
        location: `${lat},${lng}`,
      }).then((res) => {
        this.address_text = res['result']['address']
        this.locationDesc = { lat, lng }
      })
    },
    querySearchAsync(keyword, cb) {
      let key = 'ZN3BZ-RA5LI-4GOGI-55GTD-H453T-DEFKJ'
      this.$jsonp('https://apis.map.qq.com/ws/place/v1/suggestion', {
        key: key,
        output: 'jsonp',
        keyword: keyword || '泰晤士小镇',
      }).then((res) => {
        if (res['data']) {
          cb(res['data'])
        }
      })
    },
    handleSelect(item) {
      // 存在先删除
      if (this.maker) {
        this.maker.setMap(null)
        this.maker = null
      }
      let { lat, lng } = item['location']
      // let center = this.tMap.getCenter()
      this.tMap.setCenter(new this.TMap.LatLng(lat, lng))
      console.log('TMap', TMap)
      this.maker = TMap.createMarker(this.tMap, this.TMap, lat, lng)
      if (this.maker) {
        this.form['searchMap'] = item['title']
        this.locationDesc = item['location']
        this.address_text = item['title']
      }
    },
  },

  created() {
    if (this.locationData) {
      this.form.searchMap = this.locationData.address_text
      this.address_text = this.locationData.address_text
      this.locationDesc = this.locationData.location
    }
  },
}
</script>
<style lang="scss" scoped>
.mapForm {
  height: 100%;
}
.management-count {
  width: 100%;
  border-radius: 4px;
  height: 53px;
  line-height: 53px;
  background: #f2f3f5;
  border: 1px dashed #e5e6eb;
  border-radius: 4px;
  padding-left: 16px;
}
// 隐藏腾讯地图无用信息
::v-deep #container-map div {
  display: none;
}

li {
  line-height: normal;
  padding: 7px;

  .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
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
