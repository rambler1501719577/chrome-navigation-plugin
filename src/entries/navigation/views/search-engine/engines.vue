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
            width="600px"
            height="380px"
            :appendToBody="true"
        >
            <rambler-alert>
                <span style="font-weight: bold"
                    >举例添加【哔哩哔哩】搜索引擎的几个步骤</span
                >
                <ul>
                    <li class="item">1. 打开哔哩哔哩在搜索栏输入：搜索</li>
                    <li class="item">2. 复制搜索结果页面地址</li>
                    <li class="item">
                        格式：<br /><span style="color: #687bce"
                            >https://search.bilibili.com/all?keyword=%E6%90%9C%E7%B4%A2</span
                        >
                    </li>
                </ul>
            </rambler-alert>
            <div class="form">
                <div class="form-item">
                    <p class="label">
                        名称<span class="err">{{ nameValidateResult }}</span>
                    </p>
                    <input type="text" v-model="data.name" />
                </div>
                <div class="form-item search">
                    <p class="label">
                        搜索地址<span class="err">{{
                            searchUrlValidateResult
                        }}</span>
                    </p>
                    <input type="text" v-model="data.searchUrl" />
                    <favicon
                        class="favicon"
                        :size="20"
                        :url="iconUrl"
                    ></favicon>
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
                <li class="popup-menu-item" @click="editEngine">编辑</li>
                <li class="popup-menu-item" @click="deleteEngine">删除</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { isUrl } from "@/utils";
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
            nameValidateResult: "", // 验证结果
            searchUrlValidateResult: "", //搜索字符串验证结果
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
        iconUrl() {
            if (!isUrl(this.data.searchUrl)) {
                return "";
            }
            const url = new URL(this.data.searchUrl);
            return url.origin;
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
            this.$ramblerNotification.success(`删除成功`);
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
        validate() {
            if (!this.data.name) {
                this.nameValidateResult = "名称不能为空";
                return false;
            } else {
                this.nameValidateResult = "";
            }
            if (!this.data.searchUrl) {
                this.searchUrlValidateResult = "搜索地址不能为空";
                return false;
            } else {
                this.searchUrlValidateResult = "";
            }
            const decodedUrl = decodeURI(this.data.searchUrl);
            if (decodedUrl.indexOf("搜索") == -1) {
                this.searchUrlValidateResult =
                    "未找到【搜索】关键字，请按照要求添加";
                return false;
            } else {
                this.searchUrlValidateResult = "";
            }
            return true;
        },
        confirm() {
            if (this.validate()) {
                // 解析查询url，获取主机
                const data = {
                    name: this.data.name,
                    searchUrl: decodeURI(this.data.searchUrl),
                    id: uuidv4(),
                };
                this.data.name = "";
                this.data.searchUrl = "";
                // 同步到vuex
                this.update({
                    type: this.editType,
                    data: data,
                });
                if (this.editType == "add") {
                    this.$ramblerNotification.success(
                        `添加【${data.name}】搜索引擎成功`
                    );
                } else {
                    this.$ramblerNotification.success(`保存成功`);
                }
                this.dialogVisible = false;
            }
        },
        resetValidate() {
            this.nameValidateResult = "";
            this.searchUrlValidateResult = "";
        },
        // 重置表单
        resetForm() {
            this.data.name = "";
            this.data.searchUrl = "";
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
@import url("./styles/engines.less");
@import url("../../../../styles/form.less");
</style>
