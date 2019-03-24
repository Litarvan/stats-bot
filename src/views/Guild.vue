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
                    <div class="user" v-for="(user, i) of ranking" :key="user.id" @click="select(user)" :class="{ 'selected': selected === user }">
                        <div class="user-left">
                            <img class="avatar" :src="user.avatar" />

                            <div class="user-infos">
                                <span class="username">{{ user.name }}</span>
                                <span class="messages"><span class="count">{{ user.messages | large }}</span> messages</span>
                                <span class="joined">Joined <span class="joined-date">{{ user.joined | date }}</span></span>
                            </div>
                        </div>

                        <div class="user-rank">
                            #{{ i + 1 }}
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
            this.fetch();
        },
        data() {
            return {
                loaded: false,
                selected: null
            }
        },
        computed: {
            guild() {
                return this.$store.state.guilds.find(g => g.id === this.$route.params.id);
            },
            ranking() {
                return this.$store.state.ranking[this.$route.params.id];
            }
        },
        filters: {
            large(number) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            },
            date(timestamp) {
                const date = new Date(timestamp);
                return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
            }
        },
        methods: {
            select(user) {
                this.selected = user;
            },
            fetch() {
                this.loaded = false;

                this.$store.dispatch('fetchGuild', this.$route.params['id'])
                    .then(() => this.loaded = true);
            }
        },
        watch: {
            '$route.params.id'(value) {
                this.fetch();
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
            justify-content: space-between;

            margin-right: 5px;
            margin-bottom: 10px;
            padding: 10px;

            border-radius: 4px;

            transition: background-color 125ms ease;

            .user-left {
                display: flex;

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

                    .joined {
                        margin-top: 10px;
                        font-size: 14px;
                    }
                }
            }

            .user-rank {
                display: flex;
                align-items: center;

                font-size: 20px;
                font-weight: 500;

                margin-top: -7px;
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
