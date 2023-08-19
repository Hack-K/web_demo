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
      <el-form-item label="数据组名称" prop="name">
        <el-input
          v-model="deatils.name"
          :class="switchEdit ? '' : 'input-bn'"
          maxlength="30"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="数据组描述" prop="describe">
        <div
          class="description"
          v-if="!switchEdit"
          v-html="deatils.describe"
        ></div>
        <el-input
          v-else
          type="textarea"
          :autosize="{ minRows: 6 }"
          :maxlength="300"
          show-word-limit
          placeholder="请输入"
          v-model="deatils.describe"
        ></el-input>
      </el-form-item>
      <el-col :span="24" class="title">数据权限</el-col>
      <el-form-item prop="regions">
        <div
          class="custom-label flex-center mb-10"
          :class="switchEdit ? 'custom-label-edit' : ''"
        >
          <div class="mr-10">客户权限</div>
          <el-tooltip
            placement="right"
            popper-class="popper_data_manage"
            class="label_item_xw"
          >
            <div slot="content" style="line-height: 22px">
              以客户的居住区域作为选择范围，选
              <br />
              择后组内成员可查看该区域客户的基
              <br />
              本信息、通话记录、工单和任务信息
            </div>
            <zn-icon :iconName="'dataManagementxw'" class="custom-label-icon" />
          </el-tooltip>
        </div>
        <!---->
        <el-cascader
          :options="cityData"
          v-model="deatils.regions"
          :collapse-tags="true"
          :props="{
            value: 'd',
            label: 'v',
            children: 'c',
            multiple: true,
            separator: '_',
          }"
        ></el-cascader>
      </el-form-item>
      <el-form-item
        label="门店权限"
        v-permissions="{
          permission: ['system:dataManagement:shop'],
        }"
      >
        <el-select
          placeholder="请选择"
          clearable
          multiple
          v-model="deatils.store_ids"
        >
          <el-option
            v-for="item in all_store"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="name">
        <div
          class="custom-label flex-center mb-10"
          :class="switchEdit ? 'custom-label-edit' : ''"
        >
          <div class="mr-10">可见范围</div>
          <el-tooltip
            placement="right"
            popper-class="popper_data_manage"
            class="label_item_xw"
          >
            <div slot="content">设置组内成员在各模块可查看的信息归属</div>
            <zn-icon :iconName="'dataManagementxw'" class="custom-label-icon" />
          </el-tooltip>
        </div>
        <el-select
          v-if="deatils && deatils.visible_range"
          v-model="deatils.visible_range.value"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in visiablOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-col :span="24" class="title">其他信息</el-col>
      <el-col :span="12" style="padding-left: 0">
        <el-form-item label="创建人">
          <el-input
            v-if="deatils && deatils.create_user_id"
            v-model="deatils.create_user_id.label"
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
            v-if="deatils && deatils.update_user_id"
            v-model="deatils.update_user_id.label"
            :disabled="true"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="padding-right: 0">
        <el-form-item label="更新时间">
          <el-input v-model="deatils.update_time" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-col :span="24" class="footer" v-if="switchEdit">
      <el-button type="primary" class="cancel" @click="close">取 消</el-button>
      <el-button type="primary" class="save" @click="save">确 定</el-button>
    </el-col>
  </div>
</template>

<script>
import { doEdit } from '@/api/system/dataManagement'
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
  },
  data() {
    return {
      visiablOptions: [
        {
          value: 1,
          label: '仅自己',
        },
        {
          value: 2,
          label: '所有人',
        },
      ],
      cityData: [],
      //门店列表
      all_store: [],
      form: {
        name: '', //数据组名称
        describe: '', //描述
        visible_range: '', //可见范围
        regions: [], // 地区
        store_ids: '', //店铺ID
      },
      rules: {
        name: [
          { required: true, trigger: ['blur', 'change'], message: '必填' },
        ],
        describe: [{ required: true, trigger: 'blur', message: '必填' }],
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
  created() {
    setTimeout(() => {
      this.cityData = require('./pcas-code2.json')
    }, 0)
  },
  mounted() {},
  methods: {
    // 加载区域
    // 取消
    close() {
      this.$emit('set-switch', false)
      this.$emit('fetch-data', this.deatils.id) //取消编辑后查询详情,恢复树的数据选中状态
    },
    //  提交
    save() {
      this.$confirm(
        '本次操作涉及' + `${this.deatils.member_count}` + '个成员，确认修改？',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then((_) => {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let regions = JSON.parse(JSON.stringify(this.deatils.regions))
            doEdit({
              id: this.deatils.id,
              name: this.deatils.name,
              describe: this.deatils.describe,
              visible_range: this.deatils.visible_range.value,
              regions: regions
                .map((item) => {
                  return item.join('_')
                })
                .join(','),
              store_ids: this.deatils.store_ids.join(','),
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
  // padding-bottom: 56px;
  .title {
    padding: 0 0 16px 0 !important;
    font-weight: 500;
    font-size: 14px;
    color: $base-text-4;
  }
  ::v-deep .el-form {
    .el-form-item__label {
      color: $base-text-3;
      line-height: 22px;
      margin-bottom: 10px;
    }
    .el-form-item {
      margin-bottom: 24px;
      .el-select {
        width: 100%;
      }
      .el-cascader {
        width: 100%;
        max-height: 300px;
        .el-cascader__tags {
          // padding-top: 3px;
          max-height: 100%;
          overflow: auto;
          right: 0;
        }
      }
      .el-textarea__inner {
        border-radius: 4px;
        font-size: 14px;
        resize: none;
        min-height: 172px !important;
      }
      .el-input__count {
        color: $base-text-3;
        font-size: 14px;
      }
      .el-input {
        .el-input__inner {
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
      .input-bn,
      .wangEdit {
        .el-textarea__inner {
          height: 172px;
        }
      }
      .wangEdit {
        height: 172px;
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
  // 自定义 label
  .custom-label {
    width: 100%;
    color: $base-text-3;
    &::before {
      content: '*';
      color: #ff4d4f;
      margin-right: 4px;
      display: none;
    }
    &-icon {
      color: $base-fill-6;
      transform: scale(0.875);
    }
    &-edit::before {
      display: block;
    }
  }
}
</style>
