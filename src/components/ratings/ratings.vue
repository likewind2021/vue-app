<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{ seller.score }}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{ seller.rankRate }}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="titles">服务态度</span>
            <Star :size="36" :score="seller.serviceScore"></Star>
            <span class="score">{{ seller.serviceScore }}</span>
          </div>
          <div class="score-wrapper">
            <span class="titles">商品评分</span>
            <Star :size="36" :score="seller.foodScore"></Star>
            <span class="score">{{ seller.foodScore }}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{ seller.deliveryTime }}分钟</span>
          </div>
        </div>
      </div>
      <Split></Split>
      <Ratingselect
        :select-type="selectType"
        :only-content="onlyContent"
        :desc="desc"
        :ratings="ratings"
        @ratingtype-select="ratingtypeSelect"
        @content-toggle="contentToggle"
      ></Ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li
            v-for="(rating, index) in curRatings"
            :key="index"
            class="rating-item"
            v-show="needShow(rating.rateType, rating.text)"
          >
            <div class="avatar">
              <img class="img" width="28" height="28" :src="rating.avatar" />
            </div>
            <div class="contents">
              <h1 class="names">{{ rating.username }}</h1>
              <div class="star-wrappers">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">
                  {{ rating.deliveryTime }}
                </span>
              </div>
              <p class="texts">{{ rating.text }}</p>
              <div class="recommend"
                v-show="rating.recommend && rating.recommend.length"
              >
                <span class="icon-thumb_up"></span>
                <span
                  class="item"
                  v-for="(item, index) in rating.recommend"
                  :key="index"
                >
                  {{ item }}
                </span>
              </div>
              <div class="time">
                {{ rating.rateTime | formatDate }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Data from "../../data";
import Star from "../star/star.vue";
import Ratingselect from "../ratingselect/ratingselect.vue";
import Split from "../split/split.vue";
import { formatDate } from "../../common/js/date";
import BScroll from "better-scroll";

const ALL = 2;
export default {
  props: {
    seller: {
      type: Object,
    },
  },
  data() {
    return {
      ratings: [],
      curRatings: [],
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "满意",
        negative: "不满意",
      },
    };
  },
  created() {
    const { seller, goods, ratings } = Data;
    this.ratings = ratings;
    this.curRatings = JSON.parse(JSON.stringify(ratings));
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.ratings, {
        click: true,
      });
    });
  },
  methods:{
    contentToggle(onlyContent){
      console.log('in content.toggle: ', this.ratings);
      this.onlyContent = onlyContent;
      this.$nextTick(()=>{
        this.scroll.refresh();
      });
    },
    ratingtypeSelect(data, type){
      console.log('in ratingtypeSelect: ', data, type);
      this.curRatings = data;
      this.selectType = type;
      this.$nextTick(()=>{
        this.scroll.refresh();
      });
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
  },
  components: {
    Star,
    Ratingselect,
    Split,
  },
};
</script>

<style>
.ratings {
  position: absolute;
  top: 174px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
}
.ratings .overview {
  display: flex;
  padding: 18px 0;
}
.ratings .overview .overview-left {
  padding: 6px 0;
  flex: 0 0 137px;
  width: 137px;
  border-right: 1px solid rgba(7, 17, 27, 0.1);
  text-align: center;
  /* @media only screen and (max-width: 320px)
    flex: 0 0 120px
    width: 120px */
}
.ratings .overview .overview-left .score {
  margin-bottom: 6px;
  line-height: 28px;
  font-size: 24px;
  color: rgb(255, 153, 0);
}
.ratings .overview .overview-left .title {
  margin-bottom: 8px;
  line-height: 12px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.ratings .overview .overview-left .rank {
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.ratings .overview .overview-right {
  flex: 1;
  padding: 6px 0 6px 24px;
  /* @media only screen and (max-width: 320px)
    padding-left: 6px */
}
.ratings .overview .overview-right .score-wrapper {
  margin-bottom: 8px;
  font-size: 0;
}
.ratings .overview .overview-right .score-wrapper .titles {
  display: inline-block;
  vertical-align: top;
  line-height: 18px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.ratings .overview .overview-right .score-wrapper .star {
  display: inline-block;
  margin: 0 12px;
  vertical-align: top;
}
.ratings .overview .overview-right .score-wrapper .score {
  display: inline-block;
  vertical-align: top;
  line-height: 18px;
  font-size: 12px;
  color: rgb(255, 153, 0);
}
.ratings .overview .overview-right .delivery-wrapper {
  font-size: 0;
}
.ratings .overview .overview-right .delivery-wrapper .title {
  line-height: 18px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.ratings .overview .overview-right .delivery-wrapper .delivery {
  margin-left: 12px;
  font-size: 12px;
  color: rgb(147, 153, 159);
}
.ratings .rating-wrapper{
  padding: 0 18px;
}
.ratings .rating-wrapper .rating-item{
  display: flex;
  padding: 18px 0;
  border-bottom: 1px solid rgba(7,17,27,0.1);
}
.ratings .rating-wrapper .rating-item .avatar{
  flex: 0 0 28px;
  width: 28px;
  margin-right: 12px
}
.ratings .rating-wrapper .rating-item .avatar .img{
  border-radius: 50%;
}
.ratings .rating-wrapper .rating-item .contents{
  position: relative;
  flex: 1;
}
.ratings .rating-wrapper .rating-item .contents .names{
  margin-bottom: 4px;
  line-height: 12px;
  font-size: 10px;
  color: rgb(7, 17, 27);
}
.ratings .rating-wrapper .rating-item .contents .star-wrappers{
  margin-bottom: 6px;
}
.ratings .rating-wrapper .rating-item .contents .star-wrappers .star{
   display: inline-block;
   vertical-align: top;
   margin-right: 6px;
}
.ratings .rating-wrapper .rating-item .contents .star-wrappers .delivery{
  display: inline-block;
  vertical-align: top;
  line-height: 12px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.ratings .rating-wrapper .rating-item .contents .texts{
  margin-bottom: 8px;
  line-height: 18px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.ratings .rating-wrapper .rating-item .contents .recommend{
  line-height: 16px;
  font-size: 0;
}
.ratings .rating-wrapper .rating-item .contents .recommend .icon-thumb_up{
  display: inline-block;
  vertical-align: middle;
  padding-bottom: 2px;
  margin: 0 8px 4px 0;
  font-size: 12px;
  color: rgb(0, 160, 220);
  width: 12px;
  height: 12px;
  background-image: url("./up.jpg");
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
.ratings .rating-wrapper .rating-item .contents .recommend .item{
  display: inline-block;
  padding: 0 6px;
  margin: 0 8px 4px 0; 
  border: 1px solid rgba(7,17,27,0.1);
  border-radius: 1px;
  font-size: 9px;
  color: rgb(147, 153, 159);
  background: #fff;
}
.ratings .rating-wrapper .rating-item .contents .time{
  position: absolute;
  top: 0;
  right: 0;
  line-height: 12px;
  font-size: 10px;
  color: rgb(147, 153, 159) ;
}
</style>