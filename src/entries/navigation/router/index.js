import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("../views/Home.vue")
    },
    {
        path: "*",
        name: "error",
        component: () => import("../views/404")
    }
];

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    console.log("beforeEach");
    next();
});

export default router;
