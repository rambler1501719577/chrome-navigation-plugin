<template>
    <div class="rambler-alert-wrapper">
        <div :class="`rambler-alert rambler-alert-${type}`">
            <span>
                <slot></slot>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: "Rambler-Tag",
    props: {
        type: {
            type: String,
            default: "primary",
        },
    },
    data() {
        return {};
    },
};
</script>

<style lang="less" scoped>
.rambler-alert-wrapper {
    .rambler-alert {
        padding: 15px;
        border-radius: 4px;
        font-size: 14px;
        line-height: 24px;
    }
    .rambler-alert-primary {
        background: #e5f3fe;
        color: #4e4e4e;
        border-left: 4px solid #0085f2;
    }
    .rambler-alert-warning {
        background: #fdf6ec;
        color: #e6a23c;
    }
}
</style>
