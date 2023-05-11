<template>
    <div>
      <div style="display: block;position: fixed;background-color: #fff;width: 100%;top: 0;">
        <div class="avatar">
          <div style="margin-top: auto;">
            <h1>HI,{{ nick_name }} ({{ mode }})</h1>
          </div>
          <div>
            <!-- <img v-if="isBell1" @click="notifyMe()" class="notice" src="../assets/bell1.png" alt="" >
            <img v-if="isBell2" @click="notifyMe()" class="notice" src="../assets/bell2.png" alt="" > -->
            <img :src="avatarurl" alt="" style="width: 30px;height: 30px;border-radius: 50%; position: relative;margin-left: 10px;margin-top: 5px;">
          </div>
        </div>
      </div>

      <div style="margin-top: 10%;" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
        <div style="display: flex;flex-direction: row;justify-content: space-between;">
          <h2 @click="$router.push('/Login')">{{ hello }}</h2>
          <div style="display: flex;margin-right: 5%;">
            <img @click="click('/announcementrecord')" class="notice" src="../assets/notice.png" alt="" >
          </div>
        </div>

        <div>
          <div style="justify-content: left;display: flex;margin-top: 5%;margin-bottom: 15px;flex-direction: column;" v-for="(item,index_out) in items">
            <div class="covers" :style="{display:MinDisplay}">
                <div class="cover" v-for="(img,index) in item.images" :key='img'>
                  <img :src="img.src" width="90%" class="min" @click="ZoomIn(index_out+'_'+index)" alt="">
                </div>
            </div>

            <div class="max" :style="{display:display}">
                <div @click="ZoomOut"  v-for="(img,index) in item.images" :key='img' :class="[index_out+'_'+index===ShowIndex?'active':'None']" ><img :src="img.src" width="100%"></div>
            </div>

            <div  class="foot" :style="{display:MinDisplay}">
              <div style="font-size: medium;color: rgb(140, 219, 226);margin-top: 5px;margin-bottom: 5px;">老师点评: {{ item.comment }}</div>
    
              <div style="font-size: x-small;font-weight: bold;color: #a3b2b3;margin-top: 5px;">{{ studio }}  {{ item.create_time}}</div>
              <el-divider></el-divider>
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
import { Mp3Url } from '@/api'

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
      MinDisplay:'flex',
      ShowIndex:0,
      display: 'none',
      page:1
    }
  },

  created () {
    this.getUser()
    this.subscriptionInit()
  },

  mounted() {

  },
  methods: {
    // load () {
    //     this.count += 20
    //     // console.log(this.count)
    // },

    async getUser () {
      let that = this

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
      console.log(that.send_time)
      
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

      that.getGrowthRecord(1)


    },


    async getGrowthRecord (page) {
      let that = this;
      let param ={
          studio:that.studio,
          student_name:'李冰冰',
          page:page,
          openid:that.openid
        }
      const growth = await HttpPost('/getGrowthRecord', param)
      let growth_data = growth.data;
      for( var i in growth_data){
          const uuids = growth_data[i].uuids
          growth_data[i]["isMp3"] = false
          const mp3_url_get = growth_data[i].mp3_url
          console.log(mp3_url_get)
          if(mp3_url_get.replace('undefined','').replace('no_mp3_url','').length > 0){
            let mp3_url = Mp3Url + mp3_url_get
            growth_data[i]["mp3_url"] = mp3_url
            growth_data[i]["isMp3"] = true
          }
          
          let comment = growth_data[i].comment
          if(comment == 'no_comment'){
            growth_data[i]["comment"] = '暂无文字点评'
          }

          let images =[]
          if(uuids){
            let uuidslist =uuids.split(",");
            for(let i in uuidslist){
                let url = ImageUrl + uuidslist[i];
                var json = {
                  src:url
                }
                images.push(json);
            }
            growth_data[i]["images"] = images;
          }
      }
      that.items = growth_data
      console.log(growth_data)
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
