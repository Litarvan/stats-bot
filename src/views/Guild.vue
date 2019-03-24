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

        <div id="details">
            <h1 class="title">Details</h1>
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
    #guild {
        display: flex;
    }

    .title {
        font-weight: 500;
        margin-left: 10px;
        margin-top: 0;
    }

    #ranking, #details {
        padding: 25px;
    }

    #ranking {
        display: flex;
        flex-direction: column;

        width: 25%;
        height: calc(100vh - 50px);
        overflow: auto;

        .user {
            display: flex;

            margin-right: 5px;
            margin-bottom: 10px;
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
                background-color: rgba(255, 255, 255, 0.1);
                cursor: pointer;
            }
        }
    }

    #details {
        width: calc(75% - 20px);
        height: calc(100vh - 50px);

        background-color: #36393f;

        margin-left: -20px;
    }
</style>
