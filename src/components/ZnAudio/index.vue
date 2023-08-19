<template>
  <div class="audio-template" :class="{ disabled: src === '' }">
    <!-- 音频非空 -->
    <mini-audio :audio-source="src" v-if="src !== ''"></mini-audio>
    <!-- 音频为空 -->
    <div class="vueAudioBetter" v-else>
      <div class="operate">
        <span class="iconfont icon-playcircle-fill"></span>
        <span class="iconfont icon-stopcircle-fill"></span>
        <span style="color: white; padding-left: 6px">00:00 / 00:00</span>
      </div>
      <div class="slider">
        <div class="progressInfo"></div>
        <div class="process" style="width: 0px"></div>
        <div class="thunk" style="left: 0px">
          <div class="block"></div>
        </div>
      </div>
      <span class="iconfont icon-notificationfill"></span>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueAudio from 'vue-audio-better'
  // 加载音频插件
  Vue.use(VueAudio)
  export default {
    name: 'Audio',
    props: {
      src: {
        type: String,
        default: () => '',
      },
    },
    created() {},
  }
</script>
<style lang="scss" scoped>
  .audio-template {
    width: 100%;
    ::v-deep .vueAudioBetter {
      position: relative;
      margin: 0;
      width: 100%;
      height: 34px !important;
      line-height: 34px !important;
      padding: 2px;
      padding-left: 16px;
      border-radius: 16px;
      background: $base-line-1;
      box-shadow: unset;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      // 操作按钮
      .operate {
        position: absolute;
        height: 27px;
        right: 2px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 158px;
        span {
          top: unset;
        }
        span:last-child {
          color: $base-text-5 !important;
          font-size: 12px;
          position: absolute;
          right: 70px;
        }
        .icon-pausecircle-fill,
        .icon-playcircle-fill,
        .icon-stopcircle-fill {
          font-size: 27px;
          color: $base-main-tone !important;
        }
        .icon-stopcircle-fill {
          margin-left: 6px;
        }
      }
      // 进度条
      .slider {
        width: calc(100% - 188px);
        height: 8px;
        border-radius: 10px;
        background: #dcdfe4;
        .process {
          height: 8px;
          border-radius: 10px;
          background: $base-main-tone;
        }
        .thunk {
          width: 12px;
          height: 12px;
          top: -2px;
          .block {
            width: 100%;
            height: 100%;
          }
        }
      }
      // 音频图标
      .icon-notificationfill {
        position: absolute;
        right: 160px;
        pointer-events: none;
      }
    }
    // 不存在链接状态
    &.disabled {
      ::v-deep .vueAudioBetter {
        pointer-events: none;
        .icon-pausecircle-fill,
        .icon-playcircle-fill,
        .icon-stopcircle-fill,
        .icon-notificationfill {
          color: #dcdfe4 !important;
        }
      }
    }
  }
</style>
