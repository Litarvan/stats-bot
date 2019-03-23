import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Add from './views/Add';
import Guild from './views/Guild';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,

  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/add',
      component: Add
    },
    {
      path: '/guild/:id',
      component: Guild
    }
  ]
});
