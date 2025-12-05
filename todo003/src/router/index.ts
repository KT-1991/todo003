import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
//@ts-ignore
import FoodView from '@/views/FoodView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import ListView from '@/views/ListView.vue'
import LogView from '@/views/LogView.vue'
import CalendarView from '@/views/CalendarView.vue'
import CategoryView from '@/views/CategoryView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { title: 'Home', requiresAuth: true}
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { title: 'Login', requiresAuth: false}
    },
    {
        path: '/food',
        name: 'food',
        component: FoodView,
        meta: { title: 'Food', requiresAuth: true}
    },
    {
        path: '/list',
        name: 'list',
        component: ListView,
        meta: { title: 'List', requiresAuth: true}
    },
    {
        path: '/calendar',
        name: 'calendar',
        component: CalendarView,
        meta: { title: 'Calendar', requiresAuth: true}
    },
    {
        path: '/category',
        name: 'category',
        component: CategoryView,
        meta: { title: 'category', requiresAuth: true}
    },
    {
        path: '/log',
        name: 'log',
        component: LogView,
        meta: { title: 'log', requiresAuth: true}
    },
  ],
})

let onAuthStateChangedUnsubscribe: any

router.beforeEach((to, from, next) => {
    const auth = getAuth()

    if (!to.matched.some(record => record.meta.requiresAuth)) {
        next()
    } else {
        if (auth.currentUser) {
            next()
            return
        } else {
            if (typeof onAuthStateChangedUnsubscribe === 'function') {
                onAuthStateChangedUnsubscribe()
            }
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    next()
                } else {
                    next({ name: 'login' })
                }
            })
        }
    }
})

export default router
