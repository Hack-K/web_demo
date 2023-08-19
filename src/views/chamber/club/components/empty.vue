<!-- 暂无缺省页 -->
<template>
    <div class="empty flex-column">
        <div class="empty-img">
            <img src="@/assets/images/chamber_images/empty-member.png">
        </div>
        <div class="empty-text mt-16 mb-16">
            <p>暂无搜索结果</p>
            <p>请先添加会员</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "Empty"
}
</script>

<style lang="scss" scoped>
.empty{
    //calc(100% - 36px - 48px)
  height: 100%;
  .empty-img{
    width: 100px;
  }
  .empty-text{
    font-size: 14px;
    line-height: 22px;
    color: $base-text-3;
  }
}
</style>