import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "../layout/index";
import store from "../store";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "",
        component: Layout,
        redirect: "/index",
        children: [
            {
                path: "/index",
                name: "blog",
                component: () => import("@/views/Home/Home"),
                meta: {}
            }
        ]
    },
    {
        path: "*",
        name: "error",
        component: () => import("@/views/404")
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach(async (to, from, next) => {
    // axios.all是静态方法不属于实例， 所以不能用request
    if (!hasCachedData()) {
        const res = await store.dispatch("basic/saveBasicInfo");
        if (res) {
            next();
        } else {
            console.log("失败");
        }
    } else {
        next();
    }
});

const hasCachedData = () => {
    const res =
        store.getters.info != "" &&
        store.getters.hotArticle != "" &&
        store.getters.tags != "" &&
        store.getters.menu != "";
    return res;
};

export default router;
