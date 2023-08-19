<template>
    <div class="club-container flex parent-container">
        <div class="club-left pd-20-24">
            <div class="title mb-20">专委会</div>
            <div class="club-lists">
                <zn-draggable v-bind="dragOptions" :list="listData" @end="submitSort()">
                    <div class="club-item" v-for="item, index in listData" :key="item.id">
                        <!--  v-if="currentIndex !== index" -->
                        <div class="club-item-show"
                            :class="{ 'active': currentClub === item.id }" @click="clubChange(item)">
                            <div class="club-item-name">{{ item.name }}</div>
                            <div @click.stop>
                                <el-popover placement="bottom-end" width="108" popper-class="normal-popover"
                                    :visible-arrow="false" ref="normalPopover">
                                    <div class="popover-item" @click="editClub(item,index)">编辑专委会</div>
                                    <div class="popover-item red" @click="delClub(item.id, index)">删除</div>
                                    <el-button slot="reference" class="edit-button" size="medium"
                                        v-permissions="{ permission: ['chamber:club:edit'] }">
                                        <zn-icon :iconName="'icon-more'" />
                                    </el-button>
                                </el-popover>
                            </div>
                        </div>
                        <!-- <div class="club-item-edit" v-else>
                            <el-input :ref="'editInput' + item.id" v-model="currentText" placeholder="请填写专委会名称"
                                @blur="editBlur">
                            </el-input>
                        </div> -->
                    </div>
                </zn-draggable>
                <div>
                    <el-button class="add-button" @click="addClub" v-permissions="{ permission: ['chamber:club:add'] }">
                        <zn-icon :iconName="'icon-add'" class="mr-6" />
                        <span>新建专委会</span>
                    </el-button>
                </div>
            </div>

        </div>
        <div class="club-right">
            <div class="tabs flex">
                <div class="tab mr-24" :class="{ 'active': currentTab === item.value }" v-for="item in tabs" :key="item.id"
                    @click="tabChange(item)">
                    {{ item.label }}
                </div>
            </div>
            <div class="content">
                <!-- 专委会信息 -->
                <div class="tab-info pd-24" v-if="currentTab === 1">
                    <info-detail :detailData="detailData" @editInfo="addClub('edit')"></info-detail>
                </div>
                <!-- 专委会成员 -->
                <div class="tab-list" v-if="currentTab === 2">
                    <member-table :id="currentClub" :title="detailData.name"></member-table>
                </div>
            </div>
        </div>
        <!-- 添加专委会抽屉 -->
        <add-club v-if="drawer" ref="addClub" @closeDrawer="closeDrawer" @saveForm="upadeData"></add-club>
    </div>
</template>

<script>
import { getClubList, getClubDetail, saveSortClub, saveClub, delClub } from "@/api/chamber/club"
import ZnDraggable from 'vuedraggable'
import addClub from "./components/addClub"
import infoDetail from "./components/infoDetail"
import memberTable from "./components/memberTable"
export default {
    name: "Club",
    components: {
        addClub,
        infoDetail,
        memberTable,
        ZnDraggable,
    },
    data() {
        return {
            detailData: null,   // 专委会详情
            drawer: false,      // 新增抽屉
            currentText: "",        // 当前专委会文本
            currentIndex: "",      // 当前编辑专委会
            currentClub: "",     // 当前专委会 id
            currentItem: null,      // 当前专委会
            listData: [],        // 专委会列表   
            currentTab: 1,      // 当前 tab 选中栏
            tabs: [
                {
                    label: "专委会信息",
                    value: 1
                },
                {
                    label: "专委会成员",
                    value: 2
                },
            ]
        }
    },
    async created() {
        await this.getClubData()
        await this.getDetail()
    },
    methods: {
        // 编辑专委会 [暂时弃用]
        async editBlur() {
            // 未做修改 或者 为空时
            if (this.currentText === this.currentItem.name || !this.currentText.trim()) {
                this.currentIndex = ""
                this.currentItem = null
                return
            }
            // 正常修改
            saveClub({
                id: this.currentItem.id,
                name: this.currentText
            }).then(async res => {
                if (res.code === 200) {
                    await this.getClubData()
                    this.$notify({
                        title: "修改成功",
                        message: "专委会信息已修改",
                        type: "success",
                        duration: 1000,
                    });
                    this.currentIndex = ""
                    this.currentItem = null
                }
            })
        },
        // 获取专委会列表status: true是否重置刷新
        async getClubData(status) {
            await getClubList().then(async res => {
                if (res.code === 200) {
                    if (!status) {
                        this.currentClub = this.currentClub ? this.currentClub : res.data.list[0].id
                    } else {
                        this.currentClub = res.data.list[0].id
                        await this.getDetail()
                    }
                    this.listData = res.data.list

                }
            })
        },
        // 获取专委会详情
        async getDetail() {
            await getClubDetail({ id: this.currentClub }).then(async res => {
                if (res.code === 200) {
                    this.detailData = res.data
                }
            })
        },
        // 刷新数据 id:新增专委会id type:新增还是编辑
        async upadeData(id, type) {
            this.$notify({
                title: !type ? "创建成功！" : "修改成功",
                message: "专委会信息已修改",
                type: "success",
                duration: 1000,
            });
            /* 
             * 是否需要覆盖currentClub
             * 左侧编辑不需要覆盖
             * 新增需要覆盖
             * 右侧编辑不影响
            */
            if(id){
                this.currentClub = id
            }
            await this.getClubData()
            await this.getDetail()
            this.drawer = false
        },
        // 切换专委会
        async clubChange(item) {
            this.currentClub = item.id
            await this.getDetail()
        },
        // 删除专委会id:删除项id index:删除项索引
        delClub(id, index) {
            if(this.$refs["normalPopover"] && this.$refs["normalPopover"][index]){
                this.$refs["normalPopover"][index].doClose()
            }
            this.$confirm("确认删除专委会？", "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(res => {
                delClub({ id }).then(async res => {
                    if (res.code === 200) {
                        await this.getClubData(true)
                    }
                })
            })

        },
        // 编辑专委会item:当前项 index:当前项索引
        editClub(item,index) {
            // 编辑接口
            if(this.$refs["normalPopover"] && this.$refs["normalPopover"][index]){
                this.$refs["normalPopover"][index].doClose()
            }
            this.currentItem = item
            this.addClub('edit', item)
            // this.currentText = item.name
            // this.currentIndex = index
            // this.$nextTick(() => {
            //     this.$refs[`editInput${item.id}`][0].focus()
            // })
            
        },
        // 添加专委会 type:'edit' 是否是编辑 
        addClub(type, data) {
            this.drawer = true
            this.$nextTick(() => {
                if(type === 'edit'){
                    this.$refs["addClub"].show(data ? data : this.detailData, data ? 'left' : '')
                }else{
                    this.$refs["addClub"].show()
                }
            })
        },
        // 关闭专委会
        closeDrawer() {
            this.drawer = false
        },
        // tab 点击切换
        tabChange(item) {
            this.currentTab = item.value
        },
        // 排序更新
        submitSort() {
            saveSortClub({
                ids: this.listData.map(item => item.id)
            }).then(res => {
                if (res.code === 200) {
                    this.getClubData()
                }
            })
        }
    },
    computed: {
        // 拖拽配置
        dragOptions() {
            return {
                animation: 600,
                group: 'description',
            }
        },
    }
}
</script>
<style>
.normal-popover {
    min-width: unset !important;
    padding: 4px;
}

.popover-item {
    cursor: pointer;
    padding: 0 8px;
    line-height: 30px;
    border-radius: 4px;
    margin-bottom: 4px;

    &.red {
        color: #F53F3F;
    }

    &:hover {
        background: #F2F3F5;
    }
}

.popover-item:last-child {
    margin-bottom: 0;
}

.edit-button {
    width: 22px;
    height: 22px;
    position: absolute;
    right: 8px;
    top: 50%;
    border: none !important;
    padding: 0;
    border-radius: 4px;
    transform: translateY(-50%);
    background: transparent !important;
    display: none;
    .zn-icon {
        margin-right: 0;
    }

    &:hover {
        color: #1D2129 !important;
        background: #E5E6EB !important;
    }

    &:focus {
        color: #1D2129 !important;
        background: transparent !important;
    }
}
</style>
<style lang="scss" scoped>
.club-container {
    margin: -24px;
    height: calc(100vh - 48px - 44px) !important;
    overflow: hidden;
}

.club-left {
    width: 260px;
    height: 100%;
    overflow-y: auto;
    border-right: 1px solid #F2F3F5;

    .title {
        font-size: 16px;
        line-height: 24px;
    }

    .club-item-show {
        position: relative;
        font-size: 14px;
        margin-bottom: 4px;
        line-height: 40px;
        padding: 0 12px;
        border-radius: 4px;
        cursor: pointer;

        &:hover {
            background: $base-fill-3;
            .edit-button{
                display: block;
            }
        }

        &.active {
            color: $base-Brand1-6;
            background: $base-Brand1-1;
        }
    }

    .club-item-name {
        width: calc(100% - 20px);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .club-item-edit {
        margin-bottom: 4px;

        ::v-deep .el-input__inner {
            border: 1px solid $base-Brand1-6;
            padding: 0 11px;
            border-radius: 4px;
            height: 40px;
            font-size: 14px;
            line-height: 40px;
        }
    }

    .add-button {
        width: 100%;
        border: none;
        font-size: 14px;
        border-radius: 4px;
        background: $base-fill-3;
    }
}

.club-right {
    width: calc(100% - 260px);
    height: 100%;

    .content {
        height: calc(100% - 57px);
    }
}

.tabs {
    border-bottom: 1px solid #F2F3F5;
    padding: 0 18px;

    .tab {
        cursor: pointer;
        position: relative;
        line-height: 56px;
        font-size: 16px;

        &::before {
            display: none;
            content: "";
            width: 37px;
            height: 3px;
            position: absolute;
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            border-radius: 8px 8px 0 0;
            background: $base-Brand1-6;
        }

        &.active {
            font-weight: 500;
            color: $base-Brand1-6;
        }

        &.active::before {
            display: block;
        }
    }
}

.tab-info {
    max-height: 100%;
    overflow-y: auto;
}

.tab-list {
    height: 100%;
    overflow: hidden;
}
</style>