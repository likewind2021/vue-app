<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop.prevent="decreaseCart">
        <div class="inner icon-remove_circle_outline"></div>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{ food.count }}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  props: {
    food: {
      type: Object,
    },
  },
  // created(){
  //   console.log(this.food);
  // },
  methods: {
    addCart(event) {
      if (!event._constructed) {
        return;
      }
      // console.log("click");
      if (!this.food.count) {
        Vue.set(this.food, "count", 1);
      } else {
        this.food.count++;
      }
      this.$emit("cart.add", event.target);
    },
    decreaseCart(event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    },
  },
};
</script>

<style>
.carcontrol {
  font-size: 0px;
}
.cart-decrease,
.cart-add {
  display: inline-block;
  padding: 6px;
  background-position: center;
}
.cart-decrease {
  width: 24px;
  height: 24px;
  background-image: url("./decrease.png");
  background-size: 24px 24px;
  background-repeat: no-repeat;
  transition: all .5s linear;
}
/* .cart-decrease.move-transition {
  opacity: 1;
  transform: translate3d(0, 0, 0);
} */
.cart-decrease.move-enter,
.cart-decrease.move-leave-to {
  opacity: 0;
  transform: translate3d(24px, 0, 0);
}
.icon-remove_circle_outline {
  width: 24px;
  height: 24px;
  background-image: url("./decrease.png");
  background-size: 24px 24px;
  background-repeat: no-repeat;
}

.inner {
  line-height: 24px;
  font-size: 24px;
  color: rgb(0, 160, 220);
  transition: all 0.4s linear;
}
.cart-decrease.move-transition .inner {
  transform: rotate(0);
}
.cart-decrease.move-enter .inner,
.cart-decrease.move-leave-to .inner {
  transform: rotate(180deg);
}

.cart-count {
  display: inline-block;
  vertical-align: top;
  width: 12px;
  padding-top: 6px;
  line-height: 24px;
  text-align: center;
  font-size: 10px;
  color: rgb(147, 153, 159);
}
.cart-add {
  display: inline-block;
  line-height: 24px;
  font-size: 24px;
  color: rgb(0, 160, 220);
  margin-right: 12px;
  width: 24px;
  height: 24px;
  background-image: url("./add.png");
  background-size: 24px 24px;
  background-repeat: no-repeat;
}
</style>