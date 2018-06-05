import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题

// 注册 element-ui 组件
Vue.use(ElementUI, { size: 'smail' });

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#usersApp');