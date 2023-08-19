// UserDeatils
<template>
  <div class="member-deatils-container">
    <el-row :gutter="16" class="member-row">
      <el-col :span="24" class="member-header">
        <div class="title">成员信息</div>
        <el-button
          type="text"
          class="el-edit"
          @click="memberInformationEdit = true"
          v-if="!memberInformationEdit"
          v-permissions="{ permission: ['system:memberManagement:edit'] }"
        >
          <zn-icon :iconName="'icon-edit'" class="mr-6" />
          <span style="font-size: 14px">编辑</span>
        </el-button>
      </el-col>
      <el-col :span="24" class="member-col-right">
        <!-- 成员信息 -->
        <div class="member-information-details">
          <el-form
            ref="form"
            :model="form"
            label-width="80px"
            label-position="top"
            :disabled="!memberInformationEdit"
            :rules="rules"
            :class="memberInformationEdit ? '' : 'input-bn'"
            :hide-required-asterisk="!memberInformationEdit"
          >
            <el-col :span="24" class="title header-flex">
              <div class="left-title">
                <span>基本信息</span>
              </div>
              <div class="right-title">
                <span class="mr-16">账号状态</span>
                <el-popover
                  popper-class="select-popover"
                  placement="bottom-left"
                  :visible-arrow="false"
                  trigger="click"
                  ref="reportPopover"
                >
                  <div
                    class="pop-li pl-12 pt-4 pb-4"
                    v-permissions="{
                      permission: ['system:memberManagement:enable'],
                    }"
                  >
                    <el-tag type="success" @click="switchAccountStatus(1)">
                      启用
                    </el-tag>
                  </div>
                  <div
                    class="pop-li pl-12 pt-4 pb-4"
                    v-permissions="{
                      permission: ['system:memberManagement:deactivate'],
                    }"
                  >
                    <el-tag type="danger" @click="switchAccountStatus(2)">
                      停用
                    </el-tag>
                  </div>
                  <el-tag
                    type="success"
                    slot="reference"
                    v-if="form.status == 1"
                  >
                    启用
                  </el-tag>
                  <el-tag type="danger" slot="reference" v-else>停用</el-tag>
                </el-popover>
              </div>
            </el-col>
            <el-col :span="12" style="padding-left: 0">
              <el-form-item label="姓名" prop="nickname">
                <el-input v-model="form.nickname" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="padding-right: 0">
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="form.mobile" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="padding-left: 0">
              <el-form-item label="账号">
                <el-input v-model="form.username" :disabled="true"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="padding-right: 0">
              <el-form-item label="职务" prop="job">
                <zn-custome-select 
                  ref="customeSelect" 
                  :optionWidth="509"
                  :optionsList="list" 
                  :optionsValue="form.job" 
                  @optionChange="optionChange" 
                  @optionDelete="optionDelete" 
                  @optionCreate="optionCreate">
                </zn-custome-select>
                <!-- <el-select
                  v-model="form.job"
                  placeholder="请选择"
                  style="width: 100%"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in list"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select> -->
              </el-form-item>
            </el-col>

            <el-col :span="24" class="title">其他信息</el-col>
            <el-col :span="12" style="padding-left: 0">
              <el-form-item label="创建人">
                <el-input
                  v-model="form.create_user_id"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" style="padding-right: 0">
              <el-form-item label="创建时间">
                <el-input
                  v-model="form.create_time"
                  :disabled="true"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" class="title">权限信息</el-col>
            <el-col :span="24" style="padding: 0">
              <el-form-item label="角色">
                <el-select
                  v-model="form.role"
                  placeholder="请选择"
                  style="width: 100%"
                  multiple
                  clearable
                  @change="handlerSetTreeNode"
                >
                  <el-option
                    v-for="(item, index) in roleList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
                <div
                  class="member-tree mt-16"
                  :class="memberInformationEdit ? 'have-border' : ''"
                >
                  <div class="member-sys-section">
                    <div
                      class="member-sys-section-right"
                      :class="!memberInformationEdit ? 'havebgc' : ''"
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
            </el-col>
<!-- 
            <el-form-item label="数据组" prop="group_id">
              <el-select
                style="width: 100%"
                v-model="form.group_id"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dataList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item> -->

            <!-- <el-form-item label="编辑权限" prop="is_edit">
              <el-radio-group v-model="form.is_edit">
                <el-radio :label="1">个人相关数据</el-radio>
                <el-radio :label="2">可见范围数据</el-radio>
              </el-radio-group>
            </el-form-item> -->
          </el-form>
          <el-col :span="24" class="footer" v-if="memberInformationEdit">
            <el-button type="primary" class="cancel" @click="close">
              取 消
            </el-button>
            <el-button type="primary" class="save" @click="save">
              确 定
            </el-button>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  details,
  jobList,
  memberStatus,
  doEdit,
} from '@/api/system/memberManagement'
import { getPosition, savePosition, delPosition } from "@/api/members"
import { authTree } from '@/api/system/menuManagement'
import { getList, menuIds } from '@/api/system/roleManagement'
import { isPhone, isChina } from '@/utils/validate'
import { getList as getDataListMamane } from '@/api/system/data'
export default {
  name: 'MemberDeatils',
  components: {},
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value == '') callback(new Error('必填'))
      if (!isPhone(value)) callback(new Error('请输入正确的手机号码'))
      else callback()
    }
    const validateName = (rule, value, callback) => {
      if (value == '') callback(new Error('必填'))
      if (!isChina(value))
        callback(new Error('请输入纯汉字姓名,不能含有特殊符号'))
      else callback()
    }
    return {
      form: {
        nickname: '', //姓名
        username: '', //账号
        mobile: '', //手机号
        role: [], //所属角色
        job: '', //职务
        avatar: '', //头像
        group_id: '', //数据权限组ID
        is_edit: '', //1仅可编辑个人主责数据2可编辑所有数据
      },
      rules: {
        nickname: [
          { required: true, trigger: 'blur', validator: validateName },
        ],
        mobile: [{ required: true, trigger: 'blur', validator: validatePhone }],
        job: [{ required: true, trigger: 'blur', message: '必填' }],
        group_id: [{ required: true, trigger: 'blur', message: '必填' }],
        is_edit: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      roleList: [], //角色列
      dataList: [], //数据组列表
      list: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: this.allDisabled,
      },
      memberInformationEdit: false,
    }
  },

  computed: {},
  watch: {},
  async created() {
    await this.getPositionData()
    this.getDetails()
    // this.getJobList()
    this.getRoleList()
    this.getAuthTree()
    this.getDataList()
  },
  methods: {
    ...mapActions({
      changeTabsMeta: 'tabs/changeTabsMeta',
    }),
    /* 选项变更 value:选项id */
    optionChange(value){
      this.form.job = value
    },
    /* 选项删除 id:选项id */
    optionDelete(id){
      this.delPositionData(id)
    },
    /* 选项创建 text:创建文本 */
    optionCreate(text){
      this.savePositionData(text)
    },
    /* 获取职位列表 */
    async getPositionData(){
      await getPosition({is_manager: 0}).then(async res => {
        if(res.code === 200){
          this.list = res.data
        }
      })
    },
    /* 保存职位列表 */
    async savePositionData(text){
      await savePosition({
        label: text,
        is_manager: 0
      }).then(async res => {
        if(res.code === 200){
          await this.getPositionData()
          this.$refs["customeSelect"].$refs["customeInput"].focus()
          // 组件私有逻辑
          this.form.job = res.data
        }
      })
    },
    /* 删除职位列表 */
    async delPositionData(id){
      await delPosition({
        value: id
      }).then(async res => {
        if(res.code === 200){
          await this.getPositionData()
          this.$refs["customeSelect"].$refs["customeInput"].focus()
          // 组件私有逻辑
          if(id === this.form.job){
            this.form.job = ""
          }
        }
      })
    },
    // 获取详情
    getDetails() {
      details({ id: this.$route.query.id }).then((res) => {
        if (res.code == 200) {
          this.form = res.data
          this.form.job = res.data.job ? parseInt(res.data.job.value) : ''
          this.form['is_edit'] = res['data']['is_edit']['value']
          this.handlerSetTreeNode(res.data.role)
          this.changeTabsMeta({
            title: '成员详情',
            meta: {
              title: res.data.nickname,
            },
          })
        }
      })
    },
    // 角色列表
    getRoleList() {
      getList().then((res) => {
        if (res.code == 200) {
          this.roleList = res.data
        }
      })
    },
    // 获取点击的角色拥有的权限树(非编辑状态下)
    getAuthTree() {
      authTree().then((res) => {
        this.treeData = res.data
      })
    },
    // 获取职位
    getJobList() {
      jobList().then((res) => {
        this.list = res.data
      })
    },
    // 根据选择的角色请求对应的权限设置树的选中
    handlerSetTreeNode(val) {
      if (val.length) {
        menuIds({ ids: val }).then((res) => {
          this.$refs.tree.setCheckedKeys(res.data.auth)
        })
      }
    },
    // tree全部禁用
    allDisabled() {
      return true
    },
    // 更改成员状态
    switchAccountStatus(num) {
      let str = num == 1 ? '启用' : '停用'
      this.$confirm('确认' + `${str}` + '账号？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then((_) => {
        memberStatus({ id: this.$route.query.id, status: num }).then((res) => {
          if (res.code == 200) {
            this.form.status = res.data.status //更改状态
            this.$notify({
              title: '成功',
              message: `${str}` + '成功！',
              type: 'success',
              duration: 1000
            })
          }
        })
      })
    },
    close() {
      this.memberInformationEdit = false
    },
    save() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const { msg, code } = await doEdit(this.form)
          if (code == 200) {
            this.$notify({
              title: '成功',
              message: '修改成功！',
              type: 'success',
              duration: 1000
            })
          }
          this.$emit('fetch-data')
          this.close()
        }
      })
    },
    getDataList() {
      getDataListMamane().then((res) => {
        if (res.code == 200) {
          this.dataList = res.data
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.have-border {
  border: 1px solid $base-line-2;
}
.el-tag {
  cursor: pointer;
}
.member-deatils-container {
  height: $base-keep-alive-height;
  box-shadow: none;
  overflow: hidden !important;
  background: none !important;
  &:hover {
    box-shadow: none !important;
  }
  border: 1px solid $base-line-2;
  .member-row {
    height: 100%;
    margin: 0 !important;
    border-radius: 8px;
    .member-header {
      height: 56px;
      line-height: 56px;
      padding: 0 24px !important;
      display: flex;

      justify-content: space-between;
      background: $base-fill-3;
      &:first-child {
        text-align: left;
        font-size: 16px;
        color: $base-text-5;
        font-weight: 400;
      }
      &:last-child {
        text-align: right;
        .el-edit {
          .zn-icon {
            width: 12px;
            height: 12px;
            vertical-align: -4px;
          }
          span {
            vertical-align: middle;
          }
        }
      }
    }
    // 右侧
    .member-col-right {
      height: 100%;
      overflow-y: auto;
      background-color: #ffffff;
      .member-information-details {
        width: 70%;
        margin: 24px auto;
        padding-bottom: 56px;
        height: auto;
        overflow: hidden;
        .title {
          padding: 0 0 16px 0 !important;
          font-weight: 500;
          font-size: 14px;
          color: $base-text-4;
        }
        .input-bn {
          ::v-deep .el-select,
          ::v-deep .el-input__suffix-inner{
            pointer-events: none;
          }
          .el-col {
            .el-form-item {
              .el-input {
                .el-input__inner {
                  border: none;
                }
              }
            }
          }
        }
        ::v-deep .el-form {
          .header-flex {
            display: flex;
            justify-content: space-between;
            .left-title {
              line-height: 24px;
              font-weight: 500;
              font-size: 14px;
              color: $base-text-4;
            }
            .right-title {
              .mr-16 {
                color: $base-text-3;
              }
            }
          }
          .el-form-item__label {
            color: $base-text-3;
            line-height: inherit;
            margin-bottom: 12px;
          }
          .el-form-item {
            margin-bottom: 24px;
            .el-input.is-disabled .el-input__inner {
              color: $base-text-5 !important;
              background: $base-fill-2;
            }
            .member-tree {
              width: 100%;
              overflow: hidden;

              border-radius: $base-border-radius-4;
              .member-sys-section {
                height: 409px;
                overflow: hidden;
                display: flex;
                justify-content: flex-start;
                flex-wrap: nowrap;
                .member-sys-section-right {
                  flex: 1;
                  .el-tree {
                    height: 100%;
                    padding: 13px;
                    overflow-y: auto;
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
          border: none;
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
    }
  }
  .el-radio {
    font-weight: 400;
  }
}
</style>
