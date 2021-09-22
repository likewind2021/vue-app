<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li
          v-for="(item, index) in goods"
          :key="index"
          class="menu-item"
          :class="{ current: currentIndex === index }"
          @click="selectMenu(index)"
        >
          <span class="menu-text">
            <span
              v-show="item.type > 0"
              class="menu-icon"
              :class="classMap[item.type]"
            ></span
            >{{ item.name }}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li
          v-for="(item, index) in goods"
          :key="index"
          class="food-list food-list-hook"
        >
          <h1 class="food-title">{{ item.name }}</h1>
          <ul>
            <li
              v-for="(food, index) in item.foods"
              :key="index"
              class="food-item"
              @click="selectFood(food,$event)"
            >
              <div class="food-icon">
                <img :src="food.icon" width="57" height="57" />
              </div>
              <div class="food-content">
                <h2 class="food-name">{{ food.name }}</h2>
                <p class="food-desc">{{ food.description }}</p>
                <div class="food-extra">
                  <span class="count">月售{{ food.sellCount }}份</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="food-price">
                  <span class="now">￥{{ food.price }}</span>
                  <span class="old" v-show="food.oldPrice"
                    >￥{{ food.oldPrice }}</span
                  >
                </div>
                <div class="cartcontrol-wrapper">
                  <Cartcontrol :food="food"></Cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <Shopcart
      ref="shopCart"
      :select-foods="selectFoods"
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice"
    >
    </Shopcart>
    <Food :food="selectedFood" ref="food"></Food>
  </div>
</template>

<script>
import Data from "../../data";
import BScroll from "better-scroll";
import Shopcart from "../shopcart/shopcart.vue";
import Cartcontrol from "../cartcontrol/cartcontrol.vue";
import Food from "../food/food.vue";

export default {
  props: {
    seller: {
      type: Object,
    },
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      timer: null,
      selectedFood: {},
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (this.scrollY === 0 && height1 === 0) {
          return 0;
        }
        if (this.scrollY >= height1 && this.scrollY < height2) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    },
  },
  watch: {
    currentIndex(newVal, oldVal) {
      // console.log("in watch: ", newVal);
    },
    listHeight(newVal, oldVal) {
      // console.log("in watch listHeight: ", newVal);
    },
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];

    const { seller, goods, ratings } = Data;
    // console.log(goods);
    this.goods = goods;
    // this.$nextTick(()=>{
    // // console.log('created',this.$refs)
    // })
  },
  mounted() {
    this.$nextTick(() => {
      this._initScroll();
      this._calculateHeight();
    });
    // console.log('mounted',this.$refs)
  },
  methods: {
    // selectMenu(index, event) {
    //   if (!event._constructed) {
    //     return;
    //   }
    // },
    selectMenu(index) {
      // console.log(index);
      // this.currentIndex = index;
      let foodList = window.document.getElementsByClassName("food-list-hook");
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    selectFood(food, event) {
      if (!event._constructed) {
        return;
      }
      this.selectedFood = food;
      this.$refs.food.show();
      // console.log(this.$refs.food);
    },
    _drop(target) {
      // 体验优化,异步执行下落动画
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true,
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        click: true,
        probeType: 3,
      });
      this.foodsScroll.on("scroll", (pos) => {
        // console.log("pos: ", pos);
        this.scrollY = Math.abs(Math.round(pos.y)) + 1;
        // console.log("scrollY: ", this.scrollY, this.listHeight);
      });
    },
    debounce(fn, wait) {
      this.timer = null;
      return function () {
        if (this.timer !== null) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(fn, wait);
      };
    },
    _calculateHeight() {
      // let foodList = this.$refs.foodsWrapper.
      let foodList = window.document.getElementsByClassName("food-list-hook");
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
      // console.log(this.listHeight);
    },
  },
  components: {
    Shopcart,
    Cartcontrol,
    Food,
  },
  events: {
    "cart.add"(target) {
      this._drop(target);
    },
  },
};
</script>

<style>
.goods {
  display: flex;
  position: absolute;
  top: 175px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;
}
.menu-wrapper {
  flex: 0 0 80px;
  width: 80px;
  background: #f3f5f7;
}
.menu-item {
  display: table;
  height: 54px;
  width: 56px;
  line-height: 14px;
  padding: 0px 12px;
}
.current {
  position: relative;
  z-index: 10;
  margin-top: -1px;
  background: #fff;
  font-weight: 700;
}
.current .menu-text {
  border-bottom: 1px solid #fff;
}
.menu-icon {
  display: inline-block;
  vertical-align: top;
  width: 12px;
  height: 12px;
  margin-right: 2px;
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
.guarantee {
  background-image: url("./guarantee_3@2x.png");
}
.invoice {
  background-image: url("./invoice_3@2x.png");
}
.special {
  background-image: url("./special_3@2x.png");
}
.discount {
  background-image: url("./discount_3@2x.png");
}
.decrease {
  background-image: url("./decrease_3@2x.png");
}
.menu-text {
  display: table-cell;
  font-size: 12px;
  width: 56px;
  vertical-align: middle;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.foods-wrapper {
  flex: 1;
}
.food-title {
  padding-left: 14px;
  height: 26px;
  line-height: 26px;
  border-left: 2px solid #d9dde1;
  font-size: 12px;
  color: rgb(147, 153, 159);
  background: #f3f5f7;
}
.food-item {
  display: flex;
  margin: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.food-item:last-child {
  border-bottom: 0px solid #fff;
  margin-bottom: 0px;
}
.food-icon {
  flex: 0 0 57px;
  margin-right: 10px;
}
.food-content {
  flex: 1;
  position: relative;
}
.food-name {
  margin: 2px 0px 8px 0px;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}
.food-desc,
.food-extra {
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.food-desc {
  margin-bottom: 8px;
  line-height: 12px;
}
.count {
  margin-right: 12px;
}
.food-price {
  font-weight: 700;
  line-height: 24px;
}
.now {
  margin-right: 8px;
  font-size: 14px;
  color: rgb(240, 20, 20);
}
.old {
  text-decoration: line-through;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.cartcontrol-wrapper {
  position: absolute;
  right: 0px;
  bottom: 12px;
}
</style>