// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
import { Message } from 'element-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import Notifications from 'vue-notification'
import { audioPlay } from '@/api'
import { HttpPost } from '@/api'
import Vue from 'vue'
import OneSignalVue from 'onesignal-vue'

Vue.use(OneSignalVue)
Vue.prototype.HttpPost = HttpPost  
Vue.prototype.audioPlay = audioPlay  
Vue.use(Notifications)
Vue.use(Preview)
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.use(VueAwesomeSwiper)
Vue.prototype.$message = Message

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App),
  beforeMount() {
    this.$OneSignal.init({ appId: '3518c27c-1aa0-474b-9e72-08175cde90f6' });
  }
}).$mount('#app')

