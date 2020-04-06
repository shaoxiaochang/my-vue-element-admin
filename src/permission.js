import router from './router'
import { getToken } from '@/utils/auth' // get token from cookie

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

// router權限控制
router.beforeEach((to, from, next) => {
    // determine whether the user has logged in
    const hasToken = getToken()

    if (hasToken) { // 判断是否有token
        if (to.path === '/login') {
            next({ path: '/' });
        } else {
            next()
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            next('/login'); // 否则全部重定向到登录页
        }
    }
})

