<template>
    <div
        class="dynamic-proxy-container"
        :style="{ backdropFilter: 'blur(0px)' }"
    >
        <component :is="$store.getters.dynamicBackground"></component>
    </div>
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
<style lang="less">
.dynamic-proxy-container {
    width: 100%;
    height: 100%;
}
</style>
