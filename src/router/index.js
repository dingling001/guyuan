import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        redirect: '/index'
    },
    {
        path: '/index',
        name: 'msg',
        meta:{
          title:'讲解服务评价'
        },
        component: () => import(/* webpackChunkName: "about" */ '../views/index')
    },
    {
        path: '/home',
        name: 'home',
        meta:{
            title:'讲解服务评价'
        },
        component: () => import(/* webpackChunkName: "about" */ '../views/Home')
    },

];

const router = new VueRouter({
    base: process.env.BASE_URL,
    routes
})

export default router
