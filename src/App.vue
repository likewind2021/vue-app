<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link class="tab-item-content" to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link class="tab-item-content" to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link class="tab-item-content" to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
import header from "./components/header/header.vue";
import Data from "./data";
import { urlParse } from "./common/js/util";

// const ERR_OK = 0;

export default {
  data() {
    return {
      seller: {
        id: (() => {
          let queryParm = urlParse();
          // console.log("queryParm: ", queryParm);
          return queryParm.id;
        })(),
      },
    };
  },
  // created() {
  //   this.$http.get("/api/seller").then((response) => {
  //     response = response.body;
  //     if (response.errno === ERR_OK) {
  //       this.seller = response.data;
  //       console.log(this.seller);
  //     }
  //   });
  // },
  created() {
    const { seller, goods, ratings } = Data;
    // console.log(seller);
    this.seller = seller;
  },
  components: {
    "v-header": header,
  },
};
</script>

<style >
/* @import "./common/stylus/mixin.styl" */

.tab {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  /* border-1px(rgba(7,17,27,0.1)); */
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
/* .tab::after{
  display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid $color;
    content: ' ';
} */
.tab-item {
  flex: 1;
  text-align: center;
}
.tab-item:after {
  display: inline-block;
}
.tab-item-content {
  display: block;
  text-decoration: none;
  font-size: 14px;
  color: rgb(77, 85, 93);
}
.tab-item-content.active {
  color: rgb(240, 20, 20);
}
</style>
