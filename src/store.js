import Vue from 'vue';
import Vuex from 'vuex';
import decode from 'jwt-decode';

Vue.use(Vuex);

export const API_URL = window.location.hostname === '127.0.0.1' ? 'http://127.0.0.1:5565' : 'http://api.stats.litarvan.com';

const store = new Vuex.Store({
  state: {
    token: '',
    user: null,
    guilds: [],
    stats: {}
  },
  mutations: {
    setUser(state, { token, data }) {
      state.token = token;
      state.user = data;
    },
    setGuilds(state, guilds) {
      state.guilds = guilds;
    },
    setStats(state, { id, stats }) {
      const current = state.stats;
      if (!current[id]) {
        current[id] = {
          stats: {},
          users: {}
        };
      }

      current[id].stats = stats;
      state.stats = current;
    },
    setUserStats(state, { guild, id, stats }) {
      const users = state.stats[guild].users;
      users[id] = stats;

      state.stats[guild].users = users;
    }
  },
  actions: {
    async load({ commit }) {
      commit('setGuilds', await request('/guilds'));
    },
    async fetchGuild({ commit }, id) {
      commit('setStats', {
        id,
        stats: await request('/stats/guild', { id })
      });
    },
    async fetchUser({ commit }, { guild, id }) {
      commit('setUserStats', {
        guild,
        id,
        stats: await request('/stats/user', { guild, id })
      });
    },
    async readToken({ commit }, token) {
      const data = decode(token).data;
      localStorage.statsToken = token;

      commit('setUser', { token, data  });
    }
  }
});

async function request(path, params) {
  const options = params ? {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Authorization': 'Bearer ' + store.state.token,
      'Content-Type': 'application/json'
    }
  } : {
    headers: {
      'Authorization': 'Bearer ' + store.state.token,
    }
  };

  return await (await fetch(API_URL + path, options)).json()
}

export default store;
