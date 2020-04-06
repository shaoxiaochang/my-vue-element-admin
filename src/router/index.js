import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// 所有權限的通用路由表
export const constantRoutes = [
    {
        path: '/login',
        component: () => import('@/views/login/index')
    },
    {
        path: '/',
        component: Layout
    }
]

// 實例化vue的時候只掛載constantRoutes
export default new Router({
    routes: constantRoutes
});
