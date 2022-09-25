<template>
    <div class="rambler-about">
        <div class="header">
            <img src="../..//assets/images/header.jpg" alt="" />
        </div>
        <div class="introduction">
            <h1>Rambler-Designer</h1>
            <p>一个喜欢听电音的码农</p>
        </div>
        <div class="statistics">
            <dl>
                <dt>文章</dt>
                <dd>{{ info.article }}</dd>
            </dl>
            <dl>
                <dt>分类</dt>
                <dd>{{ info.classify }}</dd>
            </dl>
            <dl>
                <dt>标签</dt>
                <dd>{{ info.tags }}</dd>
            </dl>
        </div>
        <div class="contact">
            <div href="" class="icon-box" title="csdn地址">
                <i @click="toCSDN" class="iconfont iconcsdn"></i>
            </div>
            <div class="icon-box" title="github">
                <i @click="toGithub" class="iconfont icongithub"></i>
            </div>
            <div class="icon-box" title="邮箱">
                <i @click="sendMail" class="iconfont iconyouxiang"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            info: {}
        };
    },
    methods: {
        sendMail: function(){
            window.open("http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&email=1501719577@qq.com","_target");
        },
        toCSDN: function(){
            window.open("https://blog.csdn.net/rambler_designer","_target");
        },
        toGithub: function(){
            window.open("https://github.com/rambler1501719577","_target");
        }
    },
    created() {
        this.info = this.$store.getters.info;
    }
};
</script>
<style lang="stylus" scoped>
.rambler-about
    padding-top 30px
    height 300px
    .header
        width 70px
        height 70px
        margin 0 auto
        margin-bottom 30px
        img
            width 100%
            border-radius 50%
    .introduction
        text-align center
        margin-bottom 20px
        h1
            color #4C4948
            font-size 22px
        p
            color #4C4948
            font-family "微软雅黑"
            margin-top 6px
            font-size 14px
    .statistics
        display flex
        justify-content space-around
        dl
            dt
                font-size 15px
            dd
                text-align center
                margin-top 10px
                font-size 20px
    .contact
        margin-top 15px
        display flex
        justify-content space-around
        .icon-box
            i
                font-size 30px
                cursor url('../../assets/cur/pointer.cur'),auto
            .iconcsdn
                color red
            .icongithub
                color #000
            .iconyouxiang
                color #0a8af9
</style>
