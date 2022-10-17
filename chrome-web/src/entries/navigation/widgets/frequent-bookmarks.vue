<template>
    <div class="frequent-bookmarks-container">
        <div
            class="bookitem"
            v-for="bookmark of frequentBookmarks"
            :key="bookmark.id"
        >
            <a :href="bookmark.url" target="_blank">
                <image-card
                    :name="bookmark.name"
                    :url="bookmark.url"
                ></image-card>
            </a>
        </div>
    </div>
</template>

<script>
import ImageCard from "../components/image-card";
import { mapGetters } from "vuex";
export default {
    name: "FrequesntBookmarks",
    data() {
        return {
            commonBookmark: []
        };
    },
    computed: {
        ...mapGetters(["frequentBookmarks"])
    },
    components: {
        ImageCard
    }
};
</script>
<style lang="less" scoped>
.frequent-bookmarks-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .bookitem {
        width: 100px;
        min-height: 100px;
        margin-right: 20px;
        margin-bottom: 20px;
        cursor: pointer;
        padding-top: 15px;
        transition: all 0.5s;
        border-radius: 10px;
        &:hover {
            background-color: rgba(229, 229, 229, 0.5);
        }
    }
}
</style>
