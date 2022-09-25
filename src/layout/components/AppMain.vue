<template>
    <!-- <transition name="fade"> -->
    <router-view @nav-change="handlerNavChange"></router-view>
    <!-- </transition> -->
    <!-- <transition mode="out-in" enter-active-class="animated fadeInLeft" leave-active-class="animated fadeOutRight">
		<router-view></router-view>
	</transition> -->
</template>

<script>
export default {
    name: 'AppMain',
    data() {
        return {};
    },
    methods: {
        handlerNavChange: function(val) {
            this.$emit('nav-change', val);
        }
    }
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
