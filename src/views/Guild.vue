<template>
    <div id="guild">
        <div id="infos">
            <Loading v-if="!loaded" />

            <div id="infos-content" v-if="loaded">
                <img class="icon" :src="guild.icon" />
                <h1 class="title">{{ guild.name }}</h1>
            </div>
        </div>

        <div id="bottom">
            <div id="ranking">
                <h1 class="title">Members</h1>

                <Loading v-if="!loaded" />

                <template v-if="loaded">
                    <div class="user" v-for="user of ranking" :key="user.id" @click="select(user)" :class="{ 'selected': selected === user }">
                        <img class="avatar" :src="user.avatar" />

                        <div class="user-infos">
                            <span class="username">{{ user.name }}</span>
                            <span class="messages"><span class="count">{{ user.messages | large }}</span> messages</span>
                        </div>
                    </div>
                </template>
            </div>

            <div id="details">
                <h1 class="title">Details</h1>

                <Loading v-if="!loaded" />
            </div>
        </div>
        </div>
</template>

<script>
    import Loading from '../components/Loading';

    export default {
        name: 'guild',
        components: { Loading },

        mounted() {
            this.$store.dispatch('fetchGuild', this.$route.params['id'])
                .then(() => this.loaded = true);
        },
        data() {
            return {
                loaded: false,
                selected: null
            }
        },
        computed: {
            guild() {
                return this.$store.state.guilds.find(g => g.id === this.$route.params['id']);
            },
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
    $infos-height: 200px;
    $padding: 25px;

    #guild {
        display: flex;
        flex-direction: column;
    }

    #infos {
        background-color: #2b2c31;

        padding: 25px;
        height: $infos-height - $padding * 2;

        .loading {
            margin-top: 50px;
        }

        #infos-content {
            display: flex;

            .icon {
                border-radius: 5px;
                margin: 10px;
            }

            .title {
                margin-left: 25px;
                margin-top: 12px;

                font-size: 36px;
            }
        }
    }

    #bottom {
        display: flex;

        .loading {
            margin-top: calc(50vh - #{$infos-height});
        }
    }

    .title {
        font-weight: 500;
        margin-left: 10px;
        margin-top: 0;
    }

    #ranking, #details {
        padding: $padding;
        height: calc(100vh - #{$infos-height} - #{$padding} * 2);
    }

    #ranking {
        display: flex;
        flex-direction: column;

        width: 25%;
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
                height: 64px;
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

        background-color: #36393f;

        margin-left: -20px;
    }
</style>
