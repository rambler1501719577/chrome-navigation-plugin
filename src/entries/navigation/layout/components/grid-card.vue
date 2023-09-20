<template>
    <component :is="component" v-bind="$attrs"></component>
</template>
<script>
import Music from "../../widgets/music";
import Site from "../../widgets/site";
import Folder from "../../widgets/folder";
export default {
    name: "MusicPlayer",
    props: {
        component: {
            type: String,
        },
    },
    components: {
        Music: Music,
        Site,
        Folder,
    },
};
</script>
