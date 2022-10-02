<template>
    <div class="rambler-tag">
        <span @click="goToTagDetail">{{tag.name}}</span>
    </div>
</template>

<script>
    export default {
        name: "Rambler-Tag",
        props: {
            tag: Object
        },
        data() {
            return {};
        },
        watch: {},
        computed: {},
        methods: {
            goToTagDetail: function() {
                let path = `/tags/${this.tag.name}`;
                this.$router.push(path);
            }
        },
        created() {},
        mounted() {},
    };
</script>

<style lang="stylus" scoped>
.rambler-tag
    display inline-block
    span
        background #30a7d1
        border-radius 15px
        margin-right 15px
        padding 4px 15px
        text-align center
        text-decoration none
        line-height 80%
        color #fff
        font-size 15px
        cursor url('../../assets/cur/pointer.cur'),auto
</style>
