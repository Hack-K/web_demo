<template>
  <el-drawer
    :title="'预览详情'"
    :visible.sync="drawer"
    :direction="direction"
    custom-class="preview-phone"
    :append-to-body="false"
    :modal-append-to-body="false"
    :close-on-press-escape="false"
    :wrapperClosable="false"
    :before-close="cancel"
    :size="'100%'"
  >
    <div class="preview-phone-content">
      <img
        class="head"
        src="https://ynother.yinuocloud.com/haH4SjHl7V2YoMgAUlm5psojZshEpj.png"
      />
      <div class="title">
        {{ form.title }}
      </div>
      <div class="content" v-html="form.content"></div>
      <img
        class="end"
        src="https://ynother.yinuocloud.com/g53dmDPrYeWSok8smZK6S047iTJeL0.png"
        alt=""
      />
    </div>
  </el-drawer>
</template>

<script>
export default {
  props: {
    form: {
      type: Object,
      default: () => {},
    },
    drawer: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {},
  data() {
    return {
      direction: 'rtl',
      content:
        '<p>值此中国文物艺术品拍卖30年之际，中国拍卖行业会联合北京在艺科技有限责任公司特别推出“见证中国文物艺术品拍卖30年·系列人物访谈”活动，邀请30年发展过程中相关领导、专家、同仁、藏家等，共同回顾我国文物艺术品拍卖的发展历程、发展成就，展望未来发展前景。日前，佳士得中国区主席杨媛草受邀进行专访，畅谈佳士得在中国多年来的创新步伐，分享佳士得如何透过艺术来促进东西方文化的交流。</p><p><br></p><p><img src="https://ynother.yinuocloud.com/KlQX1cnQYHihMLpQNlIluv9Ts1h1ka.png" alt="" data-href="" style=""/></p>',
    }
  },
  async created() {},

  methods: {
    cancel() {
      this.$emit('closePreviewPhone', false)
    },
  },
}
</script>
<style lang="scss" scoped>
.preview-phone {
}
.preview-phone-content {
  margin: 0px auto;
  width: 375px;
  height: 667px;
  border-radius: 24px;
  opacity: 1;
  background: #ffffff;
  border: 8px solid #b3cef4;
  box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}
.head {
  width: 100%;
  height: 76px;
}
.title {
  margin-top: 16px;
  font-size: 20px;
  font-weight: bold;
  padding: 0 32px;
  box-sizing: border-box;
  line-height: 27px;
}
.content {
  overflow-y: auto;
  line-height: 28px;
  padding: 0 32px;
  height: 420px;
  padding-bottom: 10px;
  box-sizing: border-box;
}
.end {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 2;
}
</style>