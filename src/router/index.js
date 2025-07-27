import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Welcome = () => import('@/components/Welcome')
const Home = () => import('@/components/Home')
const Students = () => import('@/components/Students')
const Login = () => import('@/components/Login')
const Records = () => import('@/components/Records')
const SignUpRecord = () => import('@/components/SignUpRecord')
const LeaveRecord = () => import('@/components/LeaveRecord')
const GrowthRecord = () => import('@/components/GrowthRecord')
// const WorkBenches = () => import('@/components/WorkBenches')
const Timetable = () => import('@/components/Timetable')
const Calendar = () => import('@/components/Calendar')
const School = () => import('@/components/School')
const Me = () => import('@/components/Me')
const ChatRoom = () => import('@/components/ChatRoom')
const CommentCenter = () => import('@/components/CommentCenter')
const Authorization = () => import('@/components/Authorization')
const AnnouncementRecord = () => import('@/components/AnnouncementRecord')
const AccountBook = () => import('@/components/AccountBook')
const Post = () => import('@/components/Post')
// const CommunityMini = () => import('@/components/CommunityMini')
const ClassSystem = () => import('@/components/ClassSystem')
const LessonPackage = () => import('@/components/LessonPackage')
const ClassBooking = () => import('@/components/ClassBooking')
const Analysis = () => import('@/components/Analysis')
const Library = () => import('@/components/Library')

export default new Router({
  // history 模式，需要服务器后端配合做路由代理，将所有的前端路由同步代理到 /
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,meta:{
        showTabBar:false
      }
    },
    {
      path: '/students',
      name: 'Students',
      component: Students,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/records',
      name: 'Records',
      component: Records,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/signUpRecord',
      name: 'SignUpRecord',
      component: SignUpRecord,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/leaverecord',
      name: 'LeaveRecord',
      component: LeaveRecord,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/growthrecord',
      name: 'GrowthRecord',
      component: GrowthRecord,
      meta:{
        showTabBar:false
      }
    },
    // {
    //   path: '/workbenches',
    //   name: 'WorkBenches',
    //   component: WorkBenches,
    //   meta:{
    //     showTabBar:true
    //   }
    // },
    {
      path: '/timetable',
      name: 'Timetable',
      component: Timetable,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: Calendar,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/school',
      name: 'School',
      component: School,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/me',
      name: 'Me',
      component: Me,
      meta:{
        showTabBar:true
      }
    },
    {
      path: '/commentcenter',
      name: 'CommentCenter',
      component: CommentCenter,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/authorization',
      name: 'Authorization',
      component: Authorization,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/chatroom',
      name: 'ChatRoom',
      component: ChatRoom,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/announcementrecord',
      name: 'AnnouncementRecord',
      component: AnnouncementRecord,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/accountbook',
      name: 'AccountBook',
      component: AccountBook,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/post',
      name: 'Post',
      component: Post,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/classsystem',
      name: 'ClassSystem',
      component: ClassSystem,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/lessonPackage',
      name: 'LessonPackage',
      component: LessonPackage,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/classBooking',
      name: 'ClassBooking',
      component: ClassBooking,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/analysis',
      name: 'Analysis',
      component: Analysis,
      meta:{
        showTabBar:false
      }
    },
    {
      path: '/library',
      name: 'Library',
      component: Library,
      meta:{
        showTabBar:false
      }
    }
    
  ]
})
