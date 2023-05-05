<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 15%;">
          <div v-if="isBoss" style="justify-content: center;display: flex;margin-bottom: 15px;margin-top: 5%;">
            <div class="container">

              <div class="item" @click="timeTable(subject)">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 50px;height: 50px;" src="@/assets/timetable.png" alt="">
                  </div>
                  <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">课程表</div>
                </div>
              </div>

              <div class="item" @click="calender(subject,studio,student_name)">
                <div class="content">
                  <div style="display: flex;justify-content: center;">
                    <img style="width: 50px;height: 50px;" src="@/assets/tosignin.png" alt="">
                  </div>
                  <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">签到处</div>
                </div>
              </div>

            </div>
          </div>

          <div style="justify-content: center;display: flex;margin-bottom: 15px;">
            <div class="container">
                <div v-if="isBoss" class="item" @click="school(subject)">
                  <div class="content">
                    <div style="display: flex;justify-content: center;">
                      <img style="width: 50px;height: 50px;" src="@/assets/school.png" alt="">
                    </div>
                    <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">学员管理</div>
                  </div>
                </div>

                <div class="item" @click="commentCenter(subject)">
                    <div class="content">
                      <div style="display: flex;justify-content: center;">
                        <img style="width: 50px;height: 50px;" src="@/assets/comment.png" alt="">
                      </div>
                      <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">课评中心</div>
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

export default {
  name: 'WorkBenches',
  data () {
    return {
      subject:this.$route.query.subject,
      studio:this.$route.query.studio,
      role:this.$route.query.role,
      openid:this.$route.query.openid,
      comment_style:this.$route.query.comment_style,
      send_time:this.$route.query.send_time,
      header: '工作台',
      isBoss:false
    }
  },

  created () {
    this.onload()
  },

  methods: {

    onload () {
      let that = this
      if(that.role=='boss' || that.role == 'teacher'){
        that.isBoss = true
      }
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

    goOff () {
      this.$router.go(-1);
    },

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
  background-color: #b7f4d9;
  width: 150px;
  height: 150px;
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

</style>
