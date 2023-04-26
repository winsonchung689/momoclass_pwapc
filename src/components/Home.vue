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
        
        <div class="banner">
          <div class="banner_wrap">
            <swiper :options="swiperOption" v-if="images.length > 1">
              <swiper-slide class="swiper-wrapper" v-for="(item, index) in images" :key="index">
                <div @click="click(item.url)" style="display: flex;justify-content: center; flex-direction: row;">
                  <div @click="click(item.url)" style="width: 20px;background-color:#b7f4d9;border-radius: 1rem;height: 40%;margin-top: 5px;">
                    <div style="font-size: large;margin-top: 5%;font-weight: bolder;color: #adad63f1;">{{ item.name }}</div>
                  </div>
                  <div @click="click(item.url)" style="width: 80%;">
                    <img :src="item.img" alt="" style="border-radius: 2rem; scale: 1;">
                  </div>
                </div>

              </swiper-slide>
            </swiper>
          </div>
        </div>


        <el-divider content-position="center" style="font-weight: bolder;">今日课程</el-divider>

        <div>
          <!-- <WebSocket></WebSocket> -->
          <button @click="test()">test</button>
          <!-- <div class='onesignal-customlink-container'></div> -->
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
        loop: false,
        speed: 800,
        observer: true,
        observeParents: true,
        // autoplay: {
        //   delay: 3000,
        //   disableOnInteraction: false,
        //   reverseDirection:false
        // }
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
      subscription:''
    }
  },
  created () {
    this.getUser()
    this.toSubscription()
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
      this.$router.push({ path: url, query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style } })
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

   async test(){
    // console.log('aa')
    // this.$OneSignalVue.on('subscriptionChange', function(isSubscribed) {
    //   console.log("The user's subscription state is now:", isSubscribed);
    // });
      // let that = this
      let subscription = that.subscription
      let param ={
        subscriptionJson:subscription,
        payload:'test',
        public_key: 'BP75YB6apr3U36uUoAGd_oEF4pK3QLu4RQl5jKA7SBvjPs5ssoQzVZKccSqKH-PXBgB5AAp_F4knCx3QRR9Pavg',
        private_key: '6ZAkoZHBvfPRq-0KLIK2ePLZ6HBmpOWVWae2DEuz0Lg'
      }
      console.log(param)
      await HttpPost('/sendSubscriptionJson', param )

      // const webpush = require('web-push')
      // const vapidKeys = {
      //   publicKey: 'BP75YB6apr3U36uUoAGd_oEF4pK3QLu4RQl5jKA7SBvjPs5ssoQzVZKccSqKH-PXBgB5AAp_F4knCx3QRR9Pavg',
      //   privateKey: '6ZAkoZHBvfPRq-0KLIK2ePLZ6HBmpOWVWae2DEuz0Lg'
      // }
      // webpush.setVapidDetails(
      //   'mailto:your-email@provider.com',
      //   vapidKeys.publicKey,
      //   vapidKeys.privateKey
      // )
      // webpush.setGCMAPIKey('<Your GCM API Key Here>')

      // webpush.sendNotification(subscription, 'aaa')

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

    subscribeUser(swRegistration) {          
        const applicationServerPublicKey = 'BP75YB6apr3U36uUoAGd_oEF4pK3QLu4RQl5jKA7SBvjPs5ssoQzVZKccSqKH-PXBgB5AAp_F4knCx3QRR9Pavg'
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
                  let param = {
                    openid:this.openid,
                    subscription:JSON.stringify(subscription)
                  }
                  this.HttpPost('/updateSubscription',param)
              })
              .catch(function(err) {
                  console.log('no subscribed: ', err);
              });
            }

        })
        // 用户不同意或者生成失败
        .catch(function(err) {
            console.log('no permission: ', err);
        });
    },

    toSubscription(){
      let that = this
      let openid = this.openid
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js', { scope: '/' }).then(function (registration) { 
        
        Notification.requestPermission().then(status => {
          console.log('notification: ',status)
        if (status == 'granted') {
            console.log('show title')
            registration.showNotification('通知已授权')
          }
        })
        registration.pushManager.getSubscription().then(function(subscription) {
              // console.log(subscription)
              if (subscription) {
                console.log('已经订阅');
                console.log(JSON.stringify(subscription));
                let param = {
                    openid:openid,
                    subscription:JSON.stringify(subscription)
                  }
                  that.HttpPost('/updateSubscription',param)
              } else {
                console.log('没有订阅');
                that.subscribeUser(registration);
              }
          });
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }).catch(function (err) {
        console.log('ServiceWorker registration failed: ', err);
      });
      }
    }

  }
}
</script>

<style scoped>
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
    scale: 0.8 !important;
}

.banner .swiper-container  .swiper-wrapper .swiper-slide-next {
    scale: 0.8 !important;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-prev img {
    scale: 0.8 !important;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-next img {
   scale: 0.8 !important;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-active {
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
