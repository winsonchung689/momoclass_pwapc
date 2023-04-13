<template>
    <div>
      <div style="display: flex;direction: row;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ header }}</div>
      </div>
      <div class="avatar">
        <div style="display: flex;justify-content: center;">
          <el-avatar shape="square" :size="70" :fit="cover" :src="avatarurl"></el-avatar>
        </div>
        <div style="display: flex;justify-content: center;font-size: larger;font-weight: bold;color: #4b415f5c;font-family: Helvetica Neue">{{ nick_name }}</div>
        <div style="display: flex;justify-content: center;font-size: small;font-weight: bold;color: #afb3b1;"> 过期时间:{{ expired_time }}</div>
      </div>
      <el-divider ></el-divider>
      <div style="margin-top: 10px;">
        <div style="display: flex;justify-content: row;">
          <img style="width: 40px;height: 40px;margin-right: 20px;" src="@/assets/access.png" alt="">
          <div style="margin-top: 10px;font-weight: bolder;font-size: medium;color: #4b415f5c;">权限管理</div>
        </div>
        <el-divider bolder-style="dashed"></el-divider>
      </div>      
    </div>
</template>

<script>
import { HttpGet } from '@/api'
import { HttpPost } from '@/api'

export default {
  name: 'Me',
  data () {
    return {
      items:[],
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      studio: this.$route.query.studio,
      header:'个人中心',
      avatarurl:'',
      nick_name:'',
      expired_time:'unlimited'
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
        console.log(user_data)
        that.avatarurl = user_data.avatarurl
        that.nick_name = user_data.nick_name
        if(that.role === 'boss'){
          that.expired_time = user_data.expired_time
        }
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

</style>
