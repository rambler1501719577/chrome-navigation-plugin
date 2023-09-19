<template>
    <div class="grid-components-container">
        <div
            v-for="item of layout"
            class="item"
            :key="item.id"
            :style="{
                gridArea: item.gridArea,
            }"
        >
            <LazyWidget
                id="{item.id}"
                componentName="{item.component}"
                width="{item.width}"
                height="{item.height}"
                props="{item.props}"
                url="{item.url}"
                title="{item.title}"
            ></LazyWidget>
            <p className="{style.title}">{{ item.title }}</p>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            layout: [],
        };
    },
    created() {},
    mounted() {},
};
</script>
