import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Welcome = () => import('@/components/Welcome')
const Home = () => import('@/components/Home')
const NextPage = () => import('@/components/NextPage')
const Login = () => import('@/components/Login')

export default new Router({
  // history 模式，需要服务器后端配合做路由代理，将所有的前端路由同步代理到 /
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/welcome',
      name: 'Login',
      component: Welcome
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/next',
      name: 'NextPage',
      component: NextPage
    }
  ]
})
