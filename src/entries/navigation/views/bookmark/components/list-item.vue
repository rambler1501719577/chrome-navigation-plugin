<template>
    <div class="bookmark-list-item-wrapper">
        <div v-if="isDir" class="list-item-dir" @click="handleItemClick('dir')">
            <rambler-icon name="folder"></rambler-icon>
            {{ bookmark.title }}
        </div>
        <div
            v-else
            class="list-item-bookmark"
            @click="handleItemClick('bookmark')"
        >
            <favicon :url="bookmark.url" :name="bookmark.title"></favicon>
            {{ bookmark.title }}
        </div>
    </div>
</template>

<script>
export default {
    name: "Bookmark",
    props: {
        bookmark: {
            required: true,
            type: Object,
        },
    },
    data() {
        return {};
    },
    computed: {
        isDir() {
            return !this.bookmark.url;
        },
    },
    created() {},
    methods: {
        handleItemClick(type) {
            const emitType = type == "dir" ? "dir-click" : "bookmark-click";
            this.$emit(emitType, this.bookmark);
        },
    },
};
</script>
<style lang="less" scoped></style>
