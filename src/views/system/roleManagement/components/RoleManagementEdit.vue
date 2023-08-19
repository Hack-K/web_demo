<template>
  <el-drawer
    class="role-edit"
    title="新增角色"
    :visible.sync="drawer"
    :direction="direction"
    :append-to-body="modalToBody"
    :modal-append-to-body="modalToBody"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :size="685"
  >
    <el-form
      ref="form"
      label-position="top"
      label-width="80px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model.trim="form.name"
          autocomplete="off"
          placeholder="请输入"
          maxlength="30"
        />
      </el-form-item>
      <el-form-item label="角色描述" prop="description" class="el-input-textarea">
        <el-input
          type="textarea"
          :autosize="{ minRows: 6 }"
          :maxlength="300"
          show-word-limit
          placeholder="请输入"
          v-model="form.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限配置" prop="auth">
        <!-- <el-input v-model.trim="form.auth" autocomplete="off" /> -->
        <div class="role-tree">
          <div class="role-sys-header">
            <div class="role-sys-header-left">参考角色</div>
            <div class="role-sys-header-right">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >
                全选
              </el-checkbox>
            </div>
          </div>
          <div class="role-sys-section">
            <div class="role-sys-section-left">
              <el-col
                :span="24"
                v-for="(item, index) in referenceData"
                :key="index"
                @click.native="getRightTreeData(item)"
              >
                {{ item.title }}
              </el-col>
            </div>
            <div class="role-sys-section-right">
              <el-tree
                :data="treeData"
                show-checkbox
                default-expand-all
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps"
              ></el-tree>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="关联成员">
        <el-select
          v-model="form.user"
          multiple
          clearable
          filterable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in roles"
            :key="index"
            :label="item.nickname"
            :value="item.id"
          >
            <span style="float: left">{{ item.nickname }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">
              {{ item.mobile }}
            </span>
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="drawer-footer">
      <el-button class="el-cancel" @click="close">取消</el-button>
      <el-button class="el-continue" @click="confirm(1)">
        确定并继续添加
      </el-button>
      <el-button type="primary" @click="confirm(0)">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { doAdd } from '@/api/system/roleManagement'
import { userSelect } from '@/api/system/memberManagement'
import { authTree } from '@/api/system/menuManagement'
export default {
  name: 'UserManagementEdit',
  props: {
    modalToBody: {
      type: Boolean,
      default: () => true,
    },
    referenceData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      direction: 'rtl',
      form: {
        name: '', //角色名称
        description: '', //描述
        status: '',
        auth: [], //权限
        user: [], //关联成员
      },
      treeData: [], //角色信息权限树
      roles: [],
      rules: {
        name: [{ required: true, trigger: 'blur', message: '必填' }],
        description: [{ required: true, trigger: 'blur', message: '必填' }],
        auth: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      drawer: false,
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      checkAll: false,
      isIndeterminate: true,
    }
  },
  methods: {
    showEdit(arr) {
      this.drawer = true
      // this.$nextTick(() => {
      //   this.$refs.tree.setCheckedKeys(arr[0].auth)
      // })
      this.getMember()
      this.getAuthTree()
    },
    handleCheckAllChange(val) {
      val
        ? this.$refs.tree.setCheckedNodes(this.treeData)
        : this.$refs.tree.setCheckedNodes([])
      this.isIndeterminate = false
    },
    getMember() {
      userSelect().then((res) => {
        if (res.code == 200) {
          this.roles = res.data.data
        }
      })
    },
    // 获取点击的角色拥有的权限树(非编辑状态下)
    getAuthTree() {
      authTree().then((res) => {
        this.treeData = res.data
        // this.$refs.tree.setCheckedKeys(this.referenceData[0].auth)
      })
    },
    // 切换为编辑状态时点击左侧参考角色设置右侧tree选中数据
    getRightTreeData(item) {
      this.$refs.tree.setCheckedKeys(item.auth)
    },
    // 取消
    close() {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.drawer = false
    },
    // 确定
    confirm(val) {
      this.form.auth = this.$refs.tree.getCheckedKeys(true) //只拿子级id
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const { msg, code } = await doAdd(this.form)
          if (code == 200) {
            this.$notify({
              title: '成功',
              message: '新增角色成功！',
              type: 'success',
              duration: 1000
            })
          }
          this.$emit('fetch-data')
          if (val) {
            this.$refs['form'].resetFields()
          } else {
            this.close()
          }
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__body{
  overflow-y: hidden;
  &:hover{
    overflow-y: overlay;
  }
}
.role-edit {
  position: relative;
  .el-select {
    width: 100%;
  }
  .el-input-textarea{
    ::v-deep .el-textarea__inner {
      border-radius: 4px;
      font-size: 14px;
      resize: none;
      min-height: 172px!important;
    }
    ::v-deep .el-input__count {
      color: $base-text-3;
      font-size: 14px;
    }
  }
  .role-tree {
    width: 100%;
    height: 284px;
    overflow: hidden;
    border: 1px solid $base-line-2;
    border-radius: $base-border-radius-4;
    .role-sys-header {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      border-bottom: 1px solid $base-line-2;
      .role-sys-header-left {
        width: 170px;
        height: 44px;
        line-height: 44px;
        font-size: 12px;
        padding-left: 16px;
        color: $base-text-5;
        border-right: 1px solid $base-line-2;
        display: inline-block;
      }
      .role-sys-header-right {
        width: 466px;
        height: 44px;
        line-height: 44px;
        padding-left: 12px;
      }
    }
    .role-sys-section {
      display: flex;
      justify-content: flex-start;
      flex-wrap: nowrap;
      height: calc(100% - 45px);
      .role-sys-section-left {
        width: 170px;
        padding: 12px 20px;
        height: 100%;
        overflow-y: hidden;
        border-right: 1px solid $base-line-2;
        &:hover{
          overflow-y: overlay;
        }
        .el-col {
          cursor: pointer;
        }
      }
      .role-sys-section-right {
        width: 466px;
        padding: 12px 20px;
        height: 100%;
        overflow-y: hidden;
        &:hover{
          overflow-y: overlay;
        }
      }
    }
  }
}
</style>