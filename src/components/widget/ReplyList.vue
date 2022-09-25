<template>
    <div class="reply-container">
        <div v-for="item of list" :key="item.id">
            <div class="item" @mouseenter="enterEvent($event)" @mouseleave="leaveEvent($event)">
                <div class="avatar">
                    <img :src="getAvatar(item)" alt="">
                </div>
                <div class="con">
                    <div class="info">
                        <span class="username">{{item.username}}</span>
                        <span class="author" v-if="item.role == '作者'">{{item.role}}</span>
                        <span class="visitor" v-else>{{item.role}}</span>
                        <span class="system">{{item.explore}}</span>
                        <span class="system">{{item.system}}</span>
                        <span class="time">{{item.time | timeToDistance}}</span>
                    </div>
                    <div class="content">
                        <p>{{item.content}}</p>
                        <span v-if="canReply" class="answer" @click="replyTo(item)">回复</span>
                    </div>
                </div>
            </div>
            <div v-if="hasChild(item)" class="parent">
                <ReplyList :canReply="canReply" @reply="listen" :list="item.children"></ReplyList>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ReplyList',
        props: {
            list: Array,
            canReply: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {};
        },
        components: {},
        methods: {
            hasChild: function(item) {
                if (item.children !== null && item.children.length > 0) {
                    return true;
                }
            },
            getAvatar: function(item) {
                return `http://q1.qlogo.cn/g?b=qq&nk=${item.qq}&s=100`;
            },
            enterEvent: function(e) {
                if (this.canReply) {
                    e.target.getElementsByClassName("answer")[0].style.display = "block"
                }
            },
            leaveEvent: function(e) {
                if (this.canReply) {
                    e.target.getElementsByClassName("answer")[0].style.display = "none"
                }
            },
            replyTo: function(item) {
                this.$emit('reply', item);
            },
            listen: function(item) {
                this.$emit('reply', item);
            }
        },
        created() {},
    };
</script>
<style lang="stylus" scoped>
.reply-container
    .item
        display flex
        margin-bottom 45px
        .avatar
            width 70px
            height 70px
            margin-right 15px
            overflow hidden
            img
                width 70px
                height 70px
                border-radius 50%
        .con
            flex 1
            .info
                margin-bottom 15px
                .username
                    line-height 25px
                    display inline-block
                span
                    margin-right 15px
                    color #ed690a
                    font-weight bold
                    border-radius 3px
                .system
                    background-color #006666
                    color #fff
                    font-size 14px
                    padding 5px 8px
                .author
                    background-color #262b66
                    color #fff
                    font-size 14px
                    padding 5px 8px
                .visitor
                    background-color #179b1c
                    color #fff
                    font-size 14px
                    padding 5px 8px
                .time
                    float right
            .content
                font-size 20px
                font-size #333
                position relative
                p
                    line-height 30px
                .answer
                    display none
                    float right
                    font-size 16px
                    line-height 30px
                    color #949494
                    position absolute
                    bottom 0
                    right 10px
                    cursor url('../../assets/cur/pointer.cur'),auto
    .parent
        padding-left 55px
        margin-bottom 60px
</style>