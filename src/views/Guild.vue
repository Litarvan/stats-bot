<template>
    <div id="guild">
        <div id="infos">
            <Loading v-if="!loaded" />

            <div id="infos-content" v-if="loaded">
                <img class="icon" :src="guild.icon" />
                <div id="infos-list">
                    <h1 class="title">{{ guild.name }}</h1>
                    <span class="info">Users    : <span class="info-value">{{ stats.memberCount | large }}</span></span>
                    <span class="info">Messages : <span class="info-value">{{ stats.messageCount | large }}</span></span>
                    <span class="info">Created : <span class="info-value">{{ stats.createdAt | date }}</span></span>
                </div>
            </div>
        </div>

        <div id="bottom">
            <div id="ranking">
                <h1 class="title">Members</h1>

                <Loading v-if="!loaded" />

                <template v-if="loaded">
                    <div class="user" v-for="(user, i) of stats.members" :key="user.id" @click="select(user)" :class="{ 'selected': selected === user }">
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

                    <hr style="opacity: 0" /> <!-- So that the last user is not stuck to the bottom -->
                </template>
            </div>

            <div id="details">
                <h1 class="title">Details</h1>
                <Loading v-if="!loaded" />

                <template v-if="selected">
                    <Loading v-if="!detailsLoaded" />

                    <div id="canvas-container" :class="{ 'hidden': !detailsLoaded }">
                        <canvas ref="msgPerDay"></canvas>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
    import Chart from 'chart.js';
    import Loading from '../components/Loading';

    let chart;

    export default {
        name: 'guild',
        components: { Loading },

        mounted() {
            this.fetch();
        },
        data() {
            return {
                loaded: false,
                detailsLoaded: false,
                selected: null
            }
        },
        computed: {
            guild() {
                return this.$store.state.guilds.find(g => g.id === this.$route.params.id);
            },
            stats() {
                return this.$store.state.stats[this.$route.params.id].stats;
            }
        },
        filters: {
            large(number) {
                return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
            },
            date(timestamp) {
                const date = new Date(timestamp);
                const pad = s => s < 10 ? '0' + s : s;

                return pad(date.getDate()) + '/' + pad(date.getMonth() + 1) + '/' + date.getFullYear();
            }
        },
        methods: {
            select(user) {
                this.selected = user;
                this.detailsLoaded = false;

                const guild = this.$route.params.id;

                this.$store.dispatch('fetchUser', {
                    guild,
                    id: user.id
                }).then(() => {
                    const data = this.$store.state.stats[guild].users[user.id];
                    const labels = Object.keys(data).filter((_, i) => i < 60).map(time => {
                        const date = new Date(parseInt(time));
                        const pad = a => ((a < 10 ? '0' : '') + a);
                        return pad(date.getDate()) + '/' + pad((date.getMonth() + 1)) + '/' + date.getFullYear().toString().substring(2);
                    });

                    if (chart) {
                        chart.data.labels = labels;
                        chart.data.datasets[0].data = Object.values(data).filter((_, i) => i < 60);
                        chart.update();

                        this.detailsLoaded = true;
                        return;
                    }

                    chart = new Chart(this.$refs.msgPerDay.getContext('2d'), {
                        type: 'line',
                        data: {
                            labels,
                            datasets: [
                                {
                                    label: 'Messages per day',
                                    backgroundColor: 'rgba(56, 226, 82, 0.75)',
                                    data: Object.values(data).filter((_, i) => i < 60)
                                }
                            ]
                        },
                        options: {
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true
                                    }
                                }]
                            }
                        }
                    });

                    this.detailsLoaded = true;
                });
            },
            fetch() {
                this.loaded = false;
                this.detailsLoaded = false;
                this.selected = null;

                this.$store.dispatch('fetchGuild', this.$route.params['id'])
                    .then(() => this.loaded = true);
            }
        },
        watch: {
            '$route.params.id'() {
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

            #infos-list {
                display: flex;
                flex-direction: column;

                margin-left: 25px;
                font-size: 18px;

                .title {
                    margin-top: 12px;
                    margin-left: 0;
                    margin-bottom: 15px;

                    font-size: 36px;
                }

                .info-value {
                    font-weight: 500;
                }
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

        width: 575px;
        overflow: auto;

        .user {
            display: flex;
            justify-content: space-between;

            margin-right: 10px;
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

                    .username {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        width: 200px;
                    }

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
                margin-right: 10px;
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
        width: 100%;
        margin-left: -20px;

        background-color: #36393f;

        #canvas-container {
            width: 500px;

            padding: 20px;
            padding-bottom: 10px;

            margin-left: 10px;

            background-color: #2b2c31;
            box-shadow: rgba(0, 0, 0, 0.3) 0 1px 4px 0;

            &.hidden {
                display: none !important;
            }
        }
    }
</style>
