import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';
import '../static/css/reset.css';
// import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes=[
  {path:'/goods',component:goods},
  {path:'/ratings',component:ratings},
  {path:'/seller',component:seller}
]

const router = new VueRouter({
  linkActiveClass:'active',
  routes
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

// router.go('/seller')

// const app = new Vue({
//   router
// }).$mount('#app')

// let app = Vue.extend(App);
// let router = new VueRouter();
// router.map({
//   '/goods':{
//     componemt:goods
//   }
// });
// router.start(app,'#app');
