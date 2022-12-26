<template>
  <view class="page-index">
    <!-- search&category start -->
    <u-sticky bgColor="#ffffff" class="search-category">
      <!-- search start -->
      <u-search
        v-model="keywords"
        placeholder="搜 索 关 键 词"
        :show-action="true"
        actionText="搜索"
        :animation="true"
        placeholderColor="#667c99"
        searchIconColor="#667c99"
        color="#667c99"
        bgColor="#fafafa"
        @search="handleSearch"
        @clickIcon="handleSearch"
        @custom="handleSearch"
      ></u-search>
      <!-- search end -->

      <!-- category start -->
      <u-tabs :list="categoryList" @click="clickCategory"></u-tabs>
      <!-- category end -->
    </u-sticky>
    <!-- search&category end -->

    <!-- img list start -->
    <view class="img-list">
      <view class="img-item" v-for="item in imgList" :key="item.categoryId">
        <u--image
          :src="item.url"
          :lazy-load="true"
          width="100%"
          mode="widthFix"
          @click="previewImg(item.url)"
        >
          <template v-slot:loading>
            <u-loading-icon></u-loading-icon>
          </template>
        </u--image>
      </view>
    </view>
    <!-- img list end -->

    <!-- back to top start -->
    <u-back-top :scroll-top="scrollTop"></u-back-top>
    <!-- back to top end -->
  </view>
</template>

<script>
import { httpRequest } from "../../api/http";

export default {
  data() {
    return {
      keywords: "",
      categoryList: [],
      imgList: [],
      pageNum: 1,
      pageSize: 10,
      scrollTop: 0,
    };
  },
  onLoad() {},
  onReady() {
    this.getCategory();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
  },
  onReachBottom() {},
  methods: {
    // search
    async handleSearch() {
      await httpRequest({
        url: "/search",
        data: {
          content: this.keywords,
          pageno: this.pageNum,
          count: this.pageSize,
        },
      })
        .then((res) => {
          if (res.errno == 0) {
            this.imgList = res.data.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // Get category
    async getCategory() {
      await httpRequest({ url: "/getCategory" })
        .then((res) => {
          if (res.errno == 0) {
            res.data.forEach((category) => {
              this.categoryList.push({
                name: category.show_name,
                categoryId: category.old_id,
              });
            });
            // Gets the wallpaper of the first category
            this.getImgListByCategoryId(this.categoryList[0].categoryId);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // Gets the wallpaper by categoryId
    async getImgListByCategoryId(categoryId) {
      await httpRequest({
        url: "/GetListByCategory",
        data: {
          cids: categoryId,
          pageno: this.pageNum,
          count: this.pageSize,
        },
      })
        .then((res) => {
          if (res.errno == 0) {
            this.imgList = res.data.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // click category
    clickCategory(item) {
      this.getImgListByCategoryId(item.categoryId);
    },

    // preview img
    previewImg(currentUrl) {
      let previewImgList = [];
      this.imgList.forEach((img) => {
        previewImgList.push(img.url);
      });
      uni.previewImage({
        current: currentUrl,
        urls: previewImgList,
        loop: true,
      });
    },
  },
};
</script>

<style>
.search-category {
  padding: 8px;
}
.img-item {
  margin: 8px 4px;
}
</style>
