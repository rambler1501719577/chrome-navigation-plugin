<template>
    <div class="data-manage-container">
        <div class="list">
            <div class="list-item" @click="switchComponent('bookmark-manage')">
                <rambler-icon title="书签" name="bookmark"></rambler-icon>
            </div>
            <!-- <div class="list-item" @click="switchComponent('engine-manage')">
                <rambler-icon title="搜索引擎" name="engine"></rambler-icon>
            </div> -->
            <div
                class="list-item"
                @click="switchComponent('frequent-website-manage')"
            >
                <rambler-icon title="常用网站" name="website"></rambler-icon>
            </div>
        </div>
        <div class="page-entity">
            <component :is="current"></component>
        </div>
    </div>
</template>

<script>
import BookmarkManage from "../bookmark/manage.vue";
import EngineManage from "../search-engine/manage.vue";
import FrequentWebsiteManage from "../frequent-website/manage.vue";
export default {
    name: "DataManage",
    data() {
        return {
            current: "bookmark-manage", // bookmark-manage | frequent-bookmarks-manage | engine-manage
        };
    },
    components: {
        FrequentWebsiteManage,
        EngineManage,
        BookmarkManage,
    },
    computed: {},
    methods: {
        switchComponent(component) {
            this.current = component;
        },
    },
};
</script>
<style lang="less" scoped="scoped">
.data-manage-container {
    .list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        .list-item {
            width: 40px;
            height: 40px;
            background: #eee;
            margin-right: 12px;
            position: relative;
            cursor: pointer;
            .rambler-icon {
                position: absolute;
                left: 8px;
                top: 8px;
                font-size: 24px;
            }

            &:hover {
                background: #ddd;
            }
        }
    }
}
</style>
