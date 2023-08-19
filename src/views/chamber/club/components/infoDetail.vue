<!-- 专委会信息 -->
<template>
    <div class="detail" v-if="detailData">
        <div class="detail-top flex-between pb-24">
            <div class="flex-center">
                <div class="avatar flex-column">
                    {{ detailData.name[0] }}
                </div>
                <span class="name pl-16">{{ detailData.name }}</span>    
            </div>
            <el-button class="edit-btn" type="primary" @click="editInfo" v-permissions="{ permission: ['chamber:club:edit'] }">编辑</el-button>
        </div>
        <div class="detail-bottom">
            <div class="detail-title mt-20 mb-12">专委会描述</div>
            <div class="detail-descript">
                <div v-html="detailData.remark"></div>
            </div>
        </div>
   </div>
</template>

<script>
    export default {
        name: "InfoDetail",
        props: {
            /* 数据信息 */
            detailData: {
                type: Object,
                default: () => ""
            }
        },  
        data(){
            return {

            }
        },
        methods: {
            // 编辑
            editInfo(){
                this.$emit("editInfo")
            }
        }
    }
</script>

<style lang="scss" scoped>
.detail-top{
    border-bottom: 1px solid #F2F3F5;
    .avatar{
        width: 56px;
        height: 56px;
        border-radius: 8px;
        overflow: hidden;
        font-size: 20px;
        color: #FFFFFF;
        border: 1px solid #E5E6EB;
        background: $base-Brand1-6;
    }
    .name{
        font-size: 20px;
    }
    .edit-btn{
        height: 32px;
        line-height: 32px;
        padding: 0 16px;
        border-radius: 4px;
        font-size: 14px;
        border: none;
    }
}
.detail-bottom{
    line-height: 22px;
    .detail-title{
        color: #86909C;
    }
    ::v-deep .detail-descript{
        line-height: 22px;
        img{
            max-width: 340px;
        }
    }
}
</style>