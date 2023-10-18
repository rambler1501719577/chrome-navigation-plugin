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
                :component="item.component"
                :id="item.id"
                :width="item.width"
                :height="item.height"
                :prop="item.props"
                :url="item.url"
                :title="item.title"
            ></LazyWidget>
            <p class="title">{{ item.title }}</p>
        </div>
    </div>
</template>
<script lang="javascript">
import { mapState } from "vuex";
import LazyWidget from "./grid-card";
export default {
    data() {
        return {
            layout: [],
        };
    },
    computed: {
        ...mapState("layout", {
            widgets: (state) => state.widgets.filter((v) => v.show),
            widgetSize: (state) => state.widgetSize,
            gap: (state) => state.gap,
            column: (state) => state.column,
            row: (state) => state.row,
        }),
        ...mapState("setting", {
            fixedBarWidth: (state) => state.fixedBarWidth,
            boxPadding: (state) => state.boxPadding,
        }),
    },
    watch: {
        widgets: function (newState) {
            this.calcLayout();
        },
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            this.calcLayout();
            window.addEventListener("resize", this.calcLayout);
        });
    },
    components: {
        LazyWidget,
    },
    methods: {
        calcColumns: function (boxWidth, widgetSize, gap) {
            // boxWidth = (columns * widgetSize) + (columns - 1) * gap
            return Math.floor((boxWidth + gap) / (widgetSize + gap));
        },

        // return how many rows that container can cantain
        calcRows: function (boxHeight, widgetSize, gap) {
            // boxHeight = (rows * widgetSize) + (rows - 1) * gap
            return Math.floor((boxHeight + gap) / (widgetSize + gap));
        },

        getPositionFromMap: function (card, column, row, positionMap) {
            // 计算每个卡片在[地图]上的索引
            const w = card.width,
                h = card.height;
            if (w > column) {
                throw new Error(
                    "Card width is larger than column, consider enlarge your column and refresh page"
                );
            }
            let accessible = false;
            for (let i = 0; i < row; i++) {
                for (let j = 0; j < column; j++) {
                    // 遍历 '地图' 检查将占据的单元格是否可用， 可用则返回左上角索引，否则返回-1
                    //i对应行，j对应列
                    outer: if (j + w <= column && i + h <= row) {
                        for (let m = 0; m < h; m++) {
                            for (let n = 0; n < w; n++) {
                                if (positionMap[i + m][j + n] == 1) {
                                    break outer;
                                }
                            }
                        }
                        accessible = true;
                    }
                    if (accessible) {
                        return { x: i, y: j };
                    }
                }
            }
            return -1;
        },

        updatePositionMap: function (positionMap, position, w, h) {
            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    positionMap[position["x"] + i][position["y"] + j] = 1;
                }
            }
        },

        reCalcActualHeight: function (positionMap) {
            let actualRow = 0;
            for (let i = 0; i < positionMap.length; i++) {
                const row = positionMap[i];
                let flag = false;
                for (let j = 0; j < row.length; j++) {
                    if (row[j] == 1) {
                        flag = true;
                        break;
                    }
                }
                flag && actualRow++;
            }
            return actualRow;
        },

        getProcessedCardList: function (rawCardList, row, column) {
            const positionMap = [];
            for (let i = 0; i < row; i++) {
                positionMap.push([]);
            }
            const cardList = [];
            for (let i = 0; i < rawCardList.length; i++) {
                const card = rawCardList[i];
                const position = this.getPositionFromMap(
                    card,
                    column,
                    row,
                    positionMap
                );
                if (position !== -1) {
                    // 计算gridArea
                    const gridArea = `${position["x"] + 1} / ${
                        position["y"] + 1
                    } / ${position["x"] + card.height + 1} / ${
                        position["y"] + card.width + 1
                    }`;
                    // 更新地图
                    this.updatePositionMap(
                        positionMap,
                        position,
                        card.width,
                        card.height
                    );
                    // 组装数据
                    cardList.push({
                        ...card,
                        position,
                        gridArea,
                    });
                } else {
                    // 需要扩容
                    row++;
                    positionMap.push([]);
                    // 回退重新检索
                    i--;
                }
            }
            const actualRow = this.reCalcActualHeight(positionMap);
            return {
                cardList: cardList.map((item) => ({
                    id: item.id,
                    component: item.component,
                    gridArea: item.gridArea,
                    width: item.width,
                    height: item.height,
                    title: item.title,
                    props: item.props,
                    url: item.url,
                })),
                row: actualRow,
                column,
            };
        },

        getSuitableRowAndColumn(boxWidth, boxHeight) {
            const calcColumn = this.calcColumns(
                boxWidth,
                this.widgetSize,
                this.gap
            );
            const calcRow = this.calcRows(boxHeight, this.widgetSize, this.gap);
            return {
                _column: Math.min(calcColumn, this.column),
                _row: Math.min(calcRow, this.row),
            };
        },
        calcLayout: function () {
            // 为了让用户更小程度上配置布局, 采用自流平思路, 直接铺满整个思路, 两侧预留出部分padding
            // 根据整个屏幕宽度动态计算每行能容纳多少个元素, 需要渲染多少行, 超出高度滚动或者分页
            const box = document.querySelector(".grid-components-container");
            const containerWidth =
                document.body.clientWidth -
                this.fixedBarWidth -
                this.boxPadding * 2;

            // 根据容器计算每行容纳多少个元素, 与用户配置的进行比较, 取二者较小值作为最终值
            const { _column, _row } = this.getSuitableRowAndColumn(
                containerWidth,
                box.clientHeight
            );

            // 将数据处理成grid布局可识别的列表, 添加布局属性
            // row和column也是通过二维数组模拟填充后得到的真实行列数
            const { cardList, column, row } = this.getProcessedCardList(
                [
                    ...this.widgets,
                    {
                        width: 1,
                        height: 1,
                        component: "add",
                        title: "添加",
                    },
                ],
                _row,
                _column
            );

            // 根据最终row和column设定容器属性, 如grid行列数, 间隔等
            this.setupContainer(column, row);
            this.layout = cardList;
        },
        setupContainer: function (column, row) {
            const container = document.querySelector(
                ".grid-components-container"
            );
            const width = column * this.widgetSize + (column - 1) * this.gap;
            const height =
                (row - 1) * (this.widgetSize + this.gap) + this.widgetSize;
            container.style.width = width + "px";
            container.style.height = height + "px";
            container.style.gridTemplateColumns = `repeat(${column}, 1fr)`;
            container.style.gridTemplateRows = `repeat(${row}, 1fr)`;
            container.style.gap = this.gap + "px";
        },
    },
};
</script>
<style scoped lang="less">
@card-title-height: 30px;
.grid-components-container {
    width: 100%;
    height: 100%;
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(14, 1fr);
    grid-template-rows: repeat(4, 1fr);
    .item {
        cursor: pointer;
        position: relative;
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
