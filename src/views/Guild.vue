<template>
    <div id="guild">
        <div id="ranking">
            <h1 class="title">Members</h1>

            <div class="user" v-for="user of ranking" :key="user.id" @click="select(user)" :class="{ 'selected': selected === user }">
                <img class="avatar" :src="user.avatar" />

                <div class="user-infos">
                    <span class="username">{{ user.name }}</span>
                    <span class="messages"><span class="count">{{ user.messages | large }}</span> messages</span>
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
        data() {
            return {
                selected: null
            }
        },
        computed: {
            ranking() {
                return this.$store.state.ranking[this.$route.params['id']];
            }
        },
        filters: {
            large(number) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            }
        },
        methods: {
            select(user) {
                this.selected = user;
            }
        }
    }
</script>

<style lang="scss" scoped>
    #ranking {
        margin-left: 100px;

        display: flex;
        flex-direction: column;

        width: 25%;
        height: 100vh;
        overflow: auto;

        .title {
            font-weight: 500;
        }

        .user {
            display: flex;

            margin-right: 15px;
            padding: 10px;

            border-radius: 4px;

            transition: background-color 125ms ease;

            .avatar {
                width: 64px;
                margin-right: 15px;

                border-radius: 3px;
            }

            .user-infos {
                display: flex;
                flex-direction: column;

                .count {
                    font-weight: 500;
                }
            }

            &.selected {
                background-color: rgba(255, 255, 255, 0.075);
            }

            &:hover {
                background-color: rgba(255, 255, 255, 0.125);
                cursor: pointer;
            }
        }
    }
</style>
