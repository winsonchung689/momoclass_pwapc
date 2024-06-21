<template>
  <div>
    <div style="background-color: #ffff ;width: 100%;">
      <div style="margin-top: auto;display: flex;flex-direction: row;margin-left: 1%;">
        <div>
          <img :src="avatarurl" alt="" style="width: 30px;height: 30px;border-radius: 50%; position: relative;margin-left: 0px;margin-top: 5px;">
        </div>
        <h1>HI,{{ nick_name }} ({{ mode }})</h1>

        <div style="display: flex;flex-direction: row;justify-content: space-between;width: 10%;margin-left: 10%;">
          <div style="display: flex;margin-right: 0%;">
            <img @click="click('/chatroom')" class="notice" src="../assets/wechat.png" alt="" >
          </div>
          <div style="display: flex;margin-right: 5%;">
            <img @click="click('/announcementrecord')" class="notice" src="../assets/notice.png" alt="" >
          </div>
        </div>
      </div>
      
      <div style="width: 100%;background-color: #d4dfdf;">
        <div style="margin-left: 15px;">
          <h2 @click="$router.push('/Login')">{{ hello }}</h2>
        </div>
      </div>
    </div>

    <el-col :span="2">
      <div style="color: #517cf1;font-weight: bolder;font-size: large;margin-left: 20px;">菜单</div>
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="rgb(251, 248, 246)"
        >
        <el-menu-item index="1" @click="bindSelect('教务工具')">
            <i class="el-icon-menu"></i>
            <span slot="title">教务工具</span>
        </el-menu-item>
        <el-menu-item index="2" @click="bindSelect('课后互动')">
            <i class="el-icon-menu"></i>
            <span slot="title">课后互动</span>
        </el-menu-item>
      </el-menu>
    </el-col>

    <div style="background-color: rgb(251, 248, 246);font-size: large;font-weight: bolder;color: rgb(107, 172, 155);">{{ title }}</div>
    
    <div style="display: flex" v-if="this.title=='教务工具'">
      <div class="item" @click="school(subject)">
          <div class="content">
            <div style="display: flex;justify-content: center;">
              <img style="width: 70px;height: 70px;" src="@/assets/school.png" alt="">
            </div>
            <div style=";display: flex;justify-content:center;font-weight: bold;font-size: small;">学员管理</div>
          </div>
      </div>

      <div class="item" @click="timeTable(subject)">
          <div class="content">
            <div style="display: flex;justify-content: center;">
              <img style="width: 70px;height: 70px;" src="@/assets/timetable.png" alt="">
            </div>
            <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">排课表</div>
          </div>
        </div>

        <div class="item" @click="calender(subject,studio,student_name)">
            <div class="content">
              <div style="display: flex;justify-content: center;">
                <img style="width: 70px;height: 70px;" src="@/assets/tosignin.png" alt="">
              </div>
              <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">签到处</div>
            </div>
          </div>

    </div>

    <div style="display: flex" v-if="this.title=='课后互动'">
      <div class="item" @click="commentCenter(subject)">
            <div class="content">
              <div style="display: flex;justify-content: center;">
                <img style="width: 70px;height: 70px;" src="@/assets/comment.png" alt="">
              </div>
              <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">课评中心</div>
            </div>
        </div>
    
    </div>



  </div>
</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import { sendNotification } from '@/api'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import WebSocket from '@/components/WebSocket'
import { ImageUrl } from '@/api'

export default {
name: 'Home',
components: {
  swiper,
  swiperSlide,
  WebSocket,
},
data () {
  return {
    studio: '',
    nick_name: '你好',
    avatarurl: '',
    openid: this.$route.query.openid,
    role: this.$route.query.role,
    subject:'',
    mode: '游客模式',
    hello:'去登陆 👉',
    diff:0,
    startY: 0,
    weekday:'',
    isBoss:false,
    isClient:false,
    subscription:'',
    pulickey:'BGVksyYnr7LQ2tjLt8Y6IELBlBS7W8IrOvVszRVuE0F97qvcV6qB_41BJ-pXPaDf6Ktqdg6AogGK_UUc3zf8Snw',
    privatekey:'oc5e7TovuZB8WVXqQoma-I14sYjoeBp0VJTjqOWL7mE',
    subsctiption_status:'未订阅',
    registration:'',
    centerDialogVisible: false,
    textarea: '',
    send_time:'',
    isBell1:true,
    isBell2:false,
    campus:'',
    count: 0,
    items: [],
    comment_items:[],
    MinDisplay:'flex',
    ShowIndex:0,
    display: 'none',
    page:1,
    busy:false,
    type: 'public',
    isMine:true,
    drawer: false,
    direction:'btt',
    comment_input:'',
    comment_studio:'',
    comment_nickname:'',
    comment_postid:'',
    index_out:'',
    srcList: [
        'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
        'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
    ],
    title:'教务工具'
  }
},

created () {
  this.getUser()
  this.subscriptionInit()
},

mounted() {

},
methods: {

  async getUser () {
    let that = this
    if(this.openid){
        that.page  = 1
        that.type = 'public'
        const users = await HttpGet('/getUser?openid=' + this.openid)
        // console.log(users)
        that.studio = users.data[0].studio
        that.subscription = users.data[0].subscription
        that.campus = users.data[0].campus
        if(that.studio.length>0){
          that.hello = '欢迎来到《' + that.studio + "》！"
          if(that.campus != that.studio){
            that.hello = '欢迎来到《' + that.studio+ "("+ that.campus +")" + "》！"
          }
        }else {
          that.hello = '去登陆 👉'
        }

        that.nick_name = users.data[0].nick_name
        that.avatarurl = users.data[0].avatarurl
        that.role = users.data[0].role
        that.subject = users.data[0].subjects
        that.comment_style = users.data[0].comment_style
        that.send_time = users.data[0].send_time
        
        if('boss' == that.role){
          that.mode = '校长模式'
          that.isBoss = true
        }else if('teacher' == that.role){
          that.mode = '老师模式'
          that.isBoss = true
        }else if('client' == that.role){
          that.mode = '家长模式'
          that.isClient = true
        }else if('visit' == that.role){
          that.mode = '游客模式'
        }else {
          that.mode = '未登录'
        }
    }

    that.items = []
    that.getPost(that.page,that.type)
  },

  async handleClick() {
    let that = this
    that.items = []
    that.page = 1
    if(that.type == 'public'){
      await that.getPost(that.page,that.type)
    }else if(that.type == 'private'){
      await that.getPost(that.page,that.type)
    }
  },

  bindSelect(item){
    let that = this;
    console.log(item)
    that.title = item;
  },

  timeTable (subject) {
    this.$router.push({ path: '/timetable', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,send_time:this.send_time } })
  },

  commentCenter (subject) {
      this.$router.push({ path: '/commentcenter', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,comment_style:this.comment_style } })
    },


  click (url) {
    this.$router.push({ path: url, query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style,send_time:this.send_time } })
  },

  school (subject) {
    this.$router.push({ path: '/school', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid } })
  },

  calender (subject) {
    this.$router.push({ path: '/calendar', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,student_string:this.student_string } })
  },

  subscribe_button(){
    let that = this
    if(that.subsctiption_status === '未订阅'){
      that.notifyMe()
      that.subscribeUser()
    }else{
      that.unsubscribeUser()
    }
  },

  unsubscribeUser(){
    let swRegistration = this.registration
    swRegistration.pushManager.getSubscription().then(function (pushSubscription) {
        if (!pushSubscription) {
            // 用户尚未订阅
            return
          }
          // 取消订阅
          return pushSubscription.unsubscribe()
    })
    .then(function () {
      console.log('取消订阅！')
    })

    this.subsctiption_status='未订阅'

  },

  urlB64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - base64String.length % 4) % 4);
      const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
  },

  subscribeUser() {     
      let openid = this.openid
      let swRegistration = this.registration
      const applicationServerPublicKey = this.pulickey
      const applicationServerKey = this.urlB64ToUint8Array(applicationServerPublicKey)
      swRegistration.pushManager.permissionState({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
      })
      .then(function(permission) {
          console.log('User is granted:', JSON.stringify(permission));
          if (permission === 'granted') {
            swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            })
            .then(function(subscription) {
                console.log('User is subscribed:', JSON.stringify(subscription));
                if (subscription) {
                  console.log('已订阅');
                  console.log(JSON.stringify(subscription));
                  let param = {
                    openid:openid,
                    subscription:JSON.stringify(subscription)
                  }
                  HttpPost('/updateSubscription',param)
                } 
            })
            .catch(function(err) {
                console.log('no subscribed: ', err);
            });
          }
      })
      .catch(function(err) {
          console.log('no permission: ', err);
      });
      this.subsctiption_status = '已订阅'
  },

  async subscriptionInit(){
    let that = this
    let openid = that.openid
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js', { scope: '/' }).then(function (registration) { 
      that.registration = registration
      // console.log(registration)

      registration.pushManager.getSubscription().then(function(subscription) {
            if (subscription) {
              console.log('已订阅');
              that.subsctiption_status = '已订阅'
              console.log(JSON.stringify(subscription));
              let param = {
                openid:openid,
                subscription:JSON.stringify(subscription)
              }
              HttpPost('/updateSubscription',param)
            } else {
              console.log('未订阅');
            }
      });
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function (err) {
      console.log('ServiceWorker registration failed: ', err);
    });


    }
  },

  announcement(){
    let that = this
    that.centerDialogVisible=true
    that.textarea = ''
  },

  async announcement_confirm(){
    let that = this
    that.centerDialogVisible=false
    const users = await HttpGet('/getAllUserByStudio?studio=' + that.studio)
    // console.log(users.data)
    for( var i in users.data){
        let subscription = users.data[i].subscription
        let message = that.textarea
        let json = {
          title:that.studio,
          message:message
        }
        if(subscription){
          let res = await sendNotification(subscription, JSON.stringify(json))
          console.log(res)
        }

        if(i == 1){
          let param ={
              studio:that.studio,
              content:message,
              openid:that.openid
          }
          let res = await HttpPost('/insertAnnouncement', param)
          console.log(res)
      }
      
    }

    that.$message({
      message: '通知成功',
      type: 'success'
    });   
  },

  async notifyMe(){
    let that = this
    if (!window.Notification) {
      return Promise.reject('系统不支持桌面通知')
    }

    let promise = Notification.requestPermission()
    console.log(promise)
    promise.then(res => {
      console.log(res)
      if(res == 'granted'){
        that.isBell1 = false
        that.isBell2 = true
      }else{
        that.isBell1 = true
        that.isBell2 = false
      }
    })
   },

   ZoomIn(i){
      this.display='block';
      this.MinDisplay='none';
      this.ShowIndex=i;
  },

  ZoomOut(){
      this.display='none';
      this.MinDisplay='flex';
  },

  select(i){
      this.ShowIndex=i;
  },

}
}
</script>

<style scoped>
.main_buttons{
height: 80px;
display: flex;
flex-direction: row;
justify-content: space-between;
 width: 95%;
 margin-top: 20px;
 margin-bottom: 20px;
}

.items{
width: 100px;
height: 100px;
/* margin-right: 6%; */
background-color:#ffffff89;
border-radius: 1rem;
justify-content: center;
display: flex;
flex-direction: column;
}

.icon{
width: 40px;
height: 40px;
border-radius: 0.5rem;
}

.notice{
width: 30px;
height: 30px;
border-radius: 0.5rem;
margin-top: 10px;
}


.itemtext {
font-size:small;
display: flex;
justify-content: center;
color:#767e69;
font-weight: bolder;
margin-top: 5px;
}

h1 {
font-weight: bold;
font-size: medium;
color: #a1bfbf91;
}

h2 {
font-weight: bolder;
font-size: large;
color: #5aabee;
height: auto;
}

.today {
width: 60%;
display: flex;
justify-content: space-between;
border-radius: 1rem;
background-color:  #b7f4d9;

}

h3 {
color: #ffffff;
/* background-color:  #b7f4d9; */
justify-content: center;
margin-left: 20px;
}


header {
padding: 0 20px;
width: 100%;
height: 40px;
position: fixed;
top: 0;
left: 0;
background: #598cda;
z-index: 99;
}

.avatar {
display: flex;
flex-direction: row;
background-color:d #ffff;

}

text{
font-weight: bolder;color: #767e69;font-size: medium;
}

.covers{
  width: 95%;
  display: flex;
  justify-content: left;
  flex-wrap: wrap;
  margin-left: 5%;
}

.cover{
  display: flex;
  justify-content: center;
  width: 45%;
  margin: 10px 0;
}

.foot{
font-size: small;
font-weight: bold;
color: #608bc9;
display: flex;
flex-direction: column;
margin-bottom: 5px;
}

.max{
  cursor: zoom-out;
  width: 100%;

}

.small{
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.cover-small{
  display: flex;
  justify-content: center;
  width: 10%;
  margin: 10px 0;
  opacity: 0.6;
  cursor: pointer;
}
.cover-small:hover{
  opacity: 1;
}
.active{
  display: flex;
}
.None{
  display: none;
}
.smallActive{
  opacity: 1;
}

.wrap{
height: 100vh;
overflow-y: auto;
}

.name_avatar{
display: flex;
flex-direction: row
}

.content{
font-size: small;
color: dimgray;
margin-top: 10px;
margin-bottom: 0px;
width: 80px;
font-weight: bold;
}
.comment_item {
margin-top: 10px;
margin-right: 40px;
}

.item{
width: 90px;
height: 90px;
border-radius: 1rem;

/* color: #81a1eb; */
}
</style>
