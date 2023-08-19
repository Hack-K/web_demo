<template>
  <el-drawer
    class="role-edit"
    title="新增数据组"
    :visible.sync="drawer"
    :direction="direction"
    :append-to-body="modalToBody"
    :modal-append-to-body="modalToBody"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :size="685"
  >
    <el-form :rules="rules" :model="form" ref="ruleForm">
      <el-row>
        <!-- 数据组名称 -->
        <el-col :span="24">
          <el-form-item label="数据组名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <!-- 数据组描述 -->
        <el-col :span="24">
          <el-form-item prop="describe" label="数据组描述">
            <el-input
              type="textarea"
              :autosize="{ minRows: 6 }"
              :maxlength="300"
              show-word-limit
              placeholder="请输入"
              v-model="form.describe"
            ></el-input>
          </el-form-item>
        </el-col>

        <!-- 客户区域 -->
        <el-col :span="24">
          <el-form-item label="客户区域" prop="regions">
            <!-- <el-cascader
              v-model="form.regions"
              style="width: 100%"
              ref="cascader"
              :props="areaProps"
              :multiple="true"
              collapse-tags
            ></el-cascader> -->
            <span slot="label">
              <span>客户区域</span>
              <el-tooltip
                placement="right"
                popper-class="popper_data_manage"
                class="label_item_xw"
              >
                <div slot="content">
                  以客户的居住区域作为选择范围，选
                  <br />
                  择后组内成员可查看该区域客户的基
                  <br />
                  本信息、通话记录、工单和任务信息。
                </div>
                <zn-icon
                  style="font-size: 14px"
                  :iconName="'dataManagementxw'"
                  class=""
                />
              </el-tooltip>
            </span>
            <el-cascader
              :options="cityData"
              collapse-tags
              v-model="form.regions"
              style="width: 100%"
              :props="{
                value: 'd',
                label: 'v',
                children: 'c',
                multiple: true,
                separator: '_',
              }"
            ></el-cascader>
          </el-form-item>
        </el-col>

        <!-- 可见范围 -->
        <el-col :span="24">
          <el-form-item label="" prop="visible_range">
            <span slot="label">
              <span>可见范围</span>
              <el-tooltip
                placement="right"
                popper-class="popper_data_manage"
                class="label_item_xw"
              >
                <div slot="content">设置组内成员在各模块可查看的信息归属</div>

                <zn-icon :iconName="'dataManagementxw'" class="" />
              </el-tooltip>
            </span>
            <el-select style="width: 100%" v-model="form.visible_range">
              <el-option label="仅自己" value="1"></el-option>
              <el-option label="所有人" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 关联成员 -->
        <el-col :span="24">
          <el-form-item label="关联成员">
            <span slot="label">
              <span>关联成员</span>
              <el-tooltip
                placement="right"
                popper-class="popper_data_manage"
                class="label_item_xw"
              >
                <div slot="content">同一数据组下关联的成员数据权限一致</div>

                <zn-icon :iconName="'dataManagementxw'" class="" />
              </el-tooltip>
            </span>
            <el-select
              style="width: 100%"
              v-model="form.members"
              placeholder="关联成员"
              multiple
              filterable
              remote
              reserve-keyword
              :remote-method="getUserList"
            >
              <el-option
                v-for="(item, index) of user_list"
                :key="index"
                :label="item.nickname"
                :value="item.id"
                :loading="user_search_loading"
              >
                <span style="float: left">{{ item.nickname }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="drawer-footer">
      <el-button class="el-cancel" @click="close">取消</el-button>
      <el-button class="el-continue" @click="commit(1)">
        确定并继续添加
      </el-button>
      <el-button type="primary" @click="commit(0)">确定</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { getRegion } from '@/api/index'
import { dataAdd, userList } from '@/api/system/data'
const cityData = require('./pcas-code.json')
export default {
  name: 'addDataManagement',
  components: {},
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
      cityData: [],
      areaProps: {
        lazy: true,
        multiple: true,
        checkStrictly: false,
        async lazyLoad(node, resolve) {
          let { level, loading, root, data, pathLabels } = node
          let parent_code = level ? data['value'] : 0
          // 获取方法
          let callback = async (parent_code) => {
            return await new Promise((r, e) => {
              getRegion({ parent_code }).then((res) => {
                let { data } = res
                if (level >= 3) {
                  data.forEach((r) => {
                    r['leaf'] = true
                  })
                }
                r(data)
              })
            })
          }
          let result = await callback(parent_code)
          return resolve(result)
          // if (root === true) {
          //   let result = await callback(parent_code)
          //   return resolve(result)
          // } else {
          //   if (level != 21) {
          //     let result = await callback(parent_code)
          //     result.forEach(async (r) => {
          //       r['chidren'] = await callback(r['value'])
          //       r['chidren'].forEach(async (k) => {
          //         k['chidren'] = await callback(k['value'])
          //         k['chidren'].forEach(async (m) => {
          //           m['leaf'] = false
          //         })
          //       })
          //     })
          //     return resolve(result)
          //   } else {
          //     console.log(node)
          //     // return resolve([])
          //   }
          // }
        },
      },
      initData: {
        visible_range: [],
      },
      direction: 'rtl',
      form: {
        name: '',
        describe: '',
        visible_range: '',
        regions: [],
        members: '',
      },
      rules: {
        name: [{ required: true, message: '必填', trigger: 'change' }],
        describe: [{ required: true, message: '必填', trigger: 'change' }],
        visible_range: [{ required: true, message: '必填', trigger: 'change' }],
        scope: [{ required: true, message: '必填', trigger: 'change' }],
        regions: [{ required: true, message: '必填', trigger: 'change' }],
      },
      drawer: false,
      // 成员列表
      user_list: [],
      user_search_loading: false,
    }
  },
  methods: {
    show() {
      this.drawer = true
      setTimeout(() => {
        this.cityData = require('./pcas-code2.json')
      }, 0)
    },
    close() {},
    save() {},
    commit(e) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let { name, describe, regions, visible_range, members } = this.form
          let data = {
            name,
            describe,
            visible_range,
            members: members.join(','),
            regions: regions
              .map((item) => {
                return item.join('_')
              })
              .join(','),
          }
          dataAdd(data).then((res) => {
            if (e) {
              this.$refs['ruleForm'].resetFields()
              this.form.members = []
              this.getUserList()
            } else {
              // 关闭逻辑
              this.close()
            }
            this.$emit('fetch-data')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    close() {
      this.$refs['ruleForm'].resetFields()
      this.form = this.$options.data().form
      this.drawer = false
    },
    getUserList(keywords) {
      userList({ keywords }).then((res) => {
        this.user_list = res['data']
      })
    },
  },

  created() {
    // 获取成员列表
    this.getUserList('')
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
}
.label_item_xw {
  position: relative;
  z-index: 2222;
  left: 9px;
  cursor: pointer;
}
</style>

