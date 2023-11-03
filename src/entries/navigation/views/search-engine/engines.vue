<template>
    <div class="search-engines-container">
        <!-- 搜索引擎 -->
        <div class="engine-list">
            <ul>
                <li
                    v-for="(engine, index) of engines"
                    :key="index"
                    :class="{
                        selected: engine.title == currentEngine,
                        'engine-item': true,
                    }"
                    @click="handleEngineClick(engine)"
                    @contextmenu="openContextMenu($event, engine)"
                >
                    {{ engine.title }}
                </li>
                <li @click="showDialog" @contextmenu.stop.prevent="() => {}">
                    +
                </li>
            </ul>
        </div>
        <rambler-dialog
            :visible.sync="dialogVisible"
            name="addSearchEngine"
            title="添加搜索引擎"
            :draggable="true"
            @close="resetForm"
            width="600px"
            height="380px"
            :appendToBody="true"
        >
            <div class="engine-edit-container">
                <rambler-alert style="margin-bottom: 20px">
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

                <el-form
                    :model="form"
                    status-icon
                    :rules="rules"
                    ref="form"
                    label-width="40px"
                >
                    <el-form-item label="标题" prop="title">
                        <el-input
                            v-model="form.title"
                            autocomplete="off"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="searchUrl">
                        <el-input v-model="form.searchUrl" autocomplete="off">
                        </el-input>
                        <favicon
                            class="favicon"
                            :size="20"
                            :url="iconUrl"
                        ></favicon>
                    </el-form-item>
                </el-form>

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
export default {
    name: "SearchEngine",
    data() {
        const titleValidator = (rule, title, cb) => {
            if (!title) {
                return cb(new Error("标题不能为空"));
            }
            cb();
        };
        const urlValidator = (rule, searchUrl, cb) => {
            if (!searchUrl) {
                return cb(new Error("标题不能为空"));
            }
            const decodedUrl = decodeURI(searchUrl);
            if (decodedUrl.indexOf("搜索") == -1) {
                return cb(
                    new Error("未在地址中找到【搜索】关键字，请按照要求添加")
                );
            }
            cb();
        };
        return {
            dialogVisible: false,
            form: {
                title: "",
                searchUrl: "",
            },
            rules: {
                title: [{ validator: titleValidator, trigger: "blur" }],
                searchUrl: [{ validator: urlValidator, trigger: "blur" }],
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
        iconUrl() {
            if (!isUrl(this.form.searchUrl)) {
                return "";
            }
            const url = new URL(this.form.searchUrl);
            return url.origin;
        },
    },
    methods: {
        ...mapActions("engine", [
            "updateCurrentEngine",
            "update",
            "add",
            "delete",
        ]),
        resetForm() {
            this.form.title = "";
            this.form.searchUrl = "";
        },
        editEngine() {
            this.editType = "update";
            this.dialogVisible = true;
            this.form.title = this.choosenContextMenu.title;
            this.form.searchUrl = this.choosenContextMenu.searchUrl;
        },
        deleteEngine() {
            this.delete(this.choosenContextMenu.id)
                .then(() => {
                    this.$ramblerNotification.success(`删除成功`);
                })
                .catch((e) => {
                    this.$ramblerNotification.danger(e);
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
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    const data = {
                        title: this.form.title,
                        searchUrl: decodeURI(this.form.searchUrl),
                    };
                    const type = this.editType == "add" ? "添加" : "编辑";
                    try {
                        if (this.editType == "add") {
                            await this.add(data);
                        } else {
                            await this.update(data);
                        }
                        this.$ramblerNotification.success(
                            `${type}【${data.title}】搜索引擎成功`
                        );
                    } catch (e) {
                        this.$ramblerNotification.danger(
                            `${type}失败, 服务端异常`
                        );
                    } finally {
                        this.dialogVisible = false;
                    }
                }
            });
        },
        cancel() {
            this.dialogVisible = false;
        },
        showDialog() {
            this.editType = "add";
            this.dialogVisible = true;
            this.resetForm();
        },
        handleEngineClick: function (engine) {
            this.updateCurrentEngine(engine.title);
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
</style>
<style lang="less">
.engine-edit-container {
    padding: 20px;
    .el-form {
        .favicon {
            position: absolute;
            right: 30px;
            bottom: 9px;
            user-select: none;
        }
    }

    .footer {
        display: flex;
        justify-content: flex-end;

        .rambler-button {
            margin-left: 8px;
        }
    }
}
</style>
