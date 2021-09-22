<template>
  <div>
    <div class="shopcart">
      <div class="shopcart-content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{ highlight: totalCount > 0 }">
              <img
                class="icon_shoppping_cart"
                :class="{ highlight: totalCount > 0 }"
              />
            </div>
            <div class="num" v-show="totalCount > 0">{{ totalCount }}</div>
          </div>
          <div class="price" :class="{ highlight: totalPrice > 0 }">
            ￥{{ totalPrice }}
          </div>
          <div class="desc">另需配送费￥{{ deliveryPrice }}元</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">{{ payDesc }}</div>
        </div>
      </div>
      <div class="ball-container">
        <div
          v-for="(ball, index) in balls"
          :key="index"
          v-show="ball.show"
          transition="drop"
          class="ball"
        >
          <div class="inner inner-hook"></div>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="header-title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li
                class="list-food"
                v-for="(food, index) in selectFoods"
                :key="index"
              >
                <span class="list-name">{{ food.name }}</span>
                <div class="list-price">
                  <span>￥{{ food.price * food.count }}</span>
                </div>
                <div class="cartcontrol-wrappers">
                  <Cartcontrol :food="food"></Cartcontrol>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import Cartcontrol from "../cartcontrol/cartcontrol.vue";

export default {
  props: {
    selectFoods: {
      type: Array,
      default() {
        // return []
        return [
          {
            price: 10,
            count: 1,
          },
        ];
      },
    },
    deliveryPrice: {
      type: Number,
      default: 0,
    },
    minPrice: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      balls: [
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      dropBalls: [],
      fold: true,
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.selectFoods.forEach((food) => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      let count = 0;
      this.selectFoods.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      } else {
        return "去结算";
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    },
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, {
              click: true,
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    },
  },
  // watch: {
  //   listShow(newVal, oldVal) {
  //     console.log("in watch listShow: ", newVal);
  //   },
  // },
  methods: {
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true; //触发动画滚动
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    toggleList() {
      // console.log("in click", this.totalCount);
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    hideList() {
      this.fold = true;
    },
    empty() {
      // console.log(this.selectFoods);
      this.selectFoods.forEach((food) => {
        food.count = 0;
      });
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`支付${this.totalPrice}元`);
    },
  },
  transitions: {
    drop: {
      beforeEnter(el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 32;
            let y = -(window.innerHeight - rect.totp - 22);
            el.style.display = "";
            el.style.webkitTransform = `translate3d(0,${y}px,0)`;
            el.style.transform = `translate3d(0,${y}px,0)`;
            let inner = window.document.getElementsByClassName("inner-hook")[0];
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
            inner.style.transform = `translate3d(0,${y}px,0)`;
          }
        }
      },
      enter(el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        this.$nextTick(() => {
          el.style.webkitTransform = "translate3d(0,0,0)";
          el.style.transform = "translate3d(0,0,0)";
          let inner = el.getElementsByClassName("inner-hook")[0];
          inner.style.webkitTransform = "translate3d(0,0,0)";
          inner.style.transform = "translate3d(0,0,0)";
        });
      },
      afterEnter(el) {
        let ball = this.dropBalls.shift();
        if (ball) {
          ball.show = false;
          el.style.display = "none";
        }
      },
    },
  },
  components: {
    Cartcontrol,
  },
};
</script>

<style>
.shopcart {
  position: fixed;
  left: 0px;
  bottom: 0px;
  z-index: 50;
  width: 100%;
  height: 48px;
}
.shopcart-content {
  display: flex;
  background: #141d27;
  font-size: 0px;
  color: rgba(255, 255, 255, 0.4);
}
.content-left {
  flex: 1;
}
.logo-wrapper {
  display: inline-block;
  vertical-align: top;
  position: relative;
  top: -10px;
  margin: 0px 12px;
  padding: 6px;
  width: 56px;
  height: 56px;
  box-sizing: border-box;
  border-radius: 50%;
  background: #141d27;
}
.num {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 24px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 16px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: rgb(240, 20, 20);
  box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.4);
}
.logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  text-align: center;
  background: #2b343c;
}
.logo.highlight {
  background: rgb(0, 160, 220);
}
.icon_shoppping_cart {
  position: absolute;
  bottom: 15px;
  left: 17px;
  line-height: 44px;
  font-size: 24px;
  width: 24px;
  height: 24px;
  background-image: url("./logo.png");
  background-size: 24px 24px;
  background-repeat: no-repeat;
  color: #2b343c;
}
.icon_shoppping_cart.highlight {
  color: #fff;
}
.price {
  display: inline-block;
  vertical-align: top;
  margin-top: 12px;
  line-height: 24px;
  padding-right: 12px;
  box-sizing: border-box;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 16px;
  font-weight: 700;
}
.price.highlight {
  color: #fff;
}
.desc {
  display: inline-block;
  vertical-align: top;
  margin: 12px 0px 0px 12px;
  line-height: 24px;
  font-size: 10px;
}
.content-right {
  flex: 0 0 105px;
  width: 105px;
}
.pay {
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
}
.pay.not-enough {
  background: #2b333b;
}
.pay.enough {
  background: #00b43c;
  color: #fff;
}
.ball {
  position: fixed;
  left: 32px;
  bottom: 22px;
  z-index: 200;
}
.ball.drop-transition {
  transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
}
.ball.drop-transition .inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(0, 160, 220);
  transition: all 0.4s linear;
}
.shopcart-list {
  position: absolute;
  left: 0;
  bottom: 48px;
  z-index: -1;
  width: 100%;
  transition: all .5s linear;
}
.shopcart-list.fold-enter,
.shopcart-list.fold-leave-to {
  transform:  translateY(100%);
}
.list-header {
  height: 40px;
  line-height: 40px;
  padding: 0px 18px;
  background: #f3f5f7;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.header-title {
  float: left;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.empty {
  float: right;
  font-size: 12px;
  color: rgb(0, 160, 220);
}
.list-content {
  padding: 0px 18px;
  max-height: 217px;
  overflow: hidden;
  background: #fff;
}
.list-food {
  position: relative;
  padding: 12px 0px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.list-name {
  line-height: 24px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.list-price {
  position: absolute;
  right: 105px;
  bottom: 12px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(240, 20, 20);
}
.cartcontrol-wrappers {
  position: absolute;
  right: 0px;
  bottom: 5px;
}
.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  background: rgb(7, 17, 27);
  opacity: 0.7;
  backdrop-filter: blur(10px);
  transition: all 0.5s;
}
.list-mask.fade-enter,
.list-mask.fade-leave-to {
  opacity: 0;
}
</style>
