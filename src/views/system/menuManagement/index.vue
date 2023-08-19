<template>
  <div class="container menu-management-container">
    <zn-query-form>
      <zn-query-form-left-panel :span="12"></zn-query-form-left-panel>
      <zn-query-form-right-panel :span="12">
        <el-button icon="el-icon-plus" type="primary" @click="handleEdit()">
          添加
        </el-button>
      </zn-query-form-right-panel>
    </zn-query-form>
    <el-table
      v-loading="listLoading"
      border
      height="700"
      :data="list"
      default-expand-all
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :header-cell-style="{ 'text-align': 'center' }"
    >
      <el-table-column
        align="left"
        label="菜单名称"
        prop="name"
        show-overflow-tooltip
        width="200"
      />

      <el-table-column label="是否移动端">
        <template slot-scope="scope">
          <span>{{ scope.row.identify === 1 ? '否' : '是' }}</span>
        </template>
      </el-table-column>

      <el-table-column
        align="center"
        label="页签名称"
        prop="meta.title"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="排序"
        prop="sort"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="菜单类型"
        prop="type"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.type == 0 ? '目录' : row.type == 1 ? '菜单' : '按钮' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="路径"
        prop="path"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        prop="hidden"
        label="是否显示"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ row.meta.hidden ? '否' : '是' }}
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="权限标识"
        prop="permission"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        prop="online_hide"
        label="是否上线隐藏"
        show-overflow-tooltip
      />
      <el-table-column
        align="center"
        label="vue文件路径"
        prop="component"
        min-width="150"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column align="center" label="图标" show-overflow-tooltip>
        <template #default="{ row }">
          <zn-icon v-if="row.meta && row.meta.icon" :iconName="row.meta.icon" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="路由缓存" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.meta && row.meta.noKeepAlive ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="同页异名" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.meta && row.meta.dynamicNewTab ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="面包屑" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.meta && row.meta.breadcrumbHidden ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="新窗口打开" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.meta && row.meta.target == '_blank' ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="badge" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag v-if="row.meta && row.meta.badge" effect="dark" type="danger">
            {{ row.meta.badge }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="dot" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.meta && row.meta.dot ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        label="操作"
        show-overflow-tooltip
        width="200"
      >
        <template #default="{ row }">
          <el-button type="text" @click="handleEdit(row)">
            <zn-icon :iconName="'edit-2-line'" />
            编辑
          </el-button>
          <el-button type="text" @click="handleDelete(row)">
            <zn-icon :iconName="'delete-bin-6-line'" />
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--   -->
    <edit ref="edit" @fetch-data="fetchData" />
  </div>
</template>

<script>
import { doDelete, getTree } from '@/api/system/menuManagement'
import Edit from './components/menuManagementEdit'

export default {
  name: 'MenuManagement',
  components: { Edit },
  data() {
    return {
      queryParams: {},
      list: [],
      listLoading: true,
      // 菜单状态数据字典
      statusOptions: [],
    }
  },
  created() {
    this.fetchData()
    // this.getDicts("sys_normal_disable").then(response => {
    //   this.statusOptions = response.data;
    // });
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      getTree().then((res) => {
        if (res.code == 200) {
          this.list = res.data
          this.listLoading = false
          this.$refs['edit'].treeData[0].children = res.data
        }
      })
    },
    handleEdit(row) {
      if (row) {
        this.$refs['edit'].showEdit(row)
      } else {
        this.$refs['edit'].showEdit()
      }
    },
    handleDelete(row) {
      this.$baseConfirm('你确定要删除当前项吗', null, async () => {
        const { msg } = await doDelete({ id: row.id })
        this.$baseMessage(msg, 'success', 'zn-hey-message-success')
        await this.fetchData()
      })
    },
    resetQuery(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep .el-table__body-wrapper {
  overflow: hidden;
  &:hover {
    overflow: overlay;
  }
}
</style>
