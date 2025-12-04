import Products from "../pages/Products.vue"
import Cart from "../pages/Cart.vue"
import NotFound from "../pages/NotFound.vue"
import { createRouter, createWebHistory } from "vue-router"

const routes= [
    {
        path: "/",
        name: "Home",
        component: Products
    },
    {
        path: "/cart",
        name: "Cart",
        component: Cart
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: NotFound
    }
]

export const router= createRouter({
    history: createWebHistory(),
    routes
})