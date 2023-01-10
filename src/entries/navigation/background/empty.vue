<template>
    <div class="empty-bg"></div>
</template>

<script>
export default {
    name: "DefaultBackground"
};
</script>

<style lang="less" scoped>
.empty-bg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
}
</style>
