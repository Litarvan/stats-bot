<template>
    <div id="guild">
        <div id="ranking">
            <h1 class="title">Ranking</h1>

            <div class="user" v-for="user of ranking" :key="user.id">
                <img class="avatar" :src="user.avatar" />

                <div class="user-infos">
                    <span class="username">{{ user.name }}</span>
                    <span class="messages"><b>{{ user.messages | large }}</b> messages</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'guild',

        mounted() {
            this.$store.dispatch('fetchGuild', this.$route.params['id']);
        },
        computed: {
            ranking() {
                console.log('Ranking update!');
                return this.$store.state.ranking[this.$route.params['id']];
            }
        },
        filters: {
            large(number) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            }
        }
    }
</script>

<style lang="scss" scoped>
    #ranking {
        margin-left: 100px;

        display: flex;
        flex-direction: column;

        .user {
            display: flex;

            .avatar {
                width: 64px;
                margin-right: 15px;
            }

            .user-infos {
                display: flex;
                flex-direction: column;
            }

            margin-bottom: 25px;
        }
    }
</style>
