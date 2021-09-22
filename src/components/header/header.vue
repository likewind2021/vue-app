<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img class="avatar-img" width="64" height="64" :src="seller.avatar" />
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{ seller.name }}</span>
        </div>
        <div class="description">
          {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{ seller.supports[0].description }}</span>
        </div>
      </div>
      <div v-if="seller.supports" class="support-count" @click="showDetail">
        <span class="count">{{ seller.supports.length }}个</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span
      ><span class="bulletin-text">{{ seller.bulletin }}</span>
      <i class="bulletin-icon-keyboard_arrow_right"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%" />
    </div>
    <transition name="fade">
      <div v-show="detailShow" class="detail">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <!-- <p>{{ seller.bulletin }}</p> -->
          <h1 class="main-name">{{ seller.name }}</h1>
          <div class="star-wrapper">
            <star :size="48" :score="seller.score"></star>
          </div>
          <div class="main-title">
            <div class="title-line"></div>
            <div class="title-text">优惠信息</div>
            <div class="title-line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="supports-item" v-for="(item,index) in seller.supports" 
            :key=index :class="item">
              <span class="item-icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="item-text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="main-title">
            <div class="title-line"></div>
            <div class="title-text">商家公告</div>
            <div class="title-line"></div>
          </div>
          <div class="seller-bulletin">
            <p class="seller-bulletin-content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <img class="icon-close"/>
      </div>
    </div>
    </transition>    
  </div>
</template>
<script>
import Star from '../star/star.vue'

export default {
  props: {
    seller: {
      type: Object,
    }
  },
  data() {
    return {
      detailShow: false,
    };
  },
  methods: {
    showDetail() {
      this.detailShow = true;
    },
    hideDetail() {
        this.detailShow = false;
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
    // console.log(this.seller.supports)
  },
  components:{
    Star
  }
};
</script>

<style >
/*  @import "../../common/stylus/mixin.styl" */

.header {
  position: relative;
  overflow: hidden;
  color: #fff;
  background: rgba(7, 17, 27, 0.5);
  /* background: #999; */
  line-height: 1;
  font-weight: 200;
  font-family: "PingFang SC", "STHeitiSC-Light", "Helvetica-Light", arial,
    sans-serif;
}
.content-wrapper {
  position: relative;
  padding: 24px 12px 18px 24px;
  font-size: 0px;
}
.avatar {
  display: inline-block;
  vertical-align: top;
}
.avatar-img {
  border-radius: 2px;
}
.content {
  display: inline-block;
  /* font-size: 14px; */
  margin-left: 16px;
}
.title {
  margin: 2px 0px 8px 0px;
}
.brand {
  display: inline-block;
  vertical-align: top;
  width: 30px;
  height: 18px;
  background-image: url("./brand@2x.png");
  /* bg-image('brand'); */
  background-size: 30px 18px;
  background-repeat: no-repeat;
}
.name {
  margin-left: 6px;
  font-size: 16px;
  line-height: 18px;
  font-weight: bold;
}
.description {
  margin-bottom: 10px;
  line-height: 12px;
  font-size: 12px;
}
.icon {
  display: inline-block;
  vertical-align: top;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
.guarantee {
  background-image: url("./guarantee_1@2x.png");
}
.invoice {
  background-image: url("./invoice_1@2x.png");
}
.special {
  background-image: url("./special_1@2x.png");
}
.discount {
  background-image: url("./discount_1@2x.png");
}
.decrease {
  background-image: url("./decrease_1@2x.png");
}
.text {
  line-height: 12px;
  font-size: 10px;
}
.support-count {
  position: absolute;
  right: 12px;
  bottom: 14px;
  padding: 0px 8px;
  height: 24px;
  line-height: 24px;
  border-radius: 14px;
  background-color: rgba(0, 0, 0, 0.2);
  text-align: center;
}
.count {
  font-size: 10px;
}
.icon-keyboard_arrow_right {
  font-size: 10px;
  line-height: 24px;
  margin-left: 2px;
}
.bulletin-wrapper {
  position: relative;
  height: 28px;
  line-height: 28px;
  padding: 0px 22px 0px 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgba(7, 17, 27, 0.2);
  /* font-size: 0px; */
}
.bulletin-title {
  display: inline-block;
  vertical-align: top;
  margin-top: 8px;
  width: 22px;
  height: 12px;
  background-image: url("./bulletin@2x.png");
  background-size: 22px 12px;
  background-repeat: no-repeat;
}
.bulletin-text {
  vertical-align: top;
  margin: 0px 4px;
  font-size: 10px;
}
.bulletin-icon-keyboard_arrow_right {
  position: absolute;
  font-size: 10px;
  right: 12px;
  top: 8px;
}
.background {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: -1;
  filter: blur(10px);
}
.detail {
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 100;
  width: 100%;
  height: 100%;
  overflow: auto;
  transition: all 1s;
  background: rgba(7, 17, 27, 0.8);
  /* backdrop-filter: blur(10px); */
}
.detail.fade-transition{
  opacity: 1;
  
}
.detail.fade-enter,.detail.fade-leave{
  opacity: 0;
  background: rgba(7, 17, 27, 0);
}
.clearfix {
  display: inline-block;
}
.clearfix::after {
  display: block;
  content: ".";
  height: 0px;
  line-height: 0px;
  clear: both;
  visibility: hidden;
}
.detail-wrapper {
  min-height: 100%;
  width: 100%;
}
.detail-main {
  margin-top: 64px;
  padding-bottom: 64px;
}
.main-name {
  line-height: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 700px;
}
.detail-close {
  position: relative;
  width: 32px;
  height: 32px;
  margin: -64px auto 0px auto;
  clear: both;
  font-size: 32px;
}
.icon-close{
  width: 32px;
  height: 32px;
  background-image: url("./close.png");
  background-size: 32px 32px;
  background-repeat: no-repeat;
}
.star-wrapper{
  margin-top: 16px;
  padding: 2px 0px;
  text-align: center;
}
.main-title{
  display: flex;
  width: 80%;
  margin: 28px auto 24px auto;
  text-align: center;
}
.title-line{
  flex: 1;
  position: relative;
  top: -6px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}
.title-text{
  padding: 0 12px;
  font-weight: 700;
  font-size: 14px;
}
.supports{
  width: 80%;
  margin: 0px auto;
}
.supports-item{
  padding: 0px 12px;
  margin-bottom: 12px;
  font-size: 0px;
}
.supports-item:last-child{
  margin-bottom: 0px;
}
.item-icon{
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: top;
  margin-right: 6px;
  background-size: 16px 16px;
  background-repeat: no-repeat;
}
.item-icon.guarantee {
  background-image: url("./guarantee_2@2x.png");
}
.item-icon.invoice {
  background-image: url("./invoice_2@2x.png");
}
.item-icon.special {
  background-image: url("./special_2@2x.png");
}
.item-icon.discount {
  background-image: url("./discount_2@2x.png");
}
.item-icon.decrease {
  background-image: url("./decrease_2@2x.png");
}
.item-text{
  line-height: 16px;
  font-size: 12px;
}
.seller-bulletin{
  width: 80%;
  margin: 0px auto;
}
.seller-bulletin-content{
  padding: 0px 12px;
  line-height: 24px;
  font-size: 12px;
}
</style>