<template>
    <div class="layout">
        <h2>test</h2>
        <affix class="affix"></affix>
        <router-view />
    </div>
</template>

<script>
import Affix from "@/components/Affix";
// import AppMain from "../AppMain";
export default {
    name: "IndexLayout",
    data() {
        return {};
    },
    watch: {
        $route: {
            handler: function() {}
        },
        "$store.getters.showSidebar": function() {}
    },
    components: {
        // AppMain,
        Affix
    },
    methods: {},
    mounted() {}
};
</script>
<style scoped lang="stylus">

.layout
    box-sizing border-box
    font-size 20px
    min-height 100vh
    background-size cover
    background-repeat no-repeat
    background-attachment fixed
    overflow-x hidden
    .banner
        display block
        width 100%
</style>
