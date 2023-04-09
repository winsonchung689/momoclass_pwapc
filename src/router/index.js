import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Welcome = () => import('@/components/Welcome')
const Home = () => import('@/components/Home')
const Students = () => import('@/components/Students')
const Login = () => import('@/components/Login')

export default new Router({
  // history 模式，需要服务器后端配合做路由代理，将所有的前端路由同步代理到 /
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/students',
      name: 'Students',
      component: Students
    }
  ]
})
