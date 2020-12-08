import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.mixin({
  data() {
    return {
      url : 'https://7463-tcb-ypzdcajvxcfsfgbd9be67-3f3589-1304337425.tcb.qcloud.la/',
    };
  }
});
const app = new Vue({
    ...App
})
app.$mount()
