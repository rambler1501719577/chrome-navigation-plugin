<template>
    <div class="rambler-part-title">
        <h1>{{title}}</h1>
    </div>
</template>

<script>
export default {
    props:{
        title:String
    },
    data() {
        return {};
    },
    methods: {},
    created() {},
    mounted() {},
};
</script>

<style lang="stylus" scoped>
.rambler-part-title
    height 250px
    display flex
    align-items center
    justify-content center
    h1
        font-size 32px
        color #eee
        text-align center
</style>
