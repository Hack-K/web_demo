<template>
  <el-drawer
    class="associated-member"
    title="关联成员"
    :visible.sync="drawer"
    :direction="direction"
    :append-to-body="modalToBody"
    :modal-append-to-body="modalToBody"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :size="685"
  >
    <zn-transfer
      :roles="roles"
      :associatedList="associatedList"
      @up-data="submit"
      :title="data_title"
      @close-drawer="close"
    />
  </el-drawer>
</template>
<script>
import ZnTransfer from '@/components/ZnTransfer'
import { userList, dataMember } from '@/api/system/data'
export default {
  name: 'DataMember',
  props: {
    modalToBody: {
      type: Boolean,
      default: () => true,
    },
  },
  components: { ZnTransfer },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      roles: [],
      associatedList: [],
      data_title: '',
    }
  },

  methods: {
    show(id, name) {
      this.id = id
      this.data_title = name
      this.drawer = true
      this.getMember()
    },
    getMember(id) {
      userList().then((res) => {
        this.roles = res.data
        this.associatedList = []
      })
      // userSelect({ role_id: id }).then((res) => {
      //   if (res.code == 200) {
      //     this.associatedList = res.data.roleUser.map((v) => v.id)
      //   }
      // })
    },
    close() {
      this.drawer = false
    },
    // 提交
    submit(val) {
      dataMember({
        id: this.id,
        op: 2,
        members: val.map((v) => v.id).join(','),
      }).then((res) => {
        if (res.code == 200) {
          this.$notify({
            title: '成功',
            message: '关联成员成功！',
            type: 'success',
            duration: 1000
          })
          this.drawer = false
          this.$emit('fetch-data')
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep.associated-member {
  position: relative;
  .el-drawer__body {
    padding: 16px 24px;
    height: 100%;
    overflow: hidden;
    padding-bottom: 84px;
  }
}
</style>