<template>
    <div class="search-container">
        <!-- 搜索引擎列表 -->
        <div class="engine-list">
            <ul>
                <li
                    v-for="(engine, index) of engines"
                    :key="index"
                    :class="{ selected: engine.name == currentEngine.name }"
                    @click="switchEngine(engine)"
                >
                    {{ engine.label }}
                </li>
            </ul>
        </div>
        <!-- 搜索表单 -->
        <div class="search-form">
            <input
                id="search"
                type="text"
                v-model="keywords"
                autocomplete="off"
                placeholder="keydown keywords to search..."
                @keydown.enter="search"
            />
            <img
                class="search-icon"
                src="../../../assets/images/search.png"
                height="100%"
                alt=""
            />
            <div class="search-result">
                <ul></ul>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
    name: "Search",
    components: {},
    data() {
        return {
            currentEngine: "",
            keywords: ""
        };
    },
    computed: {
        ...mapGetters("setting", ["engines"])
    },
    methods: {
        switchEngine: function(engine) {
            this.currentEngine = engine;
        },
        search: function() {
            window.open(
                `${this.currentEngine.searchUrl}${this.keywords}`,
                "_self"
            );
            this.keywords = "";
        }
    },
    created() {
        this.currentEngine = this.engines[0];
    }
};
</script>
<style lang="less" scoped="scoped">
.search-container {
    .engine-list {
        overflow: hidden;
        ul {
            list-style: none;
            display: flex;
            margin-bottom: 10px;
            padding-left: 25px;
            li {
                background-color: #fff;
                color: #333;
                font-size: 14px;
                height: 35px;
                padding: 0 15px;
                line-height: 35px;
                user-select: none;
                margin-right: 10px;
                transition: all 0.5s;
                cursor: pointer;
            }
            li.selected {
                background-color: #333;
                color: #fff;
            }
        }
    }
    .search-form {
        box-sizing: border-box;
        padding: 0 25px;
        width: 100%;
        height: 50px;
        border-radius: 10px;
        background-color: #fff;
        position: relative;
        #search {
            display: block;
            width: 100%;
            border: none;
            outline: none;
            height: 50px;
            line-height: 50px;
            font-size: 17px;
            box-sizing: border-box;
            border-bottom: 1px solid transparent;
        }

        #search::placeholder {
            color: #999;
        }

        .search-icon {
            position: absolute;
            right: 25px;
            top: 12px;
            width: 25px;
            height: 25px;
            cursor: pointer;
        }
        .search-result {
            box-sizing: border-box;
            position: absolute;
            top: 55px;
            left: 0;
            height: 0;
            max-height: 400px;
            overflow: hidden;
            overflow: hidden auto;
            width: 100%;
            border-radius: 10px;
            transition: all 0.5s ease-in-out;
            background-color: #fff;
            ul {
                list-style: none;
                li {
                    height: 50px;
                    font-size: 18px;
                    cursor: pointer;
                    padding-left: 10px;
                    a {
                        display: block;
                        text-decoration: none;
                        color: #333;
                        line-height: 50px;
                        user-select: none;
                    }
                }
                li:hover {
                    background-color: #ddd;
                }
            }
        }
    }
}
</style>
