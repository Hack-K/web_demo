<!--
 * @Descripttion: 
 * @version: 
 * @Author: LiZeju
 * @Date: 2022-06-16 16:46:54
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-06-30 16:35:47
-->
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
      @close-drawer="close"
    />
  </el-drawer>
</template>
<script>
import ZnTransfer from '@/components/ZnTransfer'
import { userSelect } from '@/api/system/memberManagement'
import { userAdd } from '@/api/system/roleManagement'
export default {
  name: 'AssociatedMember',
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
      id: '',
    }
  },

  methods: {
    show(id) {
      this.drawer = true
      this.getMember(id)
      this.id = id
    },
    getMember(id) {
      userSelect({ role_id: id }).then((res) => {
        if (res.code == 200) {
          this.roles = res.data.data
          this.associatedList = res.data.roleUser.map((v) => v.id) //已关联的成员数据
          console.log("associatedList", this.associatedList)
        }
      })
    },
    close(){
      this.drawer=false
    },
    // 提交
    submit(val) {
      userAdd({
        role_id: this.id,
        user: val.map((v) => v.id),
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