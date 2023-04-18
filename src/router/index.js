import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Welcome = () => import('@/components/Welcome')
const Home = () => import('@/components/Home')
const Students = () => import('@/components/Students')
const Login = () => import('@/components/Login')
const Records = () => import('@/components/Records')
const SingnInRecord = () => import('@/components/SingnInRecord')
const LeaveRecord = () => import('@/components/LeaveRecord')
const GrowthRecord = () => import('@/components/GrowthRecord')
const WorkBenches = () => import('@/components/WorkBenches')
const Timetable = () => import('@/components/Timetable')
const Calendar = () => import('@/components/Calendar')
const School = () => import('@/components/School')
const Me = () => import('@/components/Me')
const CommentCenter = () => import('@/components/CommentCenter')
const Authorization = () => import('@/components/Authorization')

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
    },
    {
      path: '/records',
      name: 'Records',
      component: Records
    },
    {
      path: '/signinrecord',
      name: 'SingnInRecord',
      component: SingnInRecord
    },
    {
      path: '/leaverecord',
      name: 'LeaveRecord',
      component: LeaveRecord
    },
    {
      path: '/growthrecord',
      name: 'GrowthRecord',
      component: GrowthRecord
    },
    {
      path: '/workbenches',
      name: 'WorkBenches',
      component: WorkBenches
    },
    {
      path: '/timetable',
      name: 'Timetable',
      component: Timetable
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar
    },
    {
      path: '/school',
      name: 'School',
      component: School
    },
    {
      path: '/me',
      name: 'Me',
      component: Me
    },
    {
      path: '/commentcenter',
      name: 'CommentCenter',
      component: CommentCenter
    },
    {
      path: '/authorization',
      name: 'Authorization',
      component: Authorization
    }
  ]
})
