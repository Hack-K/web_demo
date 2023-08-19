<!--
 * @Descripttion: 
 * @version: 
 * @Author: LiZeju
 * @Date: 2022-06-16 16:46:54
 * @LastEditors: LiZeju
 * @LastEditTime: 2022-06-30 16:35:47
-->
<template>
  <el-drawer class="associated-member" title="添加成员" :visible.sync="drawer" :direction="direction" :append-to-body="false"
    :modal-append-to-body="false" :close-on-press-escape="false" :wrapperClosable="false" :size="685">
    <div class="height-100">
      <el-col :span="12" class="section-left">
        <div class="header">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            全选
          </el-checkbox>
        </div>
        <el-input class="search" placeholder="请输入姓名、企业搜索" suffix-icon="el-icon-search" v-model="searchTextLeft" clearable
          @input="getSearch" />
        <el-checkbox-group v-if="leftData.length > 0" class="checkbox-group" v-model="checkedRoles"
          @change="handleCheckedCitiesChange">
          <el-checkbox class="overflowOne" v-for="role in leftData" :label="role.member_id" :key="role.member_id">
            <div class="name">{{ role.member_name }}</div>
            <div class="member_name mt-4">
              <span class="mr-16">{{ role.contact_name }}</span>
              <span>{{ role.contact_phone }}</span>
            </div>
          </el-checkbox>
        </el-checkbox-group>
        <!-- 暂无缺省页 -->
        <div class="left-empty" v-else>
          <empty></empty>
        </div>
      </el-col>

      <el-col :span="12" class="section-right">
        <div class="header">{{ title }}</div>
        <el-input class="search" placeholder="请输入姓名、企业搜索" suffix-icon="el-icon-search" v-model="searchTextRight" clearable
          @input="getSearch" />
        <div class="checked-group" v-if="selectedRoles.length > 0">
          <el-col class="item overflowOne" v-for="(role, index) in selectedRoles" :key="role.member_name + role.member_id">
            <div class="name">{{ role.member_name }}</div>
            <div class="member_name mt-4">
              <span class="mr-16">{{ role.contact_name }}</span>
              <span>{{ role.contact_phone }}</span>
            </div>
            <div class="delete-btn flex-column" @click="delRole(role, index)">
              <zn-icon :iconName="'icon-close'" />
            </div>
            
          </el-col>
        </div>
        <!-- 暂无缺省页 -->
        <div class="left-empty" v-else>
          <empty></empty>
        </div>
      </el-col>

      <div class="drawer-footer">
        <el-button class="el-cancel" @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import empty from "./empty"
import { getMemberList, getAssociatedList, bindingMember } from '@/api/chamber/club'

export default {
  name: 'AddMember',
  props: {
    title: {
      type: String,
      default: () => "已选择"
    }
  },
  components: {
    empty
  },
  data() {
    return {
      drawer: false,
      direction: 'rtl',
      roles: [],
      id: '',
      /* 列表查询参 */
      query: {
        id: "",
        keywords: "",
      },
      checkAll: false,
      checkedRoles: [],
      isIndeterminate: true,
      searchTextLeft: '',
      searchTextRight: '',
    }
  },

  methods: {
    async show(id) {
      this.id = id
      this.query.id = id
      this.getMember(id)
      this.drawer = true
    },
    async getMember(id) {
      await getAssociatedList(this.query).then(async (res) => {
        if (res.code == 200) {
          this.roles = res.data.all_list
          this.checkedRoles = res.data.select_list.map((v) => v.member_id)  //已关联的成员数据
        }
      })
    },
    close() {
      this.drawer = false
    },
    // 提交
    submit() {
      bindingMember({
        group_id: this.id,
        member_ids: this.selectedRoles.map((v) => v.member_id),
      }).then((res) => {
        if (res.code == 200) {
          this.$notify({
            title: '成功',
            message: '添加成员成功！',
            type: 'success',
            duration: 1000
          })
          this.drawer = false
          this.$emit('fetch-data')
        }
      })
    },
    // 处理搜索
    getSearch() {
      if (this.searchTextLeft) {
        return this.leftData
      }
      if (this.searchTextRight) {
        return this.selectedRoles
      }
    },
    handleCheckAllChange(val) {
      this.checkedRoles = val
        ? this.leftData.map((i) => {
          return i.member_id
        })
        : [] //深拷贝解决全选之后单个删除右侧数据会触发左侧数据源的删除
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.roles.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.roles.length
    },
    // 删除某一个
    delRole(role, index) {
      let idx = this.checkedRoles.findIndex((itm) => itm == role.member_id)
      if (idx != -1) {
        this.checkedRoles.splice(idx, 1)
      }
    },
  },
  computed: {
    // 右侧已选数据
    selectedRoles() {
      let arr = []
      if (this.checkedRoles.length > 0) {
        arr = this.roles.filter((item) => this.checkedRoles.includes(item.member_id))
        if (this.searchTextRight) {
          return this.compare(
            arr.filter((i) => i.member_name.includes(this.searchTextRight) || i.contact_name.includes(this.searchTextRight)), 'club'
          )
        } else {
          return this.compare(arr, 'club') //根据人名排序
        }
      } else {
        return arr
      }
    },
    leftData() {
      if (this.searchTextLeft) {
        return this.roles.filter((i) =>
          i.member_name.includes(this.searchTextLeft) || i.contact_name.includes(this.searchTextLeft)
        )
      } else {
        return this.roles
      }
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep.associated-member {
  position: relative;
  .zn-icon{
    margin-right: 0;
  }
  .el-drawer__body {
    padding: 24px;
    height: 100%;
    overflow: hidden;
    padding-bottom: 54px!important;
  }
}

.header {
  height: 40px;
  padding-left: 16px;
  line-height: 40px;
  background: $base-fill-2;
}

::v-deep .search {
  width: 100%;
  padding: 8px 12px;

  .el-input__inner {
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    border: none;
    padding: 0 12px;
    border-radius: 2px;
    background: $base-fill-3;
  }

  .el-input__suffix {
    margin-right: 10px !important;
    top: 2px;
    color: $base-text-4;
  }
}

.name,
.member_name {
  font-size: 14px;
  line-height: 22px;
  font-weight: normal;
}

.member_name {
  color: $base-text-3;
}

.section-left,
.section-right {
  height: 100%;
  overflow: hidden;
  border: 1px solid $base-line-2;
  border-collapse: collapse;
}
/* 左边样式 */
.section-left {
  border-top-left-radius: $base-border-radius-4;
  border-bottom-left-radius: $base-border-radius-4;

  .checkbox-group {
    height: calc(100% - 84px);
    padding: 0 8px;
    overflow: hidden;
    overflow-y: auto;
    .el-checkbox {
      width: 100%;
      padding: 7px 8px 5px;
      margin-right: 0;
      margin-bottom: 2px;
      border-radius: 4px;

      ::v-deep .el-checkbox__input {
        margin-top: 4px;
        vertical-align: top;
      }

      &:hover {
        background: $base-fill-4;
      }
    }
    .el-checkbox:last-child{
      margin-bottom: 10px;
    }
  }
}
/* 右边样式 */
.section-right {
  border-left: none;
  border-top-right-radius: $base-border-radius-4;
  border-bottom-right-radius: $base-border-radius-4;

  .checked-group {
    padding: 0 8px;
    height: calc(100% - 84px);
    overflow: hidden;
    overflow-y: auto;
    .item {
      padding: 7px 8px 5px 5px;
      position: relative;
      border-radius: 4px;
      &:hover{
        background: $base-fill-4;
      }
    }
    .delete-btn{
      width: 16px;
      height: 16px;
      border-radius: 2px;
      position: absolute;
      right: 8px;
      top: 50%;
      font-weight: bold;
      margin-top: -8px;
      color: $base-text-5;
      .zn-icon{
        width: 18px;
        height: 18px;
      }
      &:hover{
        background: $base-fill-5;
      }
    }
  }
}


.left-empty {
  height: calc(100% - 40px - 44px);
}
</style>