<template>
  <el-popover
    popper-class="message-popover"
    style="padding: 0 !important"
    placement="left-start"
    v-if="theme.showDownLoading"
    width="700"
    trigger="click"
    v-model="visible"
    :visible-arrow="false"
  >
    <div class="message">
      <div class="left">
        <div class="left-title pl-16">通知中心</div>
        <div class="left-check">
          <div
            @click="handleMessage(1)"
            :class="{
              'left-chcek-item': true,
              'left-chcek-item_select': message_type === 1 || false,
            }"
          >
            <img
              style="width: 32px; height: 32px"
              src="@/assets/images/menu/icon-message.png"
              alt=""
            />
            <span>系统通知</span>
            <div class="message-count" v-if="notice_unread > 0">
              {{ notice_unread }}
            </div>
          </div>

          <div
            :class="{
              'left-chcek-item': true,
              'left-chcek-item_select': message_type === 2 || false,
            }"
            @click="handleMessage(2)"
          >
            <img
              style="width: 32px; height: 32px"
              src="@/assets/images/menu/icon-load.png"
              alt=""
            />
            <span>下载通知</span>
            <!-- <div class="message-count">10</div> -->
          </div>
        </div>
      </div>
      <!-- 系统通知 -->
      <div class="right" v-if="message_type === 1">
        <div class="right-tabs pl-16">
          <div
            @click="handleMessageType(0)"
            :class="{
              'right-tabs-item': true,
              'mr-24': true,
              'right-tabs-item-select': type === 0 || false,
            }"
          >
            未读
          </div>
          <div
            @click="handleMessageType(1)"
            :class="{
              'right-tabs-item': true,
              'mr-24': true,
              'right-tabs-item-select': type === 1 || false,
            }"
          >
            已读
            <!-- {{ messageList.length }} -->
          </div>
        </div>

        <div
          class="message-list"
          v-if="message_type === 1 && messageList.length"
          v-infinite-scroll="load"
          :infinite-scroll-disabled="load_disabled"
        >
          <div
            class="message-item"
            v-for="(item, index) of getIsReady(messageList, type)"
            :key="index"
          >
            <!-- 时间 -->
            <div class="message-item-time">
              {{ item.create_time }}
              <!-- time: -->
              <!-- <span style="color: red">{{ index }}}</span> -->
            </div>
            <div class="message-item-desc">
              <div style="display: flex; align-items: center">
                <div
                  class="message-item-status"
                  v-if="!item.ready && type === 0"
                ></div>
                <div
                  :class="'message-item-type message-item-type_' + item.type"
                >
                  {{ getMessageItemType(item.data_type, true) }}
                </div>

                <div class="message-item-title">
                  {{ item.title }}
                  <el-tooltip content="标记为已读" placement="top">
                    <zn-icon
                      v-if="!item.ready && type === 0"
                      class="message-ok"
                      @click="handleMessageReady(item, index)"
                      :iconName="'message_ready'"
                    />
                  </el-tooltip>
                </div>
              </div>

              <!-- 消息内容 -->
              <div class="message-content">
                <!-- 客户通知 -->
                <div class="flex" v-if="item.type === 1">
                  <div class="message-key">分配客户</div>
                  <div class="message-value">
                    {{ item.source_param.describe }}
                  </div>
                </div>

                <!-- 客户转移通知 -->
                <div class="flex" v-if="item.type === 2">
                  <div class="message-key">转移客户</div>
                  <div class="message-value" v-if="item.source_param.name">
                    {{ item.source_param.name }}
                  </div>
                  <div class="message-value" v-else>
                    {{ item.source_param.describe }}
                  </div>
                </div>

                <!-- 未接来电 -->
                <div v-if="item.type === 3">
                  <div class="flex">
                    <div class="message-key">客户姓名</div>
                    <div class="message-value">
                      {{ item.source_param.name }}
                    </div>
                  </div>

                  <div class="flex mt-8">
                    <div class="message-key">呼入号码</div>
                    <div class="message-value">
                      {{ item.source_param.phone }}
                    </div>
                  </div>
                </div>

                <!-- 任务将截止 -->
                <div v-if="item.type === 4">
                  <div class="flex">
                    <div class="message-key">任务名称</div>
                    <div class="message-value">
                      {{ item.source_param.title }}
                    </div>
                  </div>

                  <div class="flex mt-8">
                    <div class="message-key">客户姓名</div>
                    <div class="message-value">
                      {{ item.source_param.name }}
                    </div>
                  </div>

                  <div class="flex mt-8">
                    <div class="message-key">截止时间</div>
                    <div class="message-value">
                      {{ item.source_param.time }}
                    </div>
                  </div>
                </div>

                <!-- 工单将截止 -->
                <div v-if="item.type === 5">
                  <div class="flex">
                    <div class="message-key">工单名称</div>
                    <div class="message-value">
                      {{ item.source_param.title }}
                    </div>
                  </div>

                  <div class="flex mt-8">
                    <div class="message-key">客户姓名</div>
                    <div class="message-value">
                      {{ item.source_param.name }}
                    </div>
                  </div>

                  <div class="flex mt-8">
                    <div class="message-key">结束时间</div>
                    <div class="message-value">
                      {{ item.source_param.time }}
                    </div>
                  </div>
                </div>

                <!-- 您有新的工单 -->
                <div v-if="item.type === 6">
                  <div class="flex">
                    <div class="message-key">工单名称</div>
                    <div class="message-value">
                      {{ item.source_param.title }}
                    </div>
                  </div>

                  <div class="flex mt-8">
                    <div class="message-key">客户姓名</div>
                    <div class="message-value">
                      {{ item.source_param.name }}
                    </div>
                  </div>
                </div>

                <!-- 工单转移 -->
                <div v-if="item.type === 7">
                  <div class="flex">
                    <div class="message-key">工单名称</div>
                    <div class="message-value">
                      {{ item.source_param.title }}
                    </div>
                  </div>

                  <div class="flex mt-8">
                    <div class="message-key">客户姓名</div>
                    <div class="message-value">
                      {{ item.source_param.name }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="no_data"
          v-if="messageList.length === 0 && message_type === 1"
        >
          <img src="@/assets/images/pic-tongyong.png" alt="" />
          <div>没有数据了</div>
        </div>
      </div>
      <!-- 下载通知 -->
      <div class="right" v-if="message_type === 2">
        <div class="right-tabs pl-16">
          <div class="right-tabs-item right-tabs-item-select">近7天</div>
        </div>
        <div class="message-list" v-if="fileList.length">
          <div class="down-list">
            <div
              class="down-item"
              v-for="(item, index) in fileList"
              :key="index"
            >
              <p class="down-time mb-10">{{ item.create_time }}</p>
              <div class="down-item-content">
                <img
                  class="down-img"
                  src="@/assets/images/import-emplate.png"
                  alt=""
                />
                <div class="down-text pl-8 flex-1">
                  <div class="down-name">{{ item.title }}</div>
                  <div
                    class="down-tips"
                    :class="{ 'down-tips-red': item.status === 2 }"
                  >
                    {{ item.describe }}
                  </div>
                </div>
                <div class="down-operate">
                  <!-- 下载中 -->
                  <div class="down-operate-ing" v-if="item.status === 0">
                    <el-progress
                      type="circle"
                      :percentage="25"
                      :stroke-width="3"
                      :width="18"
                      :show-text="false"
                      :color="'#005BD9'"
                    ></el-progress>
                  </div>
                  <!-- 成功 -->
                  <zn-icon
                    v-else-if="item.status === 1"
                    class="download-icon"
                    :iconName="'import'"
                    @click.stop="download(item)"
                  />
                  <!-- 失败 -->
                  <div class="down-operate-fail flex-column" v-else>
                    <span>!</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="no_data" v-if="fileList.length === 0 && message_type === 2">
          <img src="@/assets/images/pic-tongyong.png" alt="" />
          <div>没有下载数据了</div>
        </div>
      </div>
    </div>
    <div
      class="ri-animation-border"
      slot="reference"
      @click=";(visible = true && getFileList()), getMessageListData()"
    >
      <el-badge :is-dot="notice_unread > 0" class="unread flex-column" :value="12">
        <zn-icon :iconName="'icon-bell'" />
      </el-badge>
      <!-- <zn-icon class="animation-icon" :iconName="'import'" /> -->
    </div>
  </el-popover>
</template>
<script>
import { downloadFileLog } from '@/api'
import { noticeList, noticeRead, getNoticeExData } from '@/api/system/message'
import { mapGetters } from 'vuex'
import Push from '@/utils/push'
export default {
  name: 'ZnDownLoading',
  components: {},
  data() {
    return {
      //0未读  1已读
      type: 0,
      // 1系统通知 2 下载通知
      message_type: 1,
      visible: false,
      fileList: [], // 下载进程管理列表
      messageList: [],
      load_disabled: false,
      page: 1,
      noticeData: [],
      unready: 0,
      notice_unread: 0,
    }
  },
  computed: {
    ...mapGetters({
      theme: 'settings/theme',
    }),
    notice_unread_count() {
      return this.notice_unread > 0
    },
  },
  watch: {},
  created() {
    let self = this
    // 获取未读消息总数
    this.getMessageUnread()
    this.notice_unread = this.$store.state.user.notice_unread
    getNoticeExData({}).then((res) => {
      this.noticeData = res['data']['data_type']
    })

    // 获取未读消息总数
    this.getMessageUnread()

    // 创建websocket
    let connection = new Push.Push({
      url: process.env.VUE_APP_SOKCET_URL, // websocket地址
      app_key: process.env.VUE_APP_SOKCET_APP_KEY,
      // auth   : '' // 订阅鉴权(仅限于私有频道)
    })
    // 假设用户uid为1
    let uid = this.$store.state.user.id
    // 浏览器监听user-1频道的消息，也就是用户uid为1的用户消息
    let user_channel = connection.subscribe('user-' + uid)
    let _this = this
    // 当user-1频道有message事件的消息时
    user_channel.on('message', function (data) {
      if (JSON.parse(data).type === 'download_file') {
        let res = JSON.parse(data)
        self.$download(res['data'])
      }
      // data里是消息内容
      if (JSON.parse(data).type === 'notice') {
        _this.notice_unread = JSON.parse(data).data.notice_unread
        console.log('notice', _this.notice_unread)
      } else if (JSON.parse(data).type === 'up_notice_unread') {
        _this.notice_unread = JSON.parse(data).data.notice_unread
        console.log('up_notice_unread', _this.notice_unread)
      } else {
      }
      // this.this.notice_unread = data.
    })
  },
  mounted() {},
  methods: {
    load() {
      this.page = this.page + 1
      this.message_type === 1 ? this.getMessageListData() : this.getFileList()
    },
    // 获取进程管理列表数据
    getFileList() {
      downloadFileLog().then((res) => {
        this.fileList = res.data
        // console.log('this.fileList', this.fileList)
      })
    },
    getMessageListData() {
      noticeList({ page: this.page, is_read: this.type }).then((res) => {
        let { data } = res['data']
        // 数据为空不再执行触底操作
        this.messageList = this.page === 1 ? [] : this.messageList
        data.length
          ? (this.messageList = this.messageList.concat(data))
          : (this.load_disabled = true)
      })
    },
    // 下载
    download(item) {
      this.$download(item)
    },
    // 切换通知中心
    handleMessage(message_type) {
      this.messageList = []
      this.message_type = message_type
      this.page = 0
      this.type = 0
      this.load_disabled = false
      this.load()
    },
    // 切换已读未读
    handleMessageType(type) {
      this.messageList = []
      this.load_disabled = false
      this.type = type
      this.page = 0
      this.load()
    },
    // 获取消息列表阅读状态
    getIsReady(list, is_read) {
      return list.filter((r) => {
        return r['is_read'] === is_read
      })
    },
    // 消息设置已读
    handleMessageReady(item, index) {
      noticeRead({ id: item.id }).then((res) => {
        this.messageList[index]['ready'] = true
        // 更新已读消息
        this.getMessageUnread()
        this.$forceUpdate()
      })
    },
    getMessageItemType(e, getCalss) {
      e = parseInt(e)
      return this.noticeData.find((res) => {
        if (res['value'] === e) {
          return res['value']
        }
      })['label']
    },
    // 未读消息总数
    getMessageUnread() {
      noticeList({ page: 1, is_read: 0 }).then((res) => {
        this.unready = res['data']['total']
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.unread{
  display: flex!important;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  margin: 0 auto;
  &:hover{
    background: #0F1D31;
  }
}
.ri-animation-border {
  // width: 100%;
  // height: 18px;
  // overflow: hidden;
  // position: relative;
  text-align: center;
  color: #6a7e9b;
  .zn-icon {
    width: 20px;
    height: 20px;
    margin-right: 0;
  }
}

::v-deep .el-badge__content.is-dot {
  background: #f53f3f;
  width: 6px;
  height: 6px;
}

.message {
  width: 100%;
  height: 608px;
  display: flex;

  .left {
    width: 172px;
    flex-shrink: 0;
    border-right: 1px solid #e5e6eb;

    .left-title {
      line-height: 54px;
      color: #1d2129;
      font-size: 16px;
      font-weight: 500;
      border-bottom: 1px solid #e5e6eb;
    }
    .left-check {
      font-size: 14px;
      color: #1d2129;

      // height: 200px;
    }
    .left-chcek-item {
      padding-left: 19px;
      height: 48px;
      width: 100%;
      cursor: pointer;
      display: flex;
      align-items: center;
      span {
        line-height: 22px;
        margin-left: 4px;
      }
    }

    .left-chcek-item_select,
    .left-chcek-item:hover {
      background: #e6effb;
    }
  }

  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    .right-tabs {
      line-height: 54px;
      border-bottom: 1px solid #e5e6eb;
      display: flex;
      font-size: 14px;
      color: #1d2129;
      .right-tabs-item {
        cursor: pointer;
        position: relative;
        // color: #005bd9;
      }
      .right-tabs-item-select {
        color: $base-Brand1-6;
        font-weight: 500;
      }
      .right-tabs-item-select::before {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        content: ' ';
        width: 20px;
        height: 2px;
        background: #005bd9;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
    }
    .message-list {
      width: 100%;
      flex: 1;
      padding: 16px;
      overflow-y: hidden;
      &:hover{
        overflow-y: overlay;
      }
    }
    .message-item {
      margin-bottom: 16px;
      .message-item-time {
        font-size: 14px;
        color: #86909c;
        margin-bottom: 10px;
      }

      .message-item-desc {
        width: 100%;
        padding: 16px;

        background: #ffffff;
        border-radius: 8px;
        position: relative;
        // display: flex;
        align-items: center;
      }
      .message-item-status {
        width: 6px;
        height: 6px;
        background: #f53f3f;
        position: absolute;
        left: 5px;
        top: 24px;
        border-radius: 100%;
      }
      .message-item-type {
        font-size: 12px;
        // width: 60px;
        padding: 0 6px;
        border-radius: 2px;
        background: #ffece8;
        color: #f53f3f;
        text-align: center;
        line-height: 22px;
        display: inline-block;
        white-space: nowrap;
      }
      .message-item-title {
        font-size: 14px;
        font-weight: 500;
        color: #1d2129;
        margin-left: 4px;
      }
      .message-ok {
        position: absolute;
        right: 19px;
        top: 20px;
        display: none;
      }
      .message-item-desc:hover .message-ok {
        display: block;
      }

      .message-content {
        width: 100%;
        background: #f7f8fa;
        border: 1px dashed #e5e6eb;
        border-radius: 4px;
        margin-top: 12px;
        // display: flex;
        padding: 16px;
        padding-right: 53px;
        .message-key {
          color: #86909c;
          white-space: nowrap;
        }
        .message-value {
          margin-left: 16px;
          color: #000000;
        }
      }
    }
  }
  .message-count {
    background: #f53f3f;
    border-radius: 100px;
    width: 25px;
    text-align: center;
    line-height: 16px;
    font-size: 12px;
    color: #ffffff;
    margin-left: 24px;
  }
}
// 下载进程管理
.down-list {
  .down-item {
    margin-top: 16px;
    &:first-child {
      margin-top: -6px;
    }
  }
  .down-time {
    line-height: 22px;
    color: $base-text-3;
  }
  .down-item-content {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    display: flex;
  }
  .down-img {
    width: 16px;
    height: 20px;
  }
  .down-name {
    font-weight: 500;
    line-height: 22px;
    color: $base-text-5;
    margin-bottom: 3px;
  }
  .down-tips {
    line-height: 20px;
    color: $base-Success-6;
    font-size: 12px;
    &-red {
      color: $base-Error-6;
    }
  }
  .down-operate {
    width: 20px;
    min-width: 20px;
    display: flex;
    justify-content: flex-end;
    &-fail {
      width: 18px;
      height: 18px;
      border-radius: 100%;
      background: $base-Error-1;
      color: $base-Error-6;
      font-weight: bold;
    }
  }
}
</style>

<style lang="scss">
.message-popover {
  background: #f7f8fa !important;
  padding: 0 !important;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.message-item-type_1 {
  background: #ffece8;
  color: #f53f3f;
}

.message-item-type_2 {
  background: #ffece8;
  color: #f53f3f;
}

.message-item-type_3 {
  background: #fff6ec !important;
  color: #ffa336 !important;
}
.message-item-type_4 {
  background: #e6effb !important;
  color: #005bd9 !important;
}
.message-item-type_5 {
  background: #e8fff0 !important;
  color: #00b47e !important;
}
.message-item-type_6 {
  background: #e8fff0 !important;
  color: #00b47e !important;
}
.no_data {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-items: center;
  align-self: center;
  img {
    width: 170px;
    height: 170px;
  }
}
</style>
