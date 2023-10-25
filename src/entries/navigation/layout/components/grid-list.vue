<template>
    <div class="grid-components-container">
        <div
            v-for="item of widgets"
            class="item"
            :key="item.id"
            :style="{
                gridColumn: 'span ' + item.width,
                gridRow: 'span ' + item.height,
            }"
        >
            <grid-card
                :component="item.component"
                :id="item.id"
                :width="item.width"
                :height="item.height"
                :prop="item.props"
                :url="item.url"
                :title="item.title"
            ></grid-card>
            <p class="title">{{ item.title }}</p>
        </div>
    </div>
</template>
<script lang="javascript">
import Sortable from "sortablejs"
import { mapState } from "vuex";
export default {
    data() {
        return {
        };
    },
    computed: {
        ...mapState("layout", {
            widgets: (state) => {
                const list = state.widgets.filter((v) => v.show)
                list.push({
                    component:"add",
                    id:new Date().getTime(),
                    width:1,
                    height:1,
                    title:"添加",
                    prop:{}
                })
                return list
            },
        }),
    },
    mounted() {
        this.$nextTick(() => {
            const container = document.querySelector(".grid-components-container")
            new Sortable(container, {
                animation: 150,
                ghostClass: 'blue-background-class',
                onEnd: function (evt) {
                    console.log(evt)
                },
            })
        });
    },
};
</script>
<style scoped lang="less">
@card-title-height: 30px;
.grid-components-container {
    width: 100%;
    height: 100%;
    display: grid;
    user-select: none;
    gap: 30px;
    grid-template-columns: repeat(auto-fill, 80px);
    grid-template-rows: repeat(auto-fill, 80px);
    .item {
        width: 100%;
        height: 80px;
        cursor: pointer;
        position: relative;
        grid-column: span 2;
        grid-row: span 2;
        .title {
            position: absolute;
            top: 100%;
            height: @card-title-height;
            width: 100%;
            text-align: center;
            color: #ffffffae;
            font-size: 12px;
            font-weight: bold;
            line-height: @card-title-height;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
    }
}
</style>
