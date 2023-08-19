<template>
    <el-popover placement="bottom-start" :width="optionWidth" popper-class="custome-popover" :visible-arrow="false"
        ref="customePopover">
        <div class="custome-box">
            <el-input ref="customeInput" class="custome-input" size="medium" maxlength="10" v-model="search_text"
                placeholder="查找或创建选项" @input="customInputChange"></el-input>
            <div class="custome-wrap">
                <div class="custome-options" v-if="optionsList.length > 0">
                    <div class="custome-option" v-for="(item, index) in optionsList" @click="customeChange(item)">
                        <span>{{ item.label }}</span>
                        <el-button class="custome-del" type="text" size="medium" icon="el-icon-delete"
                            @click.stop="delCategoryData(item.value)"></el-button>
                    </div>
                </div>
                <div class="custome-save-block" v-if="createShow"></div>
                <div class="custome-save" v-if="createShow">
                    <div class="custome-save-btn flex-center" @click.stop="saveCategoryData">
                        <span class="label">创建选项</span>
                        <span>{{ search_text }}</span>
                    </div>
                </div>
            </div>
        </div>
        <el-select popper-class="custome-select" slot="reference" v-model="optionsValue" :placeholder="placeholderText">
            <el-option v-for="(item, index) in optionsList" :key="index" :label="item.label"
                :value="item.value"></el-option>
        </el-select>
    </el-popover>
</template>

<script>
export default {
    name: "ZnCustomeSelect",
    props: {
        /* 组件宽度 */
        optionWidth: {
            type: Number,
            default: () => 400
        },
        /* 选项列表 label-value 形式 */
        optionsList: {
            type: Array,
            default: () => ""
        },
        /* 选项选中值 */
        optionsValue: {
            type: [String, Number],
            default: () => ""
        },
        /* 动态文本 */
        placeholderText: {
            type: String,
            default: () => "请选择"
        },
    },
    data() {
        return {
            createShow: false,    // 是否显示创建按钮
            search_text: "",      // 搜索所属栏目
        }
    },
    created(){},
    methods: {
        // 搜索监听
        customInputChange(val) {
            let result = this.optionsList.findIndex(item => item.label === val.trim())
            this.createShow = result !== -1 ? false : true
            if (!val.trim()) {
                this.createShow = false
            }
        },
        // 选择选项
        customeChange(item) {
            this.$refs["customePopover"].doClose()
            this.$emit("optionChange", item.value)
        },
        // 删除所属分类
        delCategoryData(id) {
            this.$emit("optionDelete", id)
        },
        // 创建所属分类
        saveCategoryData() {
            this.$emit("optionCreate", this.search_text)
            this.search_text = ""
            this.createShow = false
        },
    },
    watch: {
        /* 监听数据变化 */
        optionsList(newVal, oldVal){
            if(newVal){
                this.optionsList = newVal
            }
        }
    }
}
</script>
<style>
.custome-select {
    opacity: 0;
    pointer-events: none;
}

.custome-popover {
    padding: 0;
}

.custome-input {
    .el-input__inner {
        border: none;
        padding: 7px 12px;
    }
}

.custome-wrap {
    position: relative;
}

.custome-options {
    max-height: 208px;
    overflow: auto;
    padding: 4px 4px 2px;
    border-top: 1px solid #E5E6EB;
}

.custome-option {
    cursor: pointer;
    line-height: 32px;
    padding: 0 8px;
    border-radius: 4px;
    position: relative;
    padding: 0 8px;
    margin-bottom: 2px;

    &:hover {
        background: #F2F3F5;

        .custome-del {
            display: block;
        }
    }
}

.custome-del {
    display: none;
    width: 22px;
    height: 22px;
    position: absolute;
    right: 8px;
    top: 50%;
    border: none;
    padding: 0;
    border-radius: 4px;
    transform: translateY(-50%);
    background: transparent !important;

    &:hover {
        color: #1D2129 !important;
        background: #E5E6EB !important;
    }
}

.custome-save {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    background: #fff;
    padding: 8px 4px 4px;
    border-top: 1px solid #E5E6EB;
    z-index: 10;
}

.custome-save-block {
    height: 45px;
}

.custome-save-btn {
    line-height: 32px;
    padding: 0 9px;
    border-radius: 4px;
    background: #F2F3F5;

    .label {
        margin-right: 8px;
        color: #86909C;
    }
}</style>