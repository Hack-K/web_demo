<template>
  <!-- 添加和编辑 -->
  <el-dialog
    :title="title"
    :visible.sync="dialogFormVisible"
    width="55%"
    @close="close"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      label-width="80px"
      :model="form"
      :rules="rules"
      :label-position="'left'"
      size="medium"
    >
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="上级菜单" prop="parent_id">
            <el-popover
              placement="bottom"
              trigger="hover"
              width="217"
              ref="popover"
            >
              <el-input
                slot="reference"
                placeholder="输入关键字过滤"
                v-model="filterText"
                clearable
              ></el-input>
              <el-tree
                ref="tree"
                :data="treeData"
                node-key="id"
                style="height: 350px; overflow-y: auto"
                :props="defaultProps"
                :filter-node-method="filterNode"
                default-expand-all
                @node-click="handleNodeClick"
              ></el-tree>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :label="form.type == '2' ? '按钮名称' : '菜单名称'"
            prop="name"
          >
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单类型">
            <el-radio-group v-model="form.type">
              <el-radio label="0">目录</el-radio>
              <el-radio label="1">菜单</el-radio>
              <el-radio label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="路径" prop="path">
            <el-input v-model="form.path" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="权限标识" prop="permission">
            <el-input v-model="form.permission" @keyup.enter.native="save" />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="页签名称" prop="meta.title">
            <el-input v-model="form.meta.title" />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="form.type == '1'">
          <el-form-item label="图标">
            <el-popover
              popper-class="icon-selector-popper"
              trigger="click"
              placement="right-start"
              width="330"
            >
              <template #reference>
                <el-input v-model="form.meta.icon" />
              </template>
              <zn-icon-selector @handle-icon="handleIcon" />
            </el-popover>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="排序">
            <el-input-number
              v-model="form.sort"
              controls-position="right"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.type == '0'">
          <el-form-item label="未选中时">
            <bgi-upload :url="form.meta.imgPath" @set-url="getMenuBgi1" />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="form.type == '0'">
          <el-form-item label="隐藏">
            <el-switch v-model="form.meta.hidden" />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="上线隐藏">
            <el-switch v-model="form.online_hide" />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="form.type == '1'">
          <el-form-item label="隐藏二级">
            <el-switch v-model="form.meta.hidden" />
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="缓存">
            <el-switch v-model="form.meta.noKeepAlive" />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="同页异名">
            <el-switch v-model="form.meta.dynamicNewTab" />
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="面包屑">
            <el-switch v-model="form.meta.breadcrumbHidden" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.type == '0'">
          <el-form-item label="选中时">
            <bgi-upload :url="form.meta.selectImgPath" @set-url="getMenuBgi2" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="form.type == '0'">
          <el-form-item label="应用图片">
            <bgi-upload
              :url="form.meta.applicationImagePath"
              @set-url="getMenuBgi3"
            />
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="新窗口打开">
            <el-switch v-model="form.meta.target" />
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="提示dot">
            <el-switch v-model="form.meta.dot" />
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="form.type !== '2'">
          <el-form-item label="badge" v-if="form.type == '1'">
            <el-input v-model="form.meta.badge" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="客户端类型">
            <el-radio-group v-model="form.identify">
              <el-radio :label="1">pc</el-radio>
              <el-radio :label="2">小程序</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!-- <el-form-item label="自定义svg图标">
        <el-switch v-model="form.meta.isCustomSvg" />
      </el-form-item> -->
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" v-preventReClick @click="save">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import ZnIconSelector from '@/extra/ZnIconSelector'
import { doEdit, doAdd, getTree } from '@/api/system/menuManagement'
import bgiUpload from './bgiUpload'
export default {
  name: 'MenuManagementEdit',
  components: { ZnIconSelector, bgiUpload },
  data() {
    return {
      title: '',
      form: {
        identify: 1, //1：pc端菜单 2：移动菜单
        //字段注释参考explain.js
        parent_id: '',
        name: '',
        type: '0', //0目录1菜单2按钮
        path: '',
        online_hide: false, //上线隐藏1是0否
        is_display: true, //是否显示在菜单中显示隐藏一级路由
        permission: '', //三级权限标识
        meta: {
          title: '', //菜单名称
          icon: '', //二级菜单图标
          badge: '', //二级菜单提示圆点(包含内容)
          dot: '', //二级菜单提示圆点
          hidden: false, //是否显示在菜单中显示隐藏路由
          noColumn: false, //是否隐藏分栏，仅在分栏布局中二级路由生效
          breadcrumbHidden: false, //面包屑是否显示（默认值：false）
          dynamicNewTab: false, //动态传参路由是否新开标签页（默认值：false）
          target: false, //是否浏览新标签页打开（不适用于分栏布局左侧tab部分）
          noKeepAlive: true, //当前路由是否不缓存（默认值：false）
          imgPath: [], //一级菜单未选中时背景图
          selectImgPath: [], //二级菜单选中时背景图,
          applicationImagePath: [],
        },
      },
      rules: {
        parent_id: [
          { required: true, trigger: 'blur', message: '请选择上级菜单' },
        ],
        name: [{ required: true, trigger: 'blur', message: '请输入菜单名称' }],
        permission: [
          { required: true, trigger: 'blur', message: '请输入权限标识' },
        ],
        path: [{ required: true, trigger: 'blur', message: '请输入路径' }],
        'meta.title': [
          { required: true, trigger: 'blur', message: '请输入页签名称' },
        ],
      },
      dialogFormVisible: false,
      filterText: '', //菜单树搜索过滤
      treeData: [
        {
          id: 0,
          name: '顶级菜单',
          children: [],
        },
      ], //菜单树,外层套顶级
      defaultProps: {
        children: 'children',
        label: 'name',
      },
    }
  },
  created() {
    // this.fetchData()
  },
  methods: {
    getMenuBgi1(val) {
      this.form.meta.imgPath.push(val)
    },
    getMenuBgi2(val) {
      this.form.meta.selectImgPath.push(val)
    },
    getMenuBgi3(val) {
      this.form.meta.applicationImagePath.push(val)
    },
    fetchData() {
      getTree().then((res) => {
        this.treeData[0].children = res.data
      })
    },
    handleIcon(item) {
      this.form.meta.icon = item
    },
    showEdit(row) {
      if (!row) {
        this.title = '添加'
      } else {
        this.title = '编辑'
        this.form = JSON.parse(JSON.stringify(Object.assign({}, row)))
        this.form.meta['applicationImagePath'] = []
        this.getRowName(this.treeData)
      }
      this.dialogFormVisible = true
    },
    getRowName(arr) {
      arr.forEach((item) => {
        if (item.id == this.form.parent_id) {
          return (this.filterText = item.name)
        } else if (item.children && item.children.length > 0) {
          this.getRowName(item.children)
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.filterText = data.name
      this.form.parent_id = data.id
      this.$refs.popover.doToggle()
    },
    close() {
      this.filterText = ''
      ;(this.form = {
        //字段注释参考explain.js
        parent_id: '',
        name: '',
        type: '0', //0目录1菜单2按钮
        path: '',
        online_hide: false, //上线隐藏1是0否
        is_display: true, //是否显示在菜单中显示隐藏一级路由
        permission: '', //三级权限标识
        identify: 1,
        meta: {
          title: '', //菜单名称
          icon: '', //二级菜单图标
          badge: '', //二级菜单提示圆点(包含内容)
          dot: '', //二级菜单提示圆点
          hidden: false, //是否显示在菜单中显示隐藏路由
          noColumn: false, //是否隐藏分栏，仅在分栏布局中二级路由生效
          breadcrumbHidden: false, //面包屑是否显示（默认值：false）
          dynamicNewTab: false, //动态传参路由是否新开标签页（默认值：false）
          target: false, //是否浏览新标签页打开（不适用于分栏布局左侧tab部分）
          noKeepAlive: true, //当前路由是否不缓存（默认值：false）
          imgPath: [], //一级菜单未选中时背景图
          selectImgPath: [], //二级菜单选中时背景图
        },
      }),
        // this.form = this.$options.data().form
        (this.dialogFormVisible = false)
    },
    save() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.form.type == '0') {
            this.form.component = 'Layout'
          }
          if (this.form.type == '1') {
            this.form.component = '@/views' + this.form.path
          }
          if (this.form.type == '2') {
            this.form.meta.hidden = true
          }
          if (this.title == '添加') {
            const { msg } = await doAdd(this.form)
            this.$notify({
              title: '成功',
              message: '添加成功',
              type: 'success',
              duration: 1000,
            })
          } else {
            const { msg } = await doEdit(this.form)
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 1000,
            })
          }
          this.$emit('fetch-data')
          this.close()
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 20px;
  overflow: hidden;
  .el-input-number--medium {
    width: 100%;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 100px;
    height: 100px;
  }
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }
}
</style>