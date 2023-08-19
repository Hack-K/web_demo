<template>
  <el-popover
    v-if="routeList.length > 0"
    popper-class="message-popover application-popover"
    ref="applicationPop"
    placement="right-start"
    width="322"
    trigger="click"
    :visible-arrow="false"
    @show="popoverShow"
    @hide="popoverHide"
  >
    <div class="application-container">
      <div class="application-title">拓展应用</div>
      <el-row class="application-content">
        <el-col :span="8" v-for="(item, index) in routeList" :key="index">
          <div class="application-item flex-column pt-16 pb-16">
            <div
              class="flex-column"
              :class="{ pointer: item.hashPermission }"
              @click="itemClick(item)"
            >
              <div class="application-item-img flex-column mb-8">
                <img
                  :src="
                    item.meta.applicationImagePath
                      ? item.meta.applicationImagePath
                      : item.meta.selectImgPath
                  "
                  class="application-item-icon"
                />
              </div>
              <div class="application-item-name">{{ item.meta.title }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div
      class="application-btn flex-column pointer"
      :class="{ active: application_active }"
      slot="reference"
    >
      <div class="application-btn-img">
        <img :src="application_icon" class="img-default"/>
        <img :src="application_active_icon" class="img-hover"/>
      </div>
      <div class="name">应用</div>
    </div>
  </el-popover>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "ZnApplication",
  props: {
    routeList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      application_active: false,
      application_icon:
        "https://ygl.static.yinuocloud.com/QwWt6hn9SySgXHdzXnTSlwY3Bxuz3S.png",
      application_active_icon:
        "https://ygl.static.yinuocloud.com/lbdyhOoFuEnXGyJaxn1tc7mGSQtcWW.png",
    };
  },
  methods: {
    // 应用点击
    itemClick(item) {
      if (!item.hashPermission) return;
      this.extra.first = item.name;
      const { redirect } = this.handleActiveMenu;
      this.$router.replace(redirect ? redirect : this.handleActiveMenu);
      window.sessionStorage.setItem("extraApplication", item.name);
      this.$refs["applicationPop"].doClose();
      this.$emit("routeUpdate");
    },
    // pop框显示事件
    popoverShow() {
      this.application_active = true;
    },
    // pop框隐藏事件
    popoverHide() {
      this.application_active = false;
    },
  },
  computed: {
    ...mapGetters({
      extra: "settings/extra",
      theme: "settings/theme",
      routes: "routes/routes",
      collapse: "settings/collapse",
      activeName: "routes/activeName",
    }),
    handleActiveMenu() {
      return this.routes.find((route) => route.name === this.extra.first);
    },
  },
};
</script>
<style>
.message-popover.application-popover {
  margin-top: -70px;
  background: #fff!important;
}
</style>
<style lang="scss" scoped>
.application-title {
  padding: 12px 24px;
  line-height: 24px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid $base-line-1;
}
.application-content {
  padding: 8px 12px;
}
.application-item {
  > .flex-column {
    cursor: no-drop;
  }
  &-img {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1px solid $base-line-1;
    background: $base-fill-2;
    transition: all ease-in-out 0.25s;
  }
  &-icon {
    width: 33px;
    height: 33px;
    filter: grayscale(1);
  }
  &-name {
    line-height: 22px;
    color: $base-text-3;
  }
  .pointer {
    transition: all ease-in-out 0.35s;
    cursor: pointer;
    .application-item-icon {
      filter: grayscale(0);
    }
    .application-item-name {
      color: $base-text-5;
    }
  }
  .pointer:hover {
    transform: translateY(-6px);
    .application-item-img{
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1), inset 0px 4px 10px 0px #ffffff;
    }
  }
}
.application-btn {
  width: 54px;
  height: 52px;
  border-radius: 8px;
  backdrop-filter: blur(27px);
  &-img{
    position: relative;
    width: 28px;
    height: 28px;
  }
  img {
    width: 28px;
    height: 28px;
    position: absolute;
    left: 0;
    top: 0;
  }
  .img-hover{
    display: none;
  }
  .name {
    line-height: 20px;
    font-size: 12px;
    color: #fff;
  }
  &.active,
  &:hover {
    background: #0f1d31;
    .img-default{
      display: none;
    }
    .img-hover{
      display: block;
    }
    .name {
      color: $base-Brand1-6;
    }
  }
}
</style>
