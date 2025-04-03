<template>
  <div>
    <!-- 个人信息 -->
    <div style="background-color: #535CBE ;width: 100%;margin-top: auto;display: flex;flex-direction: row;">
        <div style="margin-top: auto;display: flex;flex-direction: row;width: 90%;">
          <div style="margin-top: auto;display: flex;flex-direction: row;">
              <div><img :src="avatarurl" alt="" style="width: 50px;height: 50px;border-radius: 50%; position: relative;"></div>
              <div style="margin-left: 10px;margin-top: 5px;color:#ffffff;font-weight: bolder;">
                <div style="font-size:medium;">HI,{{ nick_name }}</div>
                <div style="font-size: small;">{{ mode }}</div>
              </div>
          </div>
          
          <div style="margin-left: 2%;">
              <h2 @click="$router.push('/Login')">{{ hello }}</h2>
          </div>
        </div>

        <div style="display: flex;flex-direction: row;justify-content: space-around; width:25%;">
          <div style="display: flex;justify-content: center;height: 100%;align-items: center;">
              <el-button @click="subscribe_buttom()" type="success" size="mini" round>{{ subsctiption_status }}<i class="el-icon-message-solid el-icon--right"></i></el-button>
          </div>
          <div >
            <img @click="click('/chatroom')" class="notice" src="../assets/wechat.png" alt="" >
          </div>
          <div >
            <img @click="click('/announcementrecord')" style="width: 30px;height: 30px;margin-top: 10px;" src="../assets/notice.png" alt="" >
          </div>
        </div>
    </div>

    <!-- 学生 -->
    <div v-if="!isBoss" style="font-weight: bolder;color: #a981aa;display: flex;flex-direction: row;align-items: center;">
      <div >学生：{{sb}}</div>
      <div style="margin-left: 10px;color: rgb(111, 128, 139);margin-top: 2px;">
          <i @click="modifyFunction()" class="el-icon-edit"></i>
      </div>
    </div>

    <!-- 添加框 -->
    <el-dialog :visible.sync="dialogFormVisible" style="width: 400px">
      <el-input v-model="student_name" :placeholder="mark"></el-input>
      <div slot="footer" style="display: flex;flex-direction: row;justify-content: space-between;">
        <el-button @click="cancel_buttom()">取 消</el-button>
        <el-button type="primary" @click="confirm_buttom()">确 定</el-button>
      </div>
    </el-dialog>

    <div style="display: flex;flex-direction: row;width: 100%;">

      <!-- 菜单 -->
      <el-col style="width: 10%;">
        <div style="color: #6c6c6e;font-weight: bolder;font-size: large;background-color: rgb(251, 248, 246);display: flex;justify-content: center;">
          <div>菜单</div>
        </div>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          background-color="rgb(251, 248, 246)"
          >
          
          <el-menu-item index="1" @click="bindSelect('了解我们')">
              <i class="el-icon-camera"></i>
              <span slot="title">了解我们</span>
          </el-menu-item>
          <el-menu-item  v-if="role == 'boss' || role == 'teacher'" index="2" @click="bindSelect('教务工具')">
              <i class="el-icon-school"></i>
              <span slot="title">教务工具</span>
          </el-menu-item>
          <el-menu-item index="3" @click="bindSelect('课后互动')">
              <i class="el-icon-connection"></i>
              <span slot="title">课后互动</span>
          </el-menu-item>
          
        </el-menu>
      </el-col>


      <!-- 主体 -->
      <div style="width: 90%;">
        <!-- 教务工具 -->
        <div style="background-color: rgb(251, 248, 246);font-size: large;font-weight: bolder;color: rgb(107, 172, 155);">{{ title }}</div>
          <div style="display: flex;flex-direction: row;justify-content:space-between;width: 60%;margin-left: 10%;" v-if="this.title=='教务工具'">
            <div class="item" @click="school(subject)">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 90px;height: 90px;" src="@/assets/addst.png" alt="">
                  </div>
                  <div style="display: flex;justify-content:center;font-weight: bold;font-size: small;">学员管理</div>
                </div>
            </div>

            <div class="item" @click="timeTable(subject)">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 120px;height: 90px;margin-left: 30px;" src="@/assets/classview.png" alt="">
                  </div>
                  <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">班级排课</div>
                </div>
            </div>

            <div class="item" @click="calender(subject,studio,student_name)">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 90px;height: 90px;" src="@/assets/schedule.png" alt="">
                  </div>
                  <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">点名签到</div>
                </div>
            </div>

            <div class="item" @click="accountBook()">
              <div class="content">
                <div style="display: flex;justify-content: center;">
                  <img style="width: 90px;height: 90px;" src="@/assets/account_book.png" alt="">
                </div>
                <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">收入支出</div>
              </div>
            </div>

          </div>

          <div style="margin-top: 5%;display: flex;flex-direction: row;justify-content:space-between;width: 60%;margin-left: 10%;" v-if="this.title=='教务工具'">
            <div class="item" @click="analysis()">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 90px;height: 90px;" src="@/assets/analyze.png" alt="">
                  </div>
                  <div style="display: flex;justify-content:center;font-weight: bold;font-size: small;">统计面板</div>
                </div>
            </div>

          </div>

          <!-- 了解我们 -->
          <div style="display: flex;flex-direction: row;justify-content:space-between;width: 60%;margin-left: 10%;" v-if="this.title=='了解我们'">

            <div class="item" @click="classSystem('环境')">
              <div class="content">
                <div style="display: flex;justify-content: center;">
                  <img style="width: 90px;height: 90px;" src="@/assets/classroom.png" alt="">
                </div>
                <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">我的课堂</div>
              </div>
            </div>

            <div class="item" @click="classSystem('课程体系')">
              <div class="content">
                <div style="display: flex;justify-content: center;">
                  <img style="width: 90px;height: 90px;" src="@/assets/system.png" alt="">
                </div>
                <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">课程体系</div>
              </div>
            </div>

            <div class="item" @click="classSystem('广告')">
              <div class="content">
                <div style="display: flex;justify-content: center;">
                  <img style="width: 90px;height: 90px;" src="@/assets/recruit.png" alt="">
                </div>
                <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">招生章程</div>
              </div>
            </div>
          </div>

          <!-- 课后互动 -->
          <div style="display: flex;flex-direction: row;justify-content:space-between;width: 60%;margin-left: 10%;" v-if="this.title=='课后互动'">
            <div class="item" @click="students()">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 90px;height: 90px;" src="@/assets/student_list.png" alt="">
                  </div>
                  <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">学生列表</div>
                </div>
            </div>

            <div class="item" @click="classBooking(subject,studio,student_name)">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 90px;height: 90px;" src="@/assets/booking.png" alt="">
                  </div>
                  <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">查看排课</div>
                </div>
            </div>

            <div class="item" @click="commentCenter(subject)">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 90px;height: 90px;" src="@/assets/comment3.png" alt="">
                  </div>
                  <div style="display: flex;justify-content: center;font-weight: bold;font-size: small;">课后点评</div>
                </div>
            </div>

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
    pulickey:'BNuTcvDy80K11oNHamaMxjG7mQht2r5wDP2ZdR6kL_rLkaizhUDxXFmjlCMS57XaWYgflJlo-_cDF8wVqWIPd2U',
    privatekey:'q3-gIs92LkUmtLIKJB3bR3_ATFWTkDXJ4Pt9HGB84S8',
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
    title:'了解我们',
    sb:'',
    dialogFormVisible:false,
    id:'',
    student_name:'',
    mark:'',
    remind_type:'',
    student_string:''
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
        console.log(users.data[0])
        that.studio = users.data[0].studio
        that.subscription = users.data[0].subscription
        that.campus = users.data[0].campus
        that.sb = users.data[0].sb
        that.id = users.data[0].id
        that.hours = users.data[0].hours
        that.remind_type = users.data[0].remind_type
        if(that.studio.length>0){
          that.hello = '欢迎来到《' + that.studio + "》！"
          if(that.campus != that.studio){
            that.hello = '欢迎来到《' + that.studio+ "("+ that.campus +")" + "》！"
          }
        }else {
          that.hello = '去登陆 👉'
        }

        that.nick_name = users.data[0].nick_name
        that.avatarurl = ImageUrl + users.data[0].avatarurl
        that.role = users.data[0].role
        that.subject = users.data[0].subjects
        that.comment_style = users.data[0].comment_style
        that.send_time = users.data[0].send_time
        that.student_string = users.data[0].sb
        
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

  },

  modifyFunction(type){
      let that = this
      that.dialogFormVisible = true
      if(type == '学生' ){
        that.mark = '请输入学生名'
      }
  },

  cancel_buttom(){
    this.dialogFormVisible = false
    this.student_name = ''
  },

  async confirm_buttom(){
      let that = this 
      let param = {
        id: that.id,
        content:that.student_name,
        type:'更新学生',
        openid:that.openid
      }

      let status = ''
      let res = await HttpPost("/updateLocation",param)
      status = res.status
      if(status == 200){
        that.$message({
            message: '操作成功',
            type: 'success'
        });
        that.dialogFormVisible = false
        that.getUser()
      }else {
        that.$message({
            message: '操作失败',
            type: 'warning'
        });
        that.dialogFormVisible = false
        that.getUser()
      }
  },

  bindSelect(item){
    let that = this;
    console.log(item)
    that.title = item;
  },

  timeTable (subject) {
    this.$router.push({ path: '/timetable', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,send_time:this.send_time,remind_type:this.remind_type,hours:this.hours } })
  },

  classSystem(type){
    this.$router.push({ path: '/classsystem', query: { studio: this.studio,role:this.role,openid:this.openid,type } })
  },

  accountBook () {
      this.$router.push({ path: '/accountbook', query: { studio: this.studio,role:this.role,openid:this.openid } })
    },

  commentCenter (subject) {
      this.$router.push({ path: '/commentcenter', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,comment_style:this.comment_style } })
  },

  students () {
    this.$router.push({ path: '/students', query: {studio: this.studio,role:this.role,openid:this.openid} })
  },


  click (url) {
    this.$router.push({ path: url, query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style,send_time:this.send_time } })
  },

  school (subject) {
    this.$router.push({ path: '/school', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid } })
  },

  analysis () {
    this.$router.push({ path: '/analysis', query: {studio: this.studio,role:this.role,openid:this.openid } })
  },

  calender (subject) {
    this.$router.push({ path: '/calendar', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,student_string:this.student_string } })
  },

  classBooking (subject) {
    this.$router.push({ path: '/classBooking', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,student_string:this.student_string } })
  },

  subscribe_buttom(){
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
      console.log(swRegistration)
      const applicationServerPublicKey = this.pulickey
      const applicationServerKey = this.urlB64ToUint8Array(applicationServerPublicKey)
      swRegistration.pushManager.permissionState({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey
      })
      .then(function(permission) {
          console.log('User is granted:', JSON.stringify(permission));
          if (permission == 'granted') {
            swRegistration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            })
            .then(function(subscription) {
                console.log('User is subscribed:', JSON.stringify(subscription));
                if(subscription) {
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
        console.log(subscription)
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
width: 40px;
height: 40px;
border-radius: 0.5rem;
margin-top: 5px;
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
color: #ffffff;
}

h2 {
font-weight: bolder;
font-size: large;
color: #e09f33;
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
