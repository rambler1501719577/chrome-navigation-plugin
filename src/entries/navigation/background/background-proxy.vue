<template>
    <component :is="$store.getters.dynamicBackground"></component>
</template>
<script>
import EmptyBackground from "./backgrounds/empty";
import BubbleBackground from "./backgrounds/bubble";
import SnowBackground from "./backgrounds/snow";
export default {
    components: {
        BubbleBackground,
        SnowBackground,
        EmptyBackground,
    },
};
</script>
<style lang="less"></style>
