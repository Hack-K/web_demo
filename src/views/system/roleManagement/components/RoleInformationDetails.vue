<template>
  <div class="role-information-details">
    <el-form
      ref="form"
      :model="deatils"
      label-width="80px"
      label-position="top"
      :disabled="!switchEdit"
      :rules="rules"
      :hide-required-asterisk="!switchEdit"
    >
      <el-col :span="24" class="title">基本信息</el-col>
      <el-form-item label="角色名称" prop="name">
        <el-input
          v-model="deatils.name"
          :class="switchEdit ? '' : 'input-bn'"
          maxlength="30"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="description">
        <div
          class="description"
          v-if="!switchEdit"
          v-html="deatils.description"
        ></div>
        <el-input
          v-else
          type="textarea"
          :autosize="{ minRows: 6 }"
          :maxlength="300"
          show-word-limit
          placeholder="请输入"
          v-model="deatils.description"
        ></el-input>
      </el-form-item>

      <el-col :span="24" class="title">其他信息</el-col>
      <el-col :span="12" style="padding-left: 0">
        <el-form-item label="创建人">
          <el-input
            v-model="deatils.create_user_id"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="padding-right: 0">
        <el-form-item label="创建时间">
          <el-input v-model="deatils.create_time" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="padding-left: 0">
        <el-form-item label="更新人">
          <el-input
            v-model="deatils.update_user_id"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="padding-right: 0">
        <el-form-item label="更新时间">
          <el-input v-model="deatils.update_time" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-form-item label="权限配置" prop="auth">
        <div class="role-tree" :class="switchEdit ? 'have-border' : ''">
          <div class="role-sys-header" v-if="switchEdit">
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
            <div class="role-sys-section-left" v-if="switchEdit">
              <el-col
                :span="24"
                v-for="(item, index) in referenceData"
                :key="index"
                @click.native="getRightTreeData(item)"
              >
                {{ item.title }}
              </el-col>
            </div>
            <div
              class="role-sys-section-right"
              :class="!switchEdit ? 'havebgc' : ''"
            >
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
    </el-form>
    <el-col :span="24" class="footer" v-if="switchEdit">
      <el-button type="primary" class="cancel" @click="close">取 消</el-button>
      <el-button type="primary" class="save" @click="save">确 定</el-button>
    </el-col>
  </div>
</template>

<script>
import { doEdit } from '@/api/system/roleManagement'

export default {
  name: 'RoleInformationDetails',
  props: {
    switchEdit: {
      type: Boolean,
      default: () => false,
    },
    deatils: {
      type: Object,
      default: () => {},
    },
    treeData: {
      type: Array,
      default: () => [],
    },
    referenceData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {
        name: '', //角色名称
        description: '', //描述
        status: '',
        auth: [], //权限
        user: [], //关联成员
      },
      rules: {
        name: [
          { required: true, trigger: ['blur', 'change'], message: '必填' },
        ],
        description: [{ required: true, trigger: 'blur', message: '必填' }],
        auth: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      checkAll: false,
      isIndeterminate: true,
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    }
  },
  computed: {},
  watch: {
    switchEdit: {
      handler(newVal, oldVa) {
        if (newVal) {
          return newVal
        }
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    // 取消
    close() {
      this.$emit('set-switch', false)
      this.$emit('fetch-data', this.deatils.id) //取消编辑后查询详情,恢复树的数据选中状态
    },
    handleCheckAllChange(val) {
      val
        ? this.$refs.tree.setCheckedNodes(this.treeData)
        : this.$refs.tree.setCheckedNodes([])
      this.isIndeterminate = false
    },
    // 切换为编辑状态时点击左侧参考角色设置右侧tree选中数据
    getRightTreeData(item) {
      this.$refs.tree.setCheckedKeys(item.auth)
    },
    //  提交
    save() {
      this.$confirm('本次操作涉及' + `${this.deatils.user_count}` + '个成员，确认修改？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((_) => {
        this.deatils.auth=this.$refs.tree.getCheckedKeys(true)
        this.$refs['form'].validate((valid) => {
          if (valid) {
            doEdit({
              id: this.deatils.id,
              name: this.deatils.name,
              description: this.deatils.description,
              auth: this.deatils.auth,
            }).then((res) => {
              if (res.code == 200) {
                this.$notify({
                  title: '成功',
                  message: '修改成功！',
                  type: 'success',
                  duration: 1000
                })
              }
              this.$emit('fetch-data', this.deatils.id)
              this.close()
            })
          }
        })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.have-border {
  border: 1px solid $base-line-2;
}
.role-information-details {
  width: 70%;
  margin: 0 auto;
  height: auto;
  overflow: hidden;
  padding-top: 24px;
  padding-bottom: 56px;
  .title {
    padding: 0 0 16px 0 !important;
    font-weight: 500;
    font-size: 14px;
    color: $base-text-4;
  }
  ::v-deep .el-form {
    .el-form-item__label {
      color: $base-text-3;
      line-height: inherit;
      margin-bottom: 12px;
    }
    .el-form-item {
      margin-bottom: 24px;
      .el-input{
        .el-input__inner{
          color: $base-text-5 !important;
        }
      }
      .input-bn {
        .el-input__inner {
          border: none !important;
        }
      }
      .description {
        height: 172px;
        padding: 8px 16px;
        overflow: auto;
        color: $base-text-5;
        background: $base-fill-2;
        border-radius: $base-border-radius-4;
      }
      .input-bn{
        .el-textarea__inner {
          height: 172px;
        }
      }
      .el-textarea__inner {
        border-radius: 4px;
        font-size: 14px;
        resize: none;
        min-height: 172px!important;
      }
      .el-input__count {
        color: $base-text-3;
        font-size: 14px;
      }
      .el-textarea.is-disabled .el-textarea__inner {
        border: none;
        background: $base-fill-2;
      }
      .el-input.is-disabled .el-input__inner {
        background: $base-fill-2;
      }
      .role-tree {
        width: 100%;
        overflow: hidden;
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
          height: 409px;
          overflow: hidden;
          display: flex;
          justify-content: flex-start;
          flex-wrap: nowrap;
          .role-sys-section-left {
            width: 170px;
            padding: 12px 20px;
            height: 100%;
            overflow-y: auto;
            border-right: 1px solid $base-line-2;
            .el-col {
              cursor: pointer;
            }
          }
          .role-sys-section-right {
            flex: 1;
            .el-tree {
              height: 100%;
              padding: 13px;
              overflow-y: hidden;
              &:hover{
                overflow-y: overlay;
              }
              ::v-deep.el-tree-node__expand-icon {
                color: $base-fill-6 !important;
              }
            }
          }
        }
      }
    }
  }

  .havebgc {
    .el-tree {
      background-color: $base-fill-2;
      border-radius: $base-border-radius-4;
    }
  }
  .footer {
    text-align: right;
    padding: 0 0 24px 0 !important;
    .cancel {
      background: $base-fill-4;
      color: $base-text-4;
      border: none;
    }
    .save {
      background: $base-main-tone;
    }
    .el-botton {
      height: 36px;
      width: 69px;
      font-weight: 400;
      font-size: 14px;
      border-radius: $base-border-radius-4;
    }
  }
}
</style>
