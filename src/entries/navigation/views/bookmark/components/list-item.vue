<template>
    <div class="bookmark-list-item-wrapper">
        <div
            v-if="isDir"
            class="list-item-dir list-item"
            @click="handleItemClick('dir')"
            @contextmenu="handleContextmenu"
        >
            <div class="title">
                <rambler-icon name="folder" class="icon"></rambler-icon>
                <span class="title-text">{{ bookmark.title | upper }}</span>
            </div>
            <div class="mod-time">
                <span>
                    {{
                        bookmark.dateGroupModified | timeFormat("{y}-{m}-{d}")
                    }}</span
                >
            </div>
        </div>
        <div
            v-else
            class="list-item-bookmark list-item"
            @click="handleItemClick('bookmark')"
        >
            <div class="title">
                <favicon
                    :url="bookmark.url"
                    :name="bookmark.title"
                    class="icon"
                ></favicon>
                <span class="title-text">{{ bookmark.title | upper }}</span>
            </div>
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
    methods: {
        handleItemClick(type) {
            const emitType = type == "dir" ? "dir-click" : "bookmark-click";
            this.$emit(emitType, this.bookmark);
        },
        handleContextmenu(e) {
            e.stopPropagation();
            e.preventDefault();
            console.log("contextmenu");
        },
    },
};
</script>
<style lang="less" scoped>
.bookmark-list-item-wrapper {
    .list-item {
        height: 40px;
        display: flex;
        align-items: center;
        .title {
            width: 410px;
            overflow: hidden;
            color: #666;
            font-size: 16px;
            line-height: 20px;
            letter-spacing: 1px;
            display: flex;
            align-items: center;
            .title-text {
                display: block;
                width: 100%;
                height: 40px;
                line-height: 40px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .icon {
                font-size: 18px;
                margin-right: 8px;
            }
        }
        .mod-time {
            color: rgba(0, 0, 0, 0.54);
        }
    }
}
</style>
