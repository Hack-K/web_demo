<template>
  <el-drawer
    class="user-management-edit"
    title="添加成员"
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
      <el-form-item label="姓名" prop="nickname">
        <el-input
          v-model.trim="form.nickname"
          autocomplete="off"
          maxlength="30"
          clearable
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model.trim="form.mobile"
          autocomplete="off"
          clearable
          maxlength="11"
          @blur="getMobile"
        />
      </el-form-item>
      <el-form-item
        label="账号"
        prop="username"
        :style="accountTipShow ? { marginBottom: 0 } : { marginBottom: '25px' }"
      >
        <el-input
          v-model.trim="form.username"
          autocomplete="off"
          maxlength="11"
          clearable
        />
        <p v-if="accountTipShow" class="tips">账号生成后不可修改</p>
      </el-form-item>
      <!-- <el-form-item label="职务" prop="job">
        <el-select v-model="form.job" placeholder="请选择" clearable>
          <el-option
            v-for="(item, index) in list"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="职务" prop="job">
       <zn-custome-select 
        ref="customeSelect" 
        :optionWidth="645"
        :optionsList="list" 
        :optionsValue="form.job" 
        @optionChange="optionChange" 
        @optionDelete="optionDelete" 
        @optionCreate="optionCreate">
       </zn-custome-select>
      </el-form-item>
      <el-form-item label="角色">
        <el-select
          v-model="form.role"
          placeholder="请选择"
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
        <div class="member-tree">
          <div class="member-sys-section">
            <div class="member-sys-section-right havebgc">
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

      <!-- <el-form-item label="数据组" prop="group_id">
        <el-select v-model="form.group_id" placeholder="请选择">
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
import { getPosition, savePosition, delPosition } from "@/api/members"
import { doAdd, jobList } from '@/api/system/memberManagement'
import { authTree } from '@/api/system/menuManagement'
import { getList, menuIds } from '@/api/system/roleManagement'
import { isPhone, isChina } from '@/utils/validate'
import { getList as getDataListMamane } from '@/api/system/data'
export default {
  name: 'memberManagementEdit',
  props: {
    modalToBody: {
      type: Boolean,
      default: () => true,
    },
  },
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
    const validateUserName = (rule, value, callback) => {
      let str = /[\W]/g
      if (value == '') callback(new Error('必填'))
      if (value.length > 11) callback(new Error('账号长度不能超过11位'))
      if (str.test(value)) {
        this.accountTipShow = false
        callback(new Error('请输入英文和数字,不能含有特殊符号'))
      } else callback()
    }
    return {
      direction: 'rtl',
      form: {
        nickname: '', //姓名
        username: '', //账号
        mobile: '', //手机号
        role: [], //所属角色
        job: '', //职务
        avatar: '', //头像
        group_id: '', //数据权限组ID
        is_edit: 1, //1仅可编辑个人主责数据2可编辑所有数据
      },
      rules: {
        nickname: [
          { required: true, trigger: 'blur', validator: validateName },
        ],
        username: [
          { required: true, trigger: 'blur', validator: validateUserName },
        ],
        mobile: [
          {
            typer: 'number',
            required: true,
            trigger: 'blur',
            validator: validatePhone,
          },
        ],
        job: [{ required: true, trigger: ['blur','change'], message: '必填' }],
        group_id: [{ required: true, trigger: 'blur', message: '必填' }],
        is_edit: [{ required: true, trigger: 'blur', message: '必填' }],
      },
      title: '',
      accountTipShow: true,
      drawer: false,
      roleList: [], //角色列
      dataList: [], //数据组列表
      list: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: this.allDisabled,
      },
    }
  },
  created() {},
  methods: {
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
    showEdit() {
      this.drawer = true
      // this.getJobList()
      this.getPositionData()
      this.getRoleList()
      this.getAuthTree()
      this.getDataList()
    },
    // 获取职位
    getJobList() {
      jobList().then((res) => {
        this.list = res.data
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
    getDataList() {
      getDataListMamane().then((res) => {
        if (res.code == 200) {
          this.dataList = res.data
        }
      })
    },
    // 获取点击的角色拥有的权限树(非编辑状态下)
    getAuthTree() {
      authTree().then((res) => {
        this.treeData = res.data
      })
    },
    // 根据选择的角色请求对应的权限设置树的选中
    handlerSetTreeNode(val) {
      menuIds({ ids: val }).then((res) => {
        this.$refs.tree.setCheckedKeys(res.data.auth)
      })
    },
    // tree全部禁用
    allDisabled() {
      return true
    },
    // 电话输入完成后账号默认填充为手机号
    getMobile() {
      this.form.username = this.form.mobile
    },
    // 取消
    close() {
      this.$refs['form'].resetFields()
      this.form = this.$options.data().form
      this.drawer = false
      this.accountTipShow = true
    },
    // 确定并继续添加
    confirm(val) {
      this.$refs['form'].validate(async (valid) => {
        this.accountTipShow = valid
        if (valid) {
          const { msg, code } = await doAdd(this.form)
          if (code == 200) {
            this.$notify({
              title: '成功',
              message: '新增成员成功！',
              type: 'success',
              duration: 1000
            })
          }
          this.$emit('fetch-data')
          if (val) {
            this.$refs['form'].resetFields()
            // 清空选项组数据 重新获取数据列表数据
            this.form['group_id'] = ''
            this.getDataList()
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
.tips {
  color: $base-Warning-6;
}
.user-management-edit {
  position: relative;
  .el-form {
    .el-form-item {
      .el-form-item__error {
        height: 25px;
        line-height: 25px;
      }
      .member-tree {
        width: 100%;
        overflow: hidden;
        border: 1px solid $base-line-2;
        border-radius: $base-border-radius-4;
        margin-top: 15px;
        .member-sys-section {
          height: 284px;
          overflow: hidden;
          display: flex;
          justify-content: flex-start;
          flex-wrap: nowrap;
          .member-sys-section-right {
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
          .havebgc {
            .el-tree {
              background-color: $base-fill-2;
              border-radius: $base-border-radius-4;
            }
          }
        }
      }
    }
  }
  .el-select {
    width: 100%;
  }
  .el-radio {
    font-weight: 400;
  }
}
</style>