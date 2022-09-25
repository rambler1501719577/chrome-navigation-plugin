<template>
    <div class="default-banner">
        <h1>{{ title }}</h1>
    </div>
</template>

<script>
export default {
    props: {
        title: String
    },
    data() {
        return {};
    },
};
</script>

<style lang="stylus" scoped>
.default-banner
    height 250px
    display flex
    align-items center
    justify-content center
    h1
        font-size 32px
        color #eee
        text-align center
@media (max-width: 767px)
    .default-banner
        height 150px
</style>
