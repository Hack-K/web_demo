<template>
  <el-badge v-if="theme.showNotice" :value="badge">
    <el-popover placement="bottom" trigger="hover" width="300">
      <template #reference>
        <zn-icon :iconName="'notification-line'" />
      </template>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="'通知'" name="notice">
          <div class="notice-list">
            <el-scrollbar>
              <ul>
                <li v-for="(item, index) in list" :key="index">
                  <el-avatar :size="45" :src="item.image" />
                  <span v-html="item.notice" />
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="'邮件'" name="email">
          <div class="notice-list">
            <el-scrollbar>
              <ul>
                <li v-for="(item, index) in list" :key="index">
                  <el-avatar :size="45" :src="item.image" />
                  <span>{{ item.email }}</span>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="notice-clear" @click="handleClearNotice">
        <el-button type="text">
          <zn-icon :iconName="'close-circle-line'" />
          <span>清空消息</span>
        </el-button>
      </div>
    </el-popover>
  </el-badge>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getList } from '@/api/notice'

  export default {
    name: 'ZnNotice',
    data() {
      return {
        list: [],
        badge: null,
        activeName: 'notice',
      }
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    created() {
      // this.$nextTick(() => {
      //   if (this.theme.showNotice) this.fetchData()
      // })
    },
    methods: {
      handleClick() {
        this.fetchData()
      },
      handleClearNotice() {
        this.badge = null
        this.list = []
        this.$baseMessage('清空消息成功', 'success', 'zn-hey-message-success')
      },
      async fetchData() {
        const {
          data: { list, total },
        } = await getList()
        this.list = list
        this.badge = total === 0 ? null : total
      },
    },
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-tabs__active-bar {
      min-width: 28px;
    }
  }

  .notice-list {
    height: 29vh;

    ul {
      padding: 0 15px 0 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;
        padding: 10px 0 10px 0;

        ::v-deep {
          .el-avatar {
            flex-shrink: 0;
            width: 50px;
            height: 50px;
            border-radius: 50%;
          }
        }

        span {
          margin-left: 10px;
        }
      }
    }
  }

  .notice-clear {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 0 0 0;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    border-top: 1px solid #e8eaec;

    i {
      margin-right: 3px;
    }
  }
</style>
