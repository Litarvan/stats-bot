import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import Home from './views/Home.vue';
import Add from './views/Add';
import Guild from './views/Guild';

Vue.use(Router);

const router = new Router({
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

router.beforeEach((to, from, next) => {
  if (to.query.token) {
    store.dispatch('readToken', to.query.token);
    return next(to.path);
  }

  if (to.path !== '/' && !store.state.user) {
    return next('/');
  }

  return next();
});

export default router;
