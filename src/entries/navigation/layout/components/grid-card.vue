<template>
    <component :is="component" v-bind="$attrs"></component>
</template>
<script>
import Music from "../../widgets/music";
import Site from "../../widgets/site";
import Folder from "../../widgets/folder";
import CountDown from "../../widgets/count-down";
import Add from "../../widgets/add";
export default {
    name: "GridCard",
    props: {
        component: {
            type: String,
        },
    },
    components: {
        Music: Music,
        Site,
        Folder,
        CountDown,
        Add,
    },
};
</script>
