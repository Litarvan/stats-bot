import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

if (localStorage.statsToken) {
  store.dispatch('readToken', localStorage.statsToken);
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
