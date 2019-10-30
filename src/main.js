import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'lib-flexible'
import '@/style/font/iconfont.css'
import "@/style/reset.scss";
import VueWechatTitle from "vue-wechat-title";
import api from "./http";
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(api);
Vue.use(Vant);
Vue.use(VueWechatTitle);
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
