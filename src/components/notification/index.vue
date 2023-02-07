<template>
    <div class="rambler-notification-container">
        <transition-group name="list" tag="div">
            <div
                v-for="notify of notifyList"
                :key="notify.id"
                class="notify-item-wrapper"
            >
                <div :class="`notify-${notify.type} notify-item`">
                    <div class="icon">
                        <rambler-icon
                            :class="`icon-${notify.type}`"
                            :name="getIcon(notify)"
                        ></rambler-icon>
                    </div>
                    <div class="content">
                        <div class="title" v-if="notify.title">
                            {{ notify.title }}
                        </div>
                        <div class="text">{{ notify.message }}</div>
                    </div>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script>
import { event } from "./event";
export default {
    name: "RamblerNotification",
    props: {},
    data() {
        return {
            notifyList: [],
        };
    },
    computed: {},
    methods: {
        // 获取图标名称
        getIcon(notify) {
            if (!notify || !notify.type || !(notify.type == "success")) {
                return "notify-common";
            }
            return "notify-ok";
        },

        addMessageItem(params) {
            if (!params.type) params.type = "info";
            this.notifyList.push(params);
            setTimeout(() => {
                this.notifyList.shift();
            }, 2000);
        },
    },
    mounted() {
        event.$on("add", this.addMessageItem);
    },
};
</script>
<style></style>
<style lang="less" scoped>
.rambler-notification-container {
    z-index: 999;
    position: fixed;
    // left: 50%;
    // transform: translateX(-50%);
    right: 15px;
    top: 15px;
    .list-enter-active,
    .list-leave-active {
        transition: all 0.8s;
    }
    .list-enter,
    .list-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }
    .notify-item-wrapper {
        margin-bottom: 15px;
        .notify-item {
            padding: 10px 30px 10px 10px;
            display: flex;
            align-items: center;
            border-radius: 5px;
            .icon {
                width: 40px;
                height: 40px;
                margin-right: 7px;
                padding: 7px;
                .rambler-icon {
                    font-size: 26px;
                }
            }
            .content {
                font-size: 14px;
                .title {
                    margin-bottom: 8px;
                }
            }
        }
        .notify-success {
            background: #e8f9f0;
            color: #2c3e50;
            .icon-success {
                fill: #15c371;
            }
        }
        .notify-info {
            background: #edf2fc;
            color: #909399;
            .icon-info {
                fill: gray;
            }
        }
        .notify-danger {
            background: #ffe8e6;
            color: #db2828;
            .icon-danger {
                fill: #c71111;
            }
        }
        .notify-warn {
            background: #fdf6ec;
            color: #e6a23c;
            .icon-warn {
                fill: rgb(230, 150, 31);
            }
        }
    }
}
</style>
