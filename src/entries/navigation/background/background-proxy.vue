<template>
    <component :is="$store.getters.dynamicBackground"></component>
</template>
<script>
import EmptyBackground from "./empty";
import BubbleBackground from "./bubble";
import SnowBackground from "./snow";
export default {
    components: {
        BubbleBackground,
        SnowBackground,
        EmptyBackground
    }
};
</script>
<style lang="less"></style>
