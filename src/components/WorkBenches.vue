<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: center; width: 100%;">
        <div style=" width: 100%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 15%;">
        
          <div v-if="isTeacher" style="justify-content: center;display: flex;margin-bottom: 15px;margin-top: 5%;">
            <div class="container">

              <div class="item" @click="timeTable(subject)">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 70px;height: 70px;" src="@/assets/timetable.png" alt="">
                  </div>
                  <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">排课表</div>
                </div>
              </div>

              <div class="item" @click="calender(subject,studio,student_name)">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 70px;height: 70px;" src="@/assets/tosignin.png" alt="">
                  </div>
                  <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">签到处</div>
                </div>
              </div>

              <div class="item" @click="commentCenter(subject)">
                  <div class="content">
                    <div style="display: flex;justify-content: center;">
                      <img style="width: 70px;height: 70px;" src="@/assets/comment.png" alt="">
                    </div>
                    <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">课评中心</div>
                  </div>
              </div>

            </div>
          </div>


          <div style="justify-content: center;display: flex;margin-bottom: 15px;">
            <div class="container">

                <div v-if="isBoss" class="item" @click="accountBook()">
                  <div class="content">
                    <div style="display: flex;justify-content: center;">
                      <img style="width: 70px;height: 70px;" src="@/assets/account_book.png" alt="">
                    </div>
                    <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">账本</div>
                  </div>
                </div>

                <div class="item" @click="classSystem()">
                  <div class="content">
                    <div style="display: flex;justify-content: center;">
                      <img style="width: 70px;height: 70px;" src="@/assets/system.png" alt="">
                    </div>
                    <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">课程体系</div>
                  </div>
                </div>

                <div v-if="isTeacher" class="item" @click="school(subject)">
                  <div class="content">
                    <div style="display: flex;justify-content: center;">
                      <img style="width: 70px;height: 70px;" src="@/assets/school.png" alt="">
                    </div>
                    <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">学员管理</div>
                  </div>
              </div>

            </div>
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

          <div style="width: 15px;height: 15px;">
            <img v-if="isBell1" @click="notifyMe()" class="notice" src="../assets/bell1.png" alt="" >
            <img v-if="isBell2" @click="notifyMe()" class="notice" src="../assets/bell2.png" alt="" >
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
</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import { sendNotification } from '@/api'

export default {
  name: 'WorkBenches',
  components: {
    
  },
  data () {
    return {
      subject:this.$route.query.subject,
      studio:this.$route.query.studio,
      role:this.$route.query.role,
      openid:this.$route.query.openid,
      comment_style:this.$route.query.comment_style,
      send_time:this.$route.query.send_time,
      header: '工作台',
      isBoss:false,
      isTeacher:false,
      student_string:'',
      mp3url:'',
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
      schedule_data:[],
    }
  },

  created () {
    this.onload()
    this.subscriptionInit()
  },

  mounted() {
    this.notifyMe()
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

      // console.log(that.studio,that.weekday,that.date,that.openid)


      let param ={
          studio:that.studio,
          dayofweek:that.weekday,
          date:that.date,
          openid:that.openid,
          subject: that.subject,
          student_name:'all'
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

    onload () {
      let that = this
      if(that.role=='boss' || that.role == 'teacher'){
        that.isTeacher = true
      }

      if(that.role=='boss'){
        that.isBoss = true
      }

      this.getUser()
    },

    timeTable (subject) {
      this.$router.push({ path: '/timetable', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,send_time:this.send_time } })
    },

    calender (subject) {
      this.$router.push({ path: '/calendar', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid } })
    },

    school (subject) {
      this.$router.push({ path: '/school', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid } })
    },

    commentCenter (subject) {
      this.$router.push({ path: '/commentcenter', query: { subject: subject,studio: this.studio,role:this.role,openid:this.openid,comment_style:this.comment_style } })
    },

    accountBook () {
      this.$router.push({ path: '/accountbook', query: { studio: this.studio,role:this.role,openid:this.openid } })
    },

    classSystem(){
      this.$router.push({ path: '/classsystem', query: { studio: this.studio,role:this.role,openid:this.openid } })
    },

    goOff () {
      this.$router.go(-1);
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.container{
  flex-direction: row;
  display: flex;
  width: 90%;
  justify-content: space-between;
  margin-bottom: 15px;
  
}

.item{
  width: 90px;
  height: 90px;
  border-radius: 1rem;

  /* color: #81a1eb; */
}

.content{
  justify-content: center;
  display: flex;
  margin-top: 20%;
  flex-direction: column;
}

.el-icon-arrow-left{
  margin-left: 5px;
  margin-top: 10px;
  scale: 1.5;
}

.notice{
  width: 30px;
  height: 30px;
  border-radius: 0.5rem;
}
</style>
