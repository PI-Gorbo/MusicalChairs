import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import MenuPage from "../views/MenuLayout.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        component: MenuPage,
        children: [
            {
                path: "",
                redirect: "/home",
            },
            {
                name: "Home",
                path: "home",
                component: () => import("@/views/Tab1Page.vue"),
            },
            {
                name: "Entries",
                path: "entires",
                component: () => import("@/views/Tab2Page.vue"),
            },
            {
                name: "Settings",
                path: "settings",
                component: () => import("@/views/Tab3Page.vue"),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
