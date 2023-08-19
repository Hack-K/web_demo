<template>
  <el-popover
    ref="popover1"
    placement="right"
    width="216"
    trigger="click"
    :visible-arrow="false"
    popper-class="user-left-bottom-popover"
  >
    <el-avatar class="user-avatar" :src="avatar" slot="reference" />
    <el-col :span="24" class="user-section mb-16">
      <el-col :span="6" class="left">
        <el-avatar class="user-avatar" :src="$store.state.user.avatar" />
      </el-col>
      <el-col :span="16" class="right">
        <el-col :span="12" class="name overflowOne mr-4">
          <span :title="$store.state.user.nickname">
            {{ $store.state.user.nickname }}
          </span>
        </el-col>
        <!-- <el-col :span="11"><el-tag type="danger">话务员</el-tag></el-col> -->
        <el-col :span="24" class="company-name">
          {{ $store.state.user.app_title }}
        </el-col>
      </el-col>
    </el-col>
    <div class="logout mt-8 mb-8" @click="logout">
      <zn-icon :iconName="'icon-logout'" class="mr-10" />
      <span>退出登录</span>
    </div>
  </el-popover>

  <!-- <el-dropdown
    @command="handleCommand"
    @visible-change="handleVisibleChange"
    :placemen="'top-end'"
  >
    <span class="avatar-dropdown">
      <el-avatar class="user-avatar" :src="avatar" />
      <div class="user-name">
        <span class="hidden-xs-only">{{ username }}</span>
        <zn-icon
          class="zn-dropdown"
          :class="{ 'zn-dropdown-active': active }"
          icon="arrow-down-s-line"
        />
      </div>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="personalCenter">
          <zn-icon :iconName="'user-line'" />
          个人中心
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          <zn-icon :iconName="'logout'" />
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown> -->
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { toLoginRoute } from '@/utils/routes'

export default {
  name: 'ZnAvatar',
  data() {
    return {
      active: false,
    }
  },
  computed: {
    ...mapGetters({
      avatar: 'user/avatar',
      username: 'user/username',
    }),
  },
  methods: {
    ...mapActions({
      _logout: 'user/logout',
    }),
    handleCommand(command) {
      switch (command) {
        case 'logout':
          if (window.V7Softphone) {
            window.V7Softphone.webPhoneApi.disconnect() //注销设备
            window.V7Softphone.agentApi.offline({
              //退出登录
              toAnswerOffline: '0',
              success: (res) => {
                if (res.success) {
                  this.$notify({
                    title: '成功',
                    message: '坐席已退出',
                    type: 'success',
                    duration: 1000
                  })
                }
              },
              fail: function (error) {
                this.$message.error(error)
              },
            })
          }

          setTimeout(() => {
            this.logout()
          }, 1000)
          break
        case 'personalCenter':
          this.personalCenter()
          break
      }
    },
    handleVisibleChange(val) {
      this.active = val
    },
    personalCenter() {
      this.$router.push('/system/personalCenter')
    },
    async logout() {
      await this._logout()
      await this.$router.push(toLoginRoute(this.$route.fullPath))
    },
  },
}
</script>
<style lang="scss">
$num-48: 48px;
.user-left-bottom-popover {
  overflow: hidden;
  transform: translate(2px, -16px);
  padding: $base-padding;
  .user-section {
    padding: 16px 0 18px 0;
    border-bottom: 1px solid $base-line-1;
    .left {
      width: $num-48;
      height: $num-48;
      margin-right: 8px;
      .user-avatar {
        width: $num-48;
        height: $num-48;
      }
    }
    .right {
      height: 28px;
      line-height: 28px;
      .name {
        font-weight: 400;
        font-size: 20px;
        color: $base-text-5;
      }
      .el-tag {
        width: 52px;
        border: none;
        color: $base-Success-6;
        background: rgb($base-Success-6, 0.1);
        border-radius: 2px;
      }
      .company-name {
        font-size: 12px;
        color: $base-line-4;
      }
    }
  }
  .logout {
    display: inline-block;
    cursor: pointer;
  }
}
</style>
