<template>
  <div class="zn-avatar-list">
    <el-tooltip
      v-for="(item, index) in avatarList"
      :key="index"
      :content="item.username"
      effect="dark"
      placement="top-start"
    >
      <el-avatar :src="item.avatar" />
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    name: 'ZnAvatarList',
    props: {
      avatarList: {
        type: Array,
        default: () => [],
      },
    },
  }
</script>

<style lang="scss" scoped>
  .zn-avatar-list {
    ::v-deep {
      .el-avatar {
        display: inline-block;
        margin-left: -15px;
        cursor: pointer;
        border: 3px solid $base-fill-1;
      }
    }
  }
</style>
