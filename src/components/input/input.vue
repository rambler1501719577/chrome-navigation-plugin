<template>
    <div class="rambler-input-container">
        <input
            v-model="field"
            @change="toggle"
            :type="type"
            :placeholder="placeholder"
        />
    </div>
</template>
<script>
export default {
    name: "RamblerInput",
    model: {
        prop: "value",
        event: "change",
    },
    data() {
        return {
            field: "",
        };
    },
    props: {
        value: String,
        type: {
            type: String,
            default: "text",
        },
        placeholder: {
            type: String,
            default: "输入...",
        },
    },
    methods: {
        toggle() {
            this.$emit("change", this.field);
        },
    },
};
</script>
<style scoped lang="less">
.rambler-input-container {
    width: 100%;
    margin-bottom: 20px;
    input {
        box-sizing: border-box;
        display: block;
        width: 100%;
        height: 32px;
        border: 1px solid #ddd;
        outline: none;
        border-radius: 3px;
        padding: 0 5px 0 5px;
        font-size: 14px;
        &:focus {
            border-color: rgba(150, 149, 149, 0.932);
        }
    }
}
</style>
