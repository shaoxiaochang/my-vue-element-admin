import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss' // global css

import App from './App.vue'

import './icons' // icon

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  render: h => h(App),
}).$mount('#app')
