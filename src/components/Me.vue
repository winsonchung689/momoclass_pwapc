<template>
  
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: center; width: 100%;">
        <div style=" width: 100%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 15%;">

      <div class="avatar">
        <div style="display: flex;justify-content: center;">
          <el-avatar shape="square" :size="70" :fit="cover" :src="avatarurl"></el-avatar>
        </div>
        <div style="display: flex;justify-content: center;font-size: larger;font-weight: bold;color: #4b415f5c;font-family: Helvetica Neue;margin-bottom: 5px;">{{ nick_name }}</div>
        <div style="display: flex;justify-content: center;font-size: small;font-weight: bold;color: #afb3b1;"> 过期时间:{{ expired_time }}</div>
        <div v-if="isShow" style="display: flex;justify-content: center;font-size: small;font-weight: bold;color: #afb3b1;"> 会员身份:{{ member }}</div>
      </div>
      <el-divider ></el-divider>

      <div v-if="isBoss" style="margin-top: 10px;">
        <div @click="authorization()" class="card">
          <img style="width: 40px;height: 40px;margin-right: 20px;margin-left: 30px;margin-top: 15px;" src="@/assets/access.png" alt="">
          <div style="margin-top: 25px;font-weight: bolder;font-size: medium;color: #4b415f5c;">权限管理</div>
        </div>
        <el-divider bolder-style="dashed"></el-divider>
      </div>    
      
      
      </div>
    </div>
    
</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'

export default {
  name: 'Me',
  components: {
  },
  data () {
    return {
      items:[],
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      studio: this.$route.query.studio,
      subject: this.$route.query.subject,
      comment_style: this.$route.query.comment_style,
      header:'个人中心',
      avatarurl:'',
      nick_name:'',
      expired_time:'unlimited',
      isBoss:false,
      member:'',
      isShow:false
    }
  },

  created () {
    this.getUser()
  },

  methods: {

    async getUser () {
      let that = this;
      let param = {
          openid: that.openid,
        }
        const users = await HttpPost('/getUser', param)
        let user_data = users.data[0]
        // console.log(user_data)
        that.avatarurl = user_data.avatarurl
        that.nick_name = user_data.nick_name
        that.member = user_data.member
        if(that.role === 'boss' || that.role == 'teacher'){
          that.expired_time = user_data.expired_time
          that.isShow = true
        }

        if(that.role === 'boss'){
          that.isBoss = true
        }
    },

    authorization () {
      this.$router.push({ path: '/authorization', query: { openid: this.openid,role:this.role,studio:this.studio,subject:this.subject,comment_style:this.comment_style } })
    },

    goOff() {
      this.$router.go(-1);
    },

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.lesson{
  background-color: #b7f4d9;
  width: 85%;
  height: 90px;
  border-radius: 0.5rem;
  margin-bottom: 6px;
  flex-direction: row;
  display: flex;
  color: #4b415f5c;
}

.el-icon-arrow-left{
  margin-left: 5px;
  margin-top: 10px;
  scale: 1.5;
}

.avatar{
  display: flex;
  justify-content: center;
  margin-top: 20%;
  flex-direction: column;
}

.card{
  display: flex;
  justify-content: row;
  background-color:#d3e7e6;
  width: 90%;
  border-radius: 0.5rem;
  height: 80px;
  margin-left: 20px;
}

</style>
