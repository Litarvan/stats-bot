<template>
  <div id="app">
    <div id="guilds">
      <div id="user">
        <img id="user-icon" src="https://cdn.discordapp.com/avatars/87279950075293696/54c3293fdc0ef6b8c0dd9d44e9d2ccb3.png?size=128" />
      </div>

      <div id="separator">
      </div>

      <div class="guild" v-for="guild of guilds" :key="guild.id" @click="$router.push('/guild/' + guild.id)" :class="{ 'selected': $route.params.id === guild.id }">
        <img class="guild-icon" :src="guild.icon" />
      </div>

      <div id="add" @click="$router.push('/add')">
        <span id="add-text">+</span>
      </div>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'app',

    beforeMount() {
      this.$store.dispatch('load');
    },
    computed: {
      ...mapState(['guilds'])
    }
  }
</script>

<style lang="scss">
  @font-face {
    font-family: 'Whitney';
    font-style: normal;
    font-weight: 300;
    src: local('Whitney-Book'), url('./assets/Whitney-Book.otf');
  }

  @font-face {
    font-family: 'Whitney';
    font-style: normal;
    font-weight: 400;
    src: local('Whitney'), local('Whitney-Medium'), url('./assets/Whitney-Medium.otf');
  }

  @font-face {
    font-family: 'Whitney';
    font-style: normal;
    font-weight: 500;
    src: local('Whitney-Semibold'), url('./assets/Whitney-Semibold.otf');
  }

  @font-face {
    font-family: 'Whitney';
    font-style: normal;
    font-weight: 600;
    src: local('Whitney-Bold'), url('./assets/Whitney-Bold.otf');
  }

  $guilds-width: 70px;
  $guild-size: 50px;

  html, body {
    margin: 0;
    padding: 0;

    overflow-x: hidden;
  }

  #app {
    width: 100vw;
    min-height: 100vh;

    background-color: #202225;

    display: flex;
  }

  #guilds {
    width: $guilds-width;
    min-height: 100vh;

    display: flex;
    flex-direction: column;
    align-items: center;

    .guild {
      position: relative;
      height: 50px;
      width: 50px;

      margin-bottom: 10px;

      &.selected .guild-icon, .guild-icon:hover {
        border-radius: 15px;
      }

      &::before {
        background: #fff;
        border-radius: 20px;

        position: absolute;
        top: 50%;
        left: -15px;

        width: 10px;
        height: 40px;
        margin-top: -10px;
        margin-left: -10px;

        content: " ";

        transition: margin-left .35s ease;
      }

      &.selected::before {
        margin-left: 0;
      }
    }

    .guild-icon, #add, #user-icon {
      border-radius: 50%;

      width: $guild-size;
      margin-top: 10px;

      &:hover {
        cursor: pointer;
      }
    }

    #user {
      margin-bottom: 10px;
      margin-top: 5px;
    }

    .guild-icon {
      transition: border-radius 250ms ease;
    }

    #separator {
      background: none;

      position: relative;
      width: $guild-size;
      height: 2px;

      &::after {
        background: #2f3136;
        content: " ";

        height: 2px;

        position: absolute;
        left: 20%;
        right: 20%;
        top: 0;
      }
    }

    #add {
      border-color: #535559;
      color: #535559;

      border-style: dashed;
      border-width: 1px;

      display: flex;
      align-items: center;
      justify-content: center;

      height: $guild-size;

      transition: border-color 250ms ease, color 250ms ease;

      &:hover {
        border-color: hsla(0, 0%,100%, .75);;
        color: hsla(0, 0%, 100%, .75);;
      }
    }
  }

  #content {
    width: calc(100vw - #{$guilds-width});
    height: 100vh;

    background-color: #2f3136;

    overflow: auto;

    font-family: 'Whitney', 'Arial', sans-serif;
    font-weight: 300;
    color: white;
  }
</style>
