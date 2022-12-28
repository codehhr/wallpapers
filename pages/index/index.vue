<template>
  <view class="page-index">
    <!-- notice start -->
    <u-notice-bar :text="announcement" mode="closable"></u-notice-bar>
    <!-- notice end -->

    <!-- search&category start -->
    <u-sticky bgColor="#ffffff" class="search-category">
      <!-- search start -->
      <u-search
        v-model="keywords"
        placeholder="搜索关键词"
        :show-action="true"
        actionText="搜索"
        :animation="true"
        placeholderColor="#667c99"
        searchIconColor="#667c99"
        color="#667c99"
        bgColor="#fafafa"
        inputAlign="center"
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
import { onSearch, getCategory, getImgListByCategoryId } from "./api";

export default {
  data() {
    return {
      announcement: "应 该 没 有 Bug 了",
      keywords: "",
      categoryList: [],
      imgList: [],
      pageNum: 1,
      pageSize: 10,
      scrollTop: 0,
      currentCategoryId: null,
      option: 0, // Last operation; 0: category, 1: search
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
    // reset pageNum
    this.resetPageNum();
    // reset imgList
    this.resetImgList();
    // Determine the last operation; 0: category, 1: search
    if (this.option == 0) {
      this.getImgListByCategoryId(this.currentCategoryId);
    } else if (this.option == 1) {
      this.onSearch();
    }
  },

  onReachBottom() {
    // pageNum ++
    this.pageNum++;
    // Determine the last operation; 0: category, 1: search
    if (this.option == 0) {
      this.getImgListByCategoryId(this.currentCategoryId);
    } else if (this.option == 1) {
      this.onSearch();
    }
  },

  methods: {
    // reset pageNum
    resetPageNum() {
      this.pageNum = 1;
    },

    // reset imgList
    resetImgList() {
      this.imgList = [];
    },

    // handle Search
    handleSearch() {
      this.resetPageNum();
      this.resetImgList();
      // set last operation; 0: category, 1: search
      this.option = 1;
      this.onSearch();
    },

    // search
    async onSearch() {
      await onSearch({
        keywords: this.keywords,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((res) => {
          uni.stopPullDownRefresh();
          if (res.errno == 0) {
            this.imgList =
              this.pageNum > 1
                ? this.imgList.concat(res.data.list)
                : res.data.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // Get category
    async getCategory() {
      await getCategory()
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
            // set currentCategoryId
            this.currentCategoryId = this.categoryList[0].categoryId;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // Gets the wallpaper by categoryId
    async getImgListByCategoryId(categoryId) {
      await getImgListByCategoryId({
        categoryId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      })
        .then((res) => {
          uni.stopPullDownRefresh();
          if (res.errno == 0) {
            this.imgList =
              this.pageNum > 1
                ? this.imgList.concat(res.data.list)
                : res.data.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // click category
    clickCategory(item) {
      this.resetPageNum();
      this.resetImgList();
      this.getImgListByCategoryId(item.categoryId);
      // set currentCategoryId
      this.currentCategoryId = item.categoryId;
      // set last operation; 0: category, 1: search
      this.option = 0;
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
