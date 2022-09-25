<template>
    <div class="rambler-hot-article">
        <div class="head">
            <h3>
                <i class="iconfont iconbiaoqian"></i>
                我的标签
            </h3>
        </div>
        <div class="tag-list">
            <ul>
                <li v-for="item of tags" :key="item.id">
                    <a @click="toDetail(item)" :style="item.styleObj">{{ item.name }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { randomNum } from "@/utils/index";
export default {
    data() {
        return {
            tags: []
        };
    },
    methods: {
        getTagList: function() {
            let tags = this.$store.getters.tags;
            // random用来保存每次产生的随机数, 保证没有重复的
            let randomArr = [];
            // 先定义好一个颜色数组, 通过产生随机数字作为索引就产生了随机的颜色
            for (let i = 0; i < tags.length; i++) {
                let num;
                do {
                    num = randomNum(0, tags.length - 1);
                } while (randomArr.indexOf(num) !== -1);
                randomArr.push(num);
                let color = this.$settings.colorArr[num];
                // 根据标签对应文章多少控制字体大小
                let fontSize = (tags[i].num * 5 + 100) / 100;
                if (tags[i].num < 10)
                    tags[i]["styleObj"] = {
                        color: color,
                        fontSize: fontSize + "rem"
                    };
            }
            this.tags = tags;
        },
        toDetail: function(item) {
            let path = `/tags/${item.name}`;
            this.$router.push(path);
        }
    },
    created() {
        this.getTagList();
    },
    mounted() {}
};
</script>

<style lang="stylus" scoped>
.rambler-hot-article
    height auto
    .head
        padding-top 10px
        line-height 40px
        margin-left 15px
        font-size 18px
        font-weight 600
        h3
            i
                margin-right 4px
                font-size 18px
    .tag-list
        font-size 16px
        padding 20px
        ul
            li
                display inline-block
                margin 0 7px 10px 0
                vertical-align bottom
                a
                    cursor url('../..//assets/cur/pointer.cur'),auto
                    text-decoration none
                    vertical-align bottom
                a:hover
                    color #006868!important
</style>
