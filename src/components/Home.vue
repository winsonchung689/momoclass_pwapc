<template>
    <div>
      <div style="display: block;position: fixed;background-color: #fff;width: 100%;top: 0;">
        <div class="avatar">
          <div style="margin-top: auto;">
            <h1>HI,{{ nick_name }} ({{ mode }})</h1>
          </div>
          <img :src="avatarurl" alt="" style="width: 30px;height: 30px;border-radius: 50%; position: relative;margin-left: 10px;margin-top: 5px;">
        </div>
      </div>

      <div style="margin-top: 10%;" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">

        <h2 @click="$router.push('/Login')">{{ hello }}</h2>
        <div style="display: flex;justify-content: center;margin-bottom: 5px;">
          <div class="today">
            <h3>{{ today }}  {{ today_season }}</h3>
            <img :src="today_img" alt="" style="border-radius: 20%;width: 55px;height: 70px;background-color:  #b7f4d9;">
          </div>
        </div>

        <div style="display: flex;justify-content: center;">
          <div class="main_buttons">
            <div @click="click('/students')" class="items">
              <div style="display: flex;justify-content: center;">
                <img class="icon" src="../assets/student.png" alt="" >
              </div>
              <div class="itemtext">学生专区</div>
            </div>
            <div @click="click('/workbenches')" class="items">
              <div style="display: flex;justify-content: center;">
                <img class="icon" src="../assets/work.png" alt="" >
              </div>
              <div class="itemtext">工作台</div>
            </div>
            <div v-if="isBoss" @click="click('chatroom')" class="items">
              <div style="display: flex;justify-content: center;">
                <img class="icon" src="../assets/chat.png" alt="" >
              </div>
              <div class="itemtext">吹水站</div>
            </div>
            <div @click="click('me')" class="items">
              <div style="display: flex;justify-content: center;">
                <img class="icon" src="../assets/me.png" alt="" >
              </div>
              <div class="itemtext">个人中心</div>
            </div>
          </div>
        </div>

        <div class="banner">
          <div class="banner_wrap">
          <swiper :options="swiperOption" v-if="images.length > 1">
            <swiper-slide class="swiper-wrapper" v-for="(item, index) in images" :key="index">
              <div  style="display: flex;justify-content: left; flex-direction: row;">
                <!-- <div @click="click(item.url)" style="width: 20px;background-color:#b7f4d9;border-radius: 1rem;height: 40%;margin-top: 5px;"> -->
                  <!-- <div style="font-size: large;margin-top: 5%;font-weight: bolder;color: #adad63f1;">{{ item.name }}</div> -->
                <!-- </div> -->
                <div style="width: 80%;">
                  <img :src="item.img" alt="" style="border-radius: 2rem; scale: 1;">
                </div>
              </div>

            </swiper-slide>
          </swiper>
          </div>
        </div>

        <el-divider content-position="center" style="font-weight: bolder;">今日课程</el-divider>

        <div style="display: flex;flex-direction: row;">
          <!-- <WebSocket></WebSocket> -->
          <el-dialog
            title="提示"
            :visible.sync="centerDialogVisible"
            width="80%"
            center>
            <!-- <span>需要注意的是内容是默认不居中的</span> -->
            <el-input
              type="textarea"
              :rows="4"
              placeholder="请输入内容"
              v-model="textarea">
            </el-input>
            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="announcement_confirm()">确 定</el-button>
            </span>
          </el-dialog>
          <div style="margin-left:5% ;">
            <el-button  v-if="isBoss" @click="announcement()" type="primary" size="mini" round>发通知<i class="el-icon-mic el-icon--right"></i></el-button>
          </div>
          <div >
            <el-button @click="subscribe_button()" type="success" size="mini" round>{{ subsctiption_status }}<i class="el-icon-message-solid el-icon--right"></i></el-button>
          </div>
        </div>
        
        <div v-for="(item ,index) in schedule_data" :key="index">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span style="font-weight: bolder;color: #767e69;font-size: medium;margin-top: 5px;">科目: {{ item.subject }}</span>
              <el-button v-if="isBoss" @click="calender(item.subject)" style="float: right;border-color: white; " type="text">签到</el-button>
              <el-button v-if="isClient" @click="calender(item.subject,student_string)" style="float: right;border-color: white; " type="text">请假</el-button>
            </div>
            <div style="font-weight: bolder;color: #767e69;font-size: medium;">班级: {{ item.class_number }}</div>
            <div style="font-weight: bolder;color: #767e69;font-size: medium;">上课时间: {{ item.duration }}</div>
            <div style="font-weight: bolder;color: #767e69;font-size: medium;">人数: {{ item.classes_count }}</div>
            <div style="font-weight: bolder;color: #767e69;font-size: medium;">已签到: {{ item.sign_count }}</div>
          </el-card>
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

export default {
  name: 'Home',
  components: {
    swiper,
    swiperSlide,
    WebSocket
  },
  data () {
    return {
      images_all: [
        [{ img: '../assets/spring1.png', name: '学生专区' ,url:'/students'}, 
        { img: '../assets/spring2.png', name: '工作台' ,url:'/workbenches'}, 
        { img: '../assets/spring3.png', name: '个人中心' ,url:'/me'}],
        [{ img: '../assets/summer1.png', name: '学生专区' ,url:'/students'}, 
        { img: '../assets/summer2.png', name: '工作台' ,url:'/workbenches'}, 
        { img: '../assets/summer3.png', name: '个人中心' ,url:'/me'}],
        [{ img: '../assets/autumn1.png', name: '学生专区' ,url:'/students'}, 
        { img: '../assets/autumn2.png', name: '工作台' ,url:'/workbenches'}, 
        { img: '../assets/autumn3.png', name: '个人中心' ,url:'/me'}],
        [{ img: '../assets/winter1.png', name: '学生专区' ,url:'/students'}, 
        { img: '../assets/winter2.png', name: '工作台' ,url:'/workbenches'}, 
        { img: '../assets/winter3.png', name: '个人中心' ,url:'/me'}]
      ],
      images:[],
      studio: '',
      nick_name: '你好',
      avatarurl: '',
      swiperOption: {
        loop: true,
        speed: 800,
        observer: true,
        observeParents: true,
        slidesPerView:1.2,
        loopedSlides:2,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          reverseDirection:false
        }
      },
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      subject:'',
      seasons:[
        { img: '../assets/spring.png', name: '春' }, 
        { img: '../assets/summer.png', name: '夏' }, 
        { img: '../assets/autumn.png', name: '秋' },
        { img: '../assets/winter.png', name: '冬' }
      ],
      today:'',
      today_img:'',
      today_season:'',
      mode: '游客模式',
      hello:'去登陆 👉',
      diff:0,
      startY: 0,
      weekday:'',
      date:'',
      schedule_data:[],
      comment_style:'',
      isBoss:false,
      isClient:false,
      student_string:'',
      mp3url:'',
      subscription:'',
      pulickey:'BGVksyYnr7LQ2tjLt8Y6IELBlBS7W8IrOvVszRVuE0F97qvcV6qB_41BJ-pXPaDf6Ktqdg6AogGK_UUc3zf8Snw',
      privatekey:'oc5e7TovuZB8WVXqQoma-I14sYjoeBp0VJTjqOWL7mE',
      subsctiption_status:'未订阅',
      registration:'',
      centerDialogVisible: false,
      textarea: '',
      send_time:''
    }
  },
  created () {
    this.getUser()
    this.subscriptionInit()
  },
  methods: {
    async getUser () {
      let that = this
      const date = new Date
      const year = date.getFullYear()
      const month = date.getMonth()+1
      const day = date.getDate()
      let weekday = date.getDay()
      that.today = year+'年'+month+'月'+day+'日'
      that.date = year+'-'+month+'-'+day

      if(weekday == 0){
        weekday = 7
      }
      that.weekday = weekday
      console.log(weekday)

      let num = parseInt(month/4)
      // console.log(that.today,num)
      that.today_img = that.seasons[num].img
      that.today_season = that.seasons[num].name
      that.images = that.images_all[num]

      const users = await HttpGet('/getUser?openid=' + this.openid)
      that.studio = users.data[0].studio
      that.subscription = users.data[0].subscription
      if(that.studio.length>0){
        that.hello = '欢迎来到《' + that.studio + "》！"
      }else {
        that.hello = '去登陆 👉'
      }

      that.nick_name = users.data[0].nick_name
      that.avatarurl = users.data[0].avatarurl
      that.role = users.data[0].role
      that.subject = users.data[0].subjects
      that.comment_style = users.data[0].comment_style
      that.send_time = users.data[0].send_time
      console.log(that.send_time)
      
      if('boss' == that.role){
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

      // console.log(that.studio,that.weekday,that.date,that.openid)


      let param ={
          studio:that.studio,
          dayofweek:that.weekday,
          date:that.date,
          openid:that.openid,
          subject: that.subject
      }

      const schedule = await HttpPost('/getArrangement', param)
      let schedule_data = schedule.data;
      // console.log(schedule_data)
      if(schedule_data.length > 0){
        that.student_string = schedule_data[0].student_string
      }
      // console.log(that.student_string)
      that.schedule_data = []
      for( var i in schedule_data){
        let classes_count = schedule_data[i].classes_count
        // console.log(classes_count)
        if(classes_count > 0){
          that.schedule_data.push(schedule_data[i])
        } 
      }
    },

    click (url) {
      this.$router.push({ path: url, query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style,send_time:this.send_time } })
    },

    touchStart(e) {
      this.diff = 0
      this.startY = e.targetTouches[0].pageY
      this.startScroll = this.$el.scrollTop || 0
    },

    touchMove(e) {
      let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
      // console.log(diff)
      this.diff = diff
    },

    touchEnd(e) {
      if(this.diff >= 200){
        this.isBoss = false
        this.isClient = false
        this.getUser()
        this.$message({
        message: '刷新成功',
        type: 'success'
      });
      }
    },

    calender (subject) {
      this.$router.push({ path: '/calendar', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,student_string:this.student_string } })
    },

    subscribe_button(){
      let that = this
      if(that.subsctiption_status === '未订阅'){
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
      const users = await HttpGet('/getUserByStudio?studio=' + that.studio)
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
          
      }

      that.$message({
        message: '通知成功',
        type: 'success'
      });   
    }
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
  color: #434a3d;
  margin-left: 5%;
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
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 5%;
  
}

.banner {
  width: 100%;
  /* height: 2.9rem; */
}

.banner_wrap {
  padding: 0 0.2rem;
}

.banner .swiper-container {
  width: 100%;
  height: 100%;
}

.banner .swiper-container .swiper-wrapper {
  width: 100%;
  height: 100%;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-prev {
    scale: 0.9 !important;
}

.banner .swiper-container  .swiper-wrapper .swiper-slide-next {
    scale: 0.9 !important;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-prev img {
    scale: 0.9 !important;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-next img {
   scale: 0.9 !important;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-active {
   width: 90%;
   scale: 0.9;
}




.banner .swiper-container .swiper-wrapper .swiper-slide {
  height: 100%;
}

.banner .swiper-container .swiper-wrapper .swiper-slide img {
  width: 100%;
  height: 100%;
  border-radius: 0.15rem;
}

.banner .swiper-container .banner-swiper-pagination {
  bottom: 0;
  height: 0.3rem;
}

.banner .swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet {
  width: 0.24rem;
  height: 0.04rem;
  opacity: 1;
  background: #000;
  border-radius: 0;
}

.banner .swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: #ffffff;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 95%;
  margin-left: 2.5%;
}

text{
  font-weight: bolder;color: #767e69;font-size: medium;
}

</style>
