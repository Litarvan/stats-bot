import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const API_URL = window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5565' : 'http://api.stats.litarvan.com';

async function request(path, params) {
  const options = params ? {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  } : {};

  return await (await fetch(API_URL + path, options)).json()
}

export default new Vuex.Store({
  state: {
    guilds: [],
    stats: {}
  },
  mutations: {
    setGuilds(state, guilds) {
      state.guilds = guilds;
    },
    setStats(state, { id, stats }) {
      state.stats = { ...state.stats, [id]: stats };
    }
  },
  actions: {
    async load({ commit }) {
      commit('setGuilds', await request('/guilds'));
    },
    async fetchGuild({ commit }, id) {
      commit('setStats', {
        id,
        stats: await request('/stats', { id })
      });
    }
  }
});
