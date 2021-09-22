<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" class="img" />
          <div class="back" @click="hide">
            <img class="icon-arrow_lift" />
          </div>
        </div>
        <div class="contents">
          <h1 class="contents-title">{{ food.name }}</h1>
          <div class="contents-detail">
            <span class="detail-sell-count">月售{{ food.sellCount }}份</span>
            <span class="detail-rating">好评率{{ food.rating }}%</span>
          </div>
          <div class="contents-price">
            <span class="price-now">￥{{ food.price }}</span>
            <span class="price-old" v-show="food.oldPrice"
              >￥{{ food.oldPrice }}</span
            >
          </div>
          <div class="cartcontrols-wrapper">
            <Cartcontrol :food="food"></Cartcontrol>
          </div>
          <transition name="fade">
            <div
              class="buy"
              v-show="!food.count || food.count === 0"
              @click.stop.prevent="addFirst"
            >
              加入购物车
            </div>
          </transition>
        </div>
        <Split v-show="food.info"></Split>
        <div class="info" v-show="food.info">
          <h1 class="info-title">商品信息</h1>
          <p class="info-text">{{ food.info }}</p>
        </div>
        <Split></Split>
        <div class="reviews">
          <div class="reviews-title">商品评价</div>
          <Ratingselect
            :select-type="selectType"
            :only-content="onlyContent"
            :desc="desc"
            :ratings="food.ratings"
            @ratingtype-select="ratingtypeSelect"
            @content-toggle="contentToggle"
          ></Ratingselect>
          <div class="reviews-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li
                v-show="needShow(rating.rateType, rating.text)"
                v-for="(rating, index) in food.ratings"
                :key="index"
                class="reviews-item"
              >
                <div class="user">
                  <div class="user-name">{{ rating.username }}</div>
                  <img
                    :src="rating.avatar"
                    class="user-avatar"
                    width="12"
                    height="12"
                  />
                </div>
                <div class="time">
                  {{ rating.rateTime | formatDate }}
                </div>
                <p class="text">
                  <img
                    :class="{
                      'icon-thumb_up': rating.rateType === 0,
                      'icon-thumb_down': rating.rateType === 1,
                    }"
                  />{{ rating.text }}
                </p>
              </li>
            </ul>
            <div
              class="no-reviews"
              v-show="!food.ratings || !food.ratings.length"
            >
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from "better-scroll";
import Cartcontrol from "../cartcontrol/cartcontrol.vue";
import Vue from "vue";
import { formatDate } from "../../common/js/date";
import Split from "../split/split.vue";
import Ratingselect from "../ratingselect/ratingselect.vue";

// const POSITIVE = 0;
// const NEGATIVE = 1;
const ALL = 2;
export default {
  props: {
    food: {
      type: Object,
    },
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "推荐",
        negative: "吐槽",
      },
      scroll: null,
    };
  },
  methods: {
    contentToggle(onlyContent) {
      // console.log("in content.toggle: ", onlyContent);
      this.onlyContent = onlyContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    ratingtypeSelect(data, type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
    show() {
      this.showFlag = true;
      this.selectType = ALL;
      this.onlyContent = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true,
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (!event._constructed) {
        return;
      }
      this.$emit("cart.add", event.target);
      Vue.set(this.food, "count", 1);
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
    },
  },
  events: {
    "ratingtype.select"(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },
  },
  created() {
    // console.log("ratings: ", this.food.ratings);
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
  },
  components: {
    Cartcontrol,
    Split,
    Ratingselect,
  },
};
</script>

<style>
.food {
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 48px;
  z-index: 30;
  width: 100%;
  background: #fff;
  transition: all 0.2s linear;
}
.food.move-enter,
.food.move-leave-to {
  transform: translateX(100%);
}
.food .image-header {
  position: relative;
  width: 100%;
  height: 0;
  padding-top: 100%;
}
.food .image-header .img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
.food .image-header .back {
  position: absolute;
  top: 10px;
  left: 0;
}
.food .image-header .back .icon-arrow_lift {
  display: block;
  padding: 10px;
  font-size: 20px;
  width: 24px;
  height: 24px;
  background-position: center;
  background-image: url("./back.png");
  background-size: 24px 24px;
  background-repeat: no-repeat;
  color: #fff;
}
.food .contents {
  position: relative;
  padding: 18px;
}
.food .contents .contents-title {
  line-height: 14px;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(7, 17, 27);
}
.food .contents .contents-detail {
  line-height: 10px;
  margin-bottom: 18px;
  font-size: 0px;
  height: 10px;
}
.food .contents .contents-detail .detail-sell-count {
  font-size: 10px;
  color: rgb(147, 153, 159);
  margin-right: 12px;
}
.food .contents .contents-detail .detail-rating {
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food .contents .contents-price {
  font-weight: 700;
  line-height: 24px;
}
.food .contents .contents-price .price-now {
  margin-right: 8px;
  font-size: 14px;
  color: rgb(240, 20, 20);
}
.food .contents .contents-price .price-old {
  text-decoration: line-through;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food .cartcontrols-wrapper {
  position: absolute;
  right: 12px;
  bottom: 12px;
}
.food .buy {
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 10;
  height: 24px;
  line-height: 24px;
  padding: 0 12px;
  box-sizing: border-box;
  border-radius: 12px;
  font-size: 10px;
  color: #fff;
  background: rgb(0, 160, 220);
  /* transition: all .2s; */
}
/* .food .buy .buy.fade-enter,.food .buy .buy.fade-leave-to{
  opacity: 0;
} */
.food .info {
  padding: 18px;
}
.food .info .info-title {
  line-height: 14px;
  margin-bottom: 6px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.food .info .info-text {
  padding: 0 8px;
  line-height: 24px;
  font-size: 12px;
  color: rgb(77, 85, 93);
}
.food .reviews {
  padding-top: 18px;
}
.food .reviews .reviews-title {
  line-height: 14px;
  margin-left: 18px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.food .reviews .reviews-wrapper {
  padding: 0 18px;
}
.food .reviews .reviews-wrapper .reviews-item {
  position: relative;
  padding: 16px 0;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.food .reviews .reviews-wrapper .reviews-item .user {
  position: absolute;
  right: 0;
  top: 16px;
  line-height: 12px;
  font-size: 0;
}
.food .reviews .reviews-wrapper .reviews-item .user .user-name {
  display: inline-block;
  vertical-align: top;
  margin-right: 6px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food .reviews .reviews-wrapper .reviews-item .user .user-avatar {
  display: inline-block;
  vertical-align: top;
  border-radius: 50%;
}
.food .reviews .reviews-wrapper .reviews-item .time {
  margin-bottom: 6px;
  line-height: 12px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food .reviews .reviews-wrapper .reviews-item .text {
  line-height: 16px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}
.food .reviews .reviews-wrapper .reviews-item .text .icon-thumb_up {
  vertical-align: middle;
  line-height: 16px;
  margin-right: 4px;
  font-size: 12px;
  color: rgb(0, 160, 220);
  width: 12px;
  height: 12px;
  background-image: url("./up.jpg");
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
.food .reviews .reviews-wrapper .reviews-item .text .icon-thumb_down {
  vertical-align: middle;
  line-height: 16px;
  font-size: 12px;
  color: rgb(147, 153, 159);
  width: 12px;
  height: 12px;
  background-image: url("./down.png");
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
.food .reviews .reviews-wrapper .no-reviews {
  padding: 16px 0;
  font-size: 12px;
  color: rgb(147, 153, 159);
}
</style>