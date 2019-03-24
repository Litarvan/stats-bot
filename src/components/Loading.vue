<template>
    <div class="loading">
        <span class="loading-inner">
            <span class="loading-cube"></span>
            <span class="loading-cube"></span>
        </span>
    </div>
</template>

<script>
    export default {
        name: 'loading'
    }
</script>

<style lang="scss" scoped>
    .loading {
        display: flex;
        justify-content: center;
        align-items: center;

        height: 36px;

        margin-top: 10px;
    }

    .loading-inner {
        display: inline-block;
        position: relative;

        width: 32px;
        height: 32px;

        .loading-cube {
            animation: loading-cube 1.8s infinite ease-in-out;

            position: absolute;
            left: 0;
            top: 0;

            width: 10px;
            height: 10px;

            background-color: #7289da;

            &:last-child {
                animation-delay: -.9s;
            }
        }
    }

    @keyframes loading-cube {
        25% {
            transform: translateX(22px) rotate(-90deg) scale(.5);
        }

        50% {
            transform: translateX(22px) translateY(22px) rotate(-180deg);
        }

        75% {
            transform: translateX(0) translateY(22px) rotate(-270deg) scale(.5);
        }

        100% {
            transform: rotate(-1turn);
        }
    }
</style>
