<template>
    <div class="finding-container">
        <ul>
            <li @click="ScrollTop(0)" v-show="showBackTop"><i class="fa fa-arrow-up"></i></li>
            <li @click="toggleSidebar">
                <i v-if="showSidebar" class="fa fa-toggle-on"></i>
                <i v-else class="fa fa-toggle-off"></i>
            </li>
        </ul>
        <div class="setting-panel" v-show="showSetting">
            <!-- <div class="header" :style="theme[currentTheme].backgroundColor">
                <span :style="theme[currentTheme].color">设置</span>
                <p @click="showSetting = false" type="md-close"></p>
            </div>
            <div class="content">
                <div class="flex">
                    <span>夜间模式：</span>
                    <i-switch v-model="mode" @on-change="switchTheme" />
                </div>
                <div class="flex">
                    <span>字体大小</span>
                    <ButtonGroup>
                        <Button :type="fontSize == 'S' ? 'primary' : 'default'" @click="changeFontSize('S')">小</Button>
                        <Button :type="fontSize == 'M' ? 'primary' : 'default'" @click="changeFontSize('M')">中</Button>
                        <Button :type="fontSize == 'L' ? 'primary' : 'default'" @click="changeFontSize('L')">大</Button>
                    </ButtonGroup>
                </div>
            </div> -->
        </div>
    </div>
</template>

<script>
    import {
        scrollToTop
    } from '@/utils/index';
    import {
        mapState
    } from 'vuex';
    export default {
        name: 'finding',
        data() {
            return {
                scrollTop: 0,
                showBackTop: false,
                showSetting: true,
                mode: true,
                fontSize: 'S',
                showSidebar: false
            };
        },
        watch: {
            '$store.getters.showSidebar': function(val) {
                this.showSidebar = val;
            }
        },
        computed: {
            ...mapState({
                currentTheme: state => state.theme.currentTheme,
                theme: state => state.theme
            })
        },
        methods: {
            // 隐藏侧边栏
            toggleSidebar: function() {
                this.showSidebar = !this.showSidebar;
                this.$store.dispatch("setting/toggleSidebar", {
                    showSidebar: this.showSidebar
                })
            },
            // 切换主题
            switchTheme: function(status) {
                if (status) {
                    window.document.documentElement.setAttribute('data-theme', 'dark');
                    this.$store.commit('theme/switchTheme', 'dark');
                } else {
                    window.document.documentElement.setAttribute('data-theme', 'bright');
                    this.$store.commit('theme/switchTheme', 'bright');
                }
            },
            // 向下滚动30px后显示回到顶部按钮
            handleScrollEvent: function() {
                this.scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                if (this.scrollTop > 30) {
                    this.showBackTop = true;
                } else {
                    this.showBackTop = false;
                }
            },
            // 切换字体大小
            changeFontSize: function(size) {
                this.fontSize = size;
                if (size == 'S') {
                    this.$store.commit('theme/changeFontSize', this.$settings.smallFontSize);
                } else if (size == 'M') {
                    this.$store.commit('theme/changeFontSize', this.$settings.middleFontSize);
                } else {
                    this.$store.commit('theme/changeFontSize', this.$settings.largeFontSize);
                }
            },
            toggleSettingPanel: function() {
                this.showSetting = !this.showSetting;
            },
            // 回到顶部
            ScrollTop: function(offsetTop) {
                scrollToTop(offsetTop);
            }
        },
        mounted() {
            window.addEventListener('scroll', this.handleScrollEvent);
            this.showSidebar = this.$store.getters.showSidebar;
        }
    };
</script>
<style scoped="scoped" lang="stylus">
.finding-container
    ul
        li
            list-style none
            height 40px
            width 40px
            cursor url('../assets/cur/pointer.cur'),auto
            color #fff
            background-color #516666
            i
                display block
                height 40px
                text-align center
                line-height 40px
                font-size 20px
                transition all 0.5s
    .setting-panel
        font-size 15px
        border-radius 8px
        position fixed
        background-color #fff
        width 300px
        bottom 30px
        right 80px
        overflow hidden
        .header
            align-items center
            padding 10px
            display flex
            justify-content space-between
            i
                cursor url('../assets/cur/pointer.cur'),auto
        .content
            padding 15px
            .flex
                display flex
                justify-content space-between
                align-items center
                margin-bottom 20px
</style>
