<template>
    <div class="search-engines-container">
        <!-- 搜索引擎 -->
        <div class="engine-list">
            <ul>
                <li
                    v-for="(engine, index) of engines"
                    :key="index"
                    :class="{
                        selected: engine.name == currentEngine,
                        'engine-item': true,
                    }"
                    @click="handleEngineClick(engine)"
                    @contextmenu="openContextMenu($event, engine)"
                >
                    {{ engine.name }}
                </li>
                <li @click="showDialog" @contextmenu.stop.prevent="doNothing">
                    +
                </li>
            </ul>
        </div>
        <rambler-dialog
            :visible.sync="dialogVisible"
            name="addSearchEngine"
            title="添加搜索引擎"
            :draggable="true"
            width="500px"
            height="220px"
        >
            <div class="form">
                <div class="form-item">
                    <p class="label">名称</p>
                    <input type="text" v-model="data.name" />
                </div>
                <div class="form-item">
                    <p class="label">搜索地址</p>
                    <input type="text" v-model="data.searchUrl" />
                </div>
                <div class="footer">
                    <rambler-button @click="cancel">取消</rambler-button>
                    <rambler-button type="primary" @click="confirm"
                        >确定</rambler-button
                    >
                </div>
            </div>
        </rambler-dialog>
        <div
            class="search-popup-menu"
            :style="popupStyle"
            v-show="showPopupmenu"
        >
            <ul>
                <li class="popup-menu-item" @click="deleteEngine">删除</li>
                <li class="popup-menu-item" @click="editEngine">编辑</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
const { v4: uuidv4 } = require("uuid");
export default {
    name: "SearchEngine",
    data() {
        return {
            dialogVisible: false,
            data: {
                name: "",
                searchUrl: "",
            },
            choosenContextMenu: {},
            popupPosition: {
                left: 0,
                top: 0,
            },
            editType: "add", // 搜索引擎编辑类型、add | update
            showPopupmenu: false, // 搜索引擎上鼠标右键弹出的popup-menu
        };
    },
    computed: {
        ...mapGetters(["engines", "currentEngine"]),
        popupStyle() {
            return {
                left: this.popupPosition.left + "px",
                top: this.popupPosition.top + "px",
            };
        },
    },
    methods: {
        ...mapActions("engine", ["updateCurrentEngine", "update"]),
        editEngine() {
            this.editType = "update";
            this.dialogVisible = true;
            this.data.name = this.choosenContextMenu.name;
            this.data.searchUrl = this.choosenContextMenu.searchUrl;
        },
        deleteEngine() {
            this.update({
                type: "delete",
                data: {
                    id: this.choosenContextMenu.id,
                },
            });
        },
        // 鼠标右键
        openContextMenu(e, choosen) {
            e.stopPropagation();
            e.preventDefault();
            this.showPopupmenu = true;
            const { clientX, clientY } = e;
            this.popupPosition.left = clientX;
            this.popupPosition.top = clientY;
            this.choosenContextMenu = choosen;
        },
        confirm() {
            // 解析查询url，获取主机
            const data = {
                name: this.data.name,
                searchUrl: this.data.searchUrl,
                id: uuidv4(),
            };
            this.data.name = "";
            this.data.searchUrl = "";
            // 同步到vuex
            this.update({
                type: this.editType,
                data: data,
            });
            this.dialogVisible = false;
        },
        cancel() {
            this.dialogVisible = false;
            this.data.name = "";
            this.data.searchUrl = "";
        },
        showDialog() {
            this.editType = "add";
            this.dialogVisible = true;
            this.data.name = "";
            this.data.searchUrl = "";
        },
        handleEngineClick: function (engine) {
            this.updateCurrentEngine(engine.name);
        },
        doNothing() {
            return;
        },
    },
    mounted() {
        document.addEventListener("click", (e) => {
            const paths = e.path || (e.composedPath && e.composedPath());
            if (
                ![].find.call(paths, (item) => item.className == "engine-item")
            ) {
                this.showPopupmenu = false;
            }
        });
    },
};
</script>
<style lang="less" scoped="scoped">
@import url("../styles/engines.less");
</style>
