<template>
    <component :is="renderType" :url="url"></component>
</template>
<script>
import SiteType1 from "./type1";
import SiteType2 from "./type2";
export default {
    name: "Site",
    props: {
        url: String,
        props: {
            type: Object,
            default: {
                type: 1,
            },
        },
    },
    computed: {
        renderType: function () {
            return "SiteType" + this.props.type;
        },
    },
    components: {
        SiteType1: SiteType1,
        SiteType2: SiteType2,
    },
};
</script>
