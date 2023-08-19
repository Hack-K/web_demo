<template>
  <div class="height-100">
    <el-col :span="12" class="section-left">
      <div class="header">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
        >
          全选
        </el-checkbox>
      </div>
      <el-input
        class="search"
        placeholder="请输入姓名搜索"
        suffix-icon="el-icon-search"
        v-model="searchTextLeft"
        clearable
        @input="getSearch"
      />
      <el-checkbox-group
        class="checkbox-group"
        v-model="checkedRoles"
        @change="handleCheckedCitiesChange"
      >
        <el-checkbox
          class="overflowOne"
          v-for="role in leftData"
          :label="role.id"
          :key="role.id"
        >
          {{ role.nickname }}
          <p class="mt-10">{{ role.mobile }}</p>
        </el-checkbox>
      </el-checkbox-group>
    </el-col>

    <el-col :span="12" class="section-right">
      <div class="header">{{ title || '管理员' }}</div>
      <el-input
        class="search"
        placeholder="请输入姓名搜索"
        suffix-icon="el-icon-search"
        v-model="searchTextRight"
        clearable
        @input="getSearch"
      />
      <div class="checked-group">
        <el-col
          class="li overflowOne"
          v-for="(role, index) in selectedRoles"
          :key="role.nickname + role.id"
        >
          {{ role.nickname }}
          <p class="mt-10">{{ role.mobile }}</p>
          <zn-icon :iconName="'icon-close'" @click="delRole(role, index)" />
        </el-col>
      </div>
    </el-col>

    <div class="drawer-footer">
      <el-button class="el-cancel" @click="cancel">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZnTransfer',
  components: {},
  props: {
    roles: {
      type: Array,
      default: () => [],
    },
    associatedList: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      checkAll: false,
      checkedRoles: this.associatedList,
      isIndeterminate: true,
      searchTextLeft: '',
      searchTextRight: '',
    }
  },
  computed: {
    // 右侧已选数据
    selectedRoles() {
      let arr = []
      if (this.checkedRoles.length > 0) {
        arr = this.roles.filter((item) => this.checkedRoles.includes(item.id))
        if (this.searchTextRight) {
          return this.compare(
            arr.filter((i) => i.nickname.includes(this.searchTextRight))
          )
        } else {
          return this.compare(arr) //根据人名排序
        }
      } else {
        return arr
      }
    },
    leftData() {
      if (this.searchTextLeft) {
        return this.roles.filter((i) =>
          i.nickname.includes(this.searchTextLeft)
        )
      } else {
        return this.roles
      }
    },
  },
  watch: {
    associatedList: {
      handler(newVal, oldVal) {
        this.checkedRoles = newVal
      },
      deep: true,
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    cancel() {
      this.$emit('close-drawer')
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
            return i.id
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
      let idx = this.checkedRoles.findIndex((itm) => itm == role.id)
      if (idx != -1) {
        this.checkedRoles.splice(idx, 1)
      }
    },
    // 提交
    save() {
      console.log('this.selectedRoles', this.selectedRoles)
      if (this.selectedRoles.length) this.$emit('up-data', this.selectedRoles)
      else this.$emit('close-drawer')
    },
  },
}
</script>

<style lang="scss" scoped>
.section-left,
.section-right {
  height: 100%;
  overflow: hidden;
  border: 1px solid $base-line-2;
  border-collapse: collapse;
  .header {
    height: $base-input-height;
    padding-left: 16px;
    line-height: $base-input-height;
    background: $base-fill-2;
  }
  .search {
    width: 100%;
    padding: 8px 12px;

    border-radius: 2px;
    .el-input__inner {
      background: $base-fill-3;
    }
    ::v-deep .el-input__suffix {
      margin-right: 10px !important;
      top: 2px;
      color: $base-fill-6;
    }
  }
  ::v-deep.checkbox-group {
    height: calc(100% - 84px);
    overflow-y: hidden;
    overflow-x: hidden;
    &:hover{
      overflow-y: overlay;
    }
    .el-checkbox {
      width: 100%;
      height: 62px;
      padding: 7px 16px 0 16px;
      margin-right: 0;
      //   padding: 10px 0;
      .el-checkbox__input {
        margin-top: 3px;
        vertical-align: top;
      }
      p {
        color: $base-text-3;
      }
      &:hover {
        background: $base-fill-2;
      }
    }
  }
}
.section-left {
  border-top-left-radius: $base-border-radius-4;
  border-bottom-left-radius: $base-border-radius-4;
}
.section-right {
  border-left: none;
  border-top-right-radius: $base-border-radius-4;
  border-bottom-right-radius: $base-border-radius-4;
  .checked-group {
    height: calc(100% - 84px);
    overflow-y: auto;
    overflow-x: hidden;
    .li {
      height: 62px;
      padding: 7px 16px 0 16px;
      position: relative;
      p {
        line-height: 21px;
        color: $base-text-3;
      }
      .zn-icon {
        position: absolute;
        right: 28px;
        top: 23px;
        color: $base-fill-5;
      }
      &:hover {
        background: $base-fill-2;
      }
    }
  }
}
.el-checkbox-group ::v-deep.checkbox-group {
  height: calc(100% - 84px);
  overflow-y: auto;
  overflow-x: hidden;
}
.el-checkbox-group ::v-deep .el-checkbox {
  width: 100%;
  height: 62px;
  padding: 7px 16px 0 16px;
  margin-right: 0;
  //   padding: 10px 0;
  .el-checkbox__input {
    margin-top: 3px;
    vertical-align: top;
  }
  p {
    color: $base-text-3;
  }
  &:hover {
    background: $base-fill-2;
  }
}
</style>
