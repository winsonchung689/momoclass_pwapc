<template>
      <div class="bottom-navigation">
        <div style="margin-left: 10px;" @click="click('/community')">
          <img class="icon" :src="home_url" alt="" >
          <div class="icontext">主页</div>
        </div>
        <div  @click="click('/workbenches')">
          <img class="icon" :src="work_url" alt="" >
          <div class="icontext">工作台</div>
        </div>
        <div @click="click('/post')" >
          <img class="icon" src="../assets/post.png" alt="" >
          <div class="icontext">发布</div>
        </div>
        <div  @click="click('/students')">
          <img class="icon" :src="student_url" alt="" >
          <div class="icontext">学生区</div>
        </div>
        <div style="margin-right: 10px;"  @click="click('/me')">
          <img class="icon" :src="me_url" alt="" >
          <div class="icontext">我的</div>
        </div>
      </div>
  </template>
  
  <script>
  import { HttpPost } from '@/api'
  import { HttpGet } from '@/api'
  export default {
    name: 'Home',

    data () {
      return {
        home_url:'../assets/home2.png',
        work_url:'../assets/work1.png',
        student_url:'../assets/student1.png',
        me_url:'../assets/me1.png',
        openid:'',
        studio:'',
        role:'',
        subject:'',
        comment_style:'',
        send_time:'',
        drawer: false,
        direction: 'btt',

      }
    },

    created () {
      this.getUser()
    },

    methods: {
      async getUser () {
        let that = this
        if (document.cookie.length > 0) {
          var arr = document.cookie.split('; ')
          console.log(arr)
          for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=')
            if (arr2[0] === 'openid') {
              that.openid = arr2[1]
            }
          }
        } else {
          console.log('cookie_openid 为空!')
        }

        if(that.openid){
          const users = await HttpGet('/getUser?openid=' + that.openid)
          that.studio = users.data[0].studio,
          that.role = users.data[0].role,
          that.subject = users.data[0].subject,
          that.comment_style = users.data[0].comment_style,
          that.send_time = users.data[0].send_time
        }
        
      },

      click (url) {
        if(url == '/community'){
          this.home_url = '../assets/home2.png'
          this.work_url= '../assets/work1.png'
          this.student_url = '../assets/student1.png'
          this.me_url = '../assets/me1.png'
          console.log(this.home_url)

          this.$router.push({ path: url, query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style,send_time:this.send_time } })
        }else if(url == '/workbenches'){
          this.home_url = '../assets/home1.png'
          this.work_url= '../assets/work2.png'
          this.student_url = '../assets/student1.png'
          this.me_url = '../assets/me1.png'
          console.log(this.work_url)

          this.$router.push({ path: url, query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style,send_time:this.send_time } }),
          this.work_url= '../assets/work2.png'
        }else if(url == '/students'){
          this.home_url = '../assets/home1.png'
          this.work_url= '../assets/work1.png'
          this.student_url = '../assets/student2.png'
          this.me_url = '../assets/me1.png'

          this.$router.push({ path: url, query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style,send_time:this.send_time } })
        }else if(url == '/me'){
          this.home_url = '../assets/home1.png'
          this.work_url= '../assets/work1.png'
          this.student_url = '../assets/student1.png'
          this.me_url = '../assets/me2.png'

          this.$router.push({ path: url, query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style,send_time:this.send_time } })
        }else if(url == '/post'){
          this.$router.push({ path: url, query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style,send_time:this.send_time } })
        }

      },

    }
  }

  </script>


  <style scoped>
  .bottom-navigation {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    box-shadow: 0 3px 14px 2px rgba(0, 0, 0, .12);
    display: flex;
    background-color: #ffff;
    justify-content: space-between;
  }

  .icon{
  width: 20px;
  height: 20px;
  border-radius: 0.5rem;
  }

  .icontext{
    font-size: x-small;
    font-weight: bolder;
    justify-content: center;
    color: dimgray;
  }

  </style>