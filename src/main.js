import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/style/font/iconfont.css'
import "@/style/reset.scss";
import VueWechatTitle from "vue-wechat-title";
import api from "./http";
import Button from 'vant/lib/button';
import {NumberKeyboard, Field, Dialog, Toast, Rate,ActionSheet} from 'vant';
import 'vant/lib/button/style';
import 'vant/lib/number-keyboard/style';
import 'vant/lib/field/style';
import 'vant/lib/dialog/style';
import 'vant/lib/toast/style';
import 'vant/lib/rate/style'
import 'vant/lib/action-sheet/style'


Vue.use(api);
Vue.use(Button)
    .use(NumberKeyboard)
    .use(Field)
    .use(Dialog)
    .use(Toast)
    .use(Rate)
    .use(ActionSheet)


Vue.use(VueWechatTitle);
Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
