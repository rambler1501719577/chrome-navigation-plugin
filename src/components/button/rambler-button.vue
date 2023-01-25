<template>
    <div class="rambler-button">
        <button
            @click="handleNativeClick"
            :class="{
                'rambler-button-inner': true,
                'button-blue': type == 'primary',
                'button-green': type == 'success',
                'button-orange': type == 'warning',
                'button-red': type == 'danger'
            }"
        >
            <div class="text-inner">
                <rambler-icon v-if="icon" :name="icon" class="btn-icon"></rambler-icon>
                <!-- 文本内容 -->
                <span
                    v-if="hasConent"
                    :class="{
                        'btn-text': true,
                        'icon-btn': hasIcon && hasConent
                    }"
                    ><slot></slot
                ></span>
            </div>
        </button>
    </div>
</template>

<script>
export default {
    name: 'RamblerButton',
    props: {
        type: {
            type: String,
            default: ''
        },
        icon: String,
        disabled: Boolean
    },
    computed: {
        hasConent: function() {
            return this.$slots.hasOwnProperty('default')
        },
        hasIcon() {
            return this.icon
        }
    },
    created() {
        if (!this.validateButton()) {
            throw new Error(`按钮类型错误, 只支持${this.types.map(item => `【${item}】`)}几种类型`)
        }
    },
    data() {
        return {
            types: ['primary', 'danger', 'success', 'warning']
        }
    },
    methods: {
        validateButton() {
            // 无类型，默认样式
            if (!this.type) return true
            return this.types.includes(this.type)
        },
        handleNativeClick(e) {
            this.$emit('click', e)
        }
    }
}
</script>

<style lang="less" scoped>
@import url('./button.less');
</style>
