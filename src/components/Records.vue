<template>
    <div>
      <div style="display: flex;direction: row;margin-bottom: 15px;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ student_name }}({{ subject }})</div>
      </div>

      <div style="justify-content: center;display: flex;margin-bottom: 15px;">
        <div class="container">
          <div class="item" @click="signInRecord(subject,studio,student_name)">
            <div class="content">
              <div style="display: flex;justify-content: center;">
                <img style="width: 40px;height: 40px;" src="@/assets/signin.png" alt="">
              </div>
              <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">签到记录</div>
            </div>
          </div>

          <div class="item" @click="leaveRecord(subject,studio,student_name)">
            <div class="content">
              <div style="display: flex;justify-content: center;">
                <img style="width: 40px;height: 40px;" src="@/assets/leave.png" alt="">
              </div>
              <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">请假记录</div>
            </div>
          </div>
        </div>
      </div>

      <div style="justify-content: center;display: flex;margin-bottom: 15px;;">
        <div class="container">
          <div class="item" @click="absentRecord(subject,studio,student_name)">
            <div class="content">
              <div style="display: flex;justify-content: center;">
                <img style="width: 40px;height: 40px;" src="@/assets/absent.png" alt="">
              </div>
              <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">旷课记录</div>
            </div>
          </div>

          <div class="item" @click="growthRecord(subject,studio,student_name)">
            <div class="content">
              <div style="display: flex;justify-content: center;">
                <img style="width: 40px;height: 40px;" src="@/assets/growth.png" alt="">
              </div>
              <div style="display: flex;justify-content: center;font-weight: bold;font-size: medium;color: #517cf1;">成长记录</div>
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
  name: 'Records',
  data () {
    return {
      student_name:this.$route.query.student_name,
      subject:this.$route.query.subject,
      studio:this.$route.query.studio,
      role:this.$route.query.role,
      openid:this.$route.query.openid,
    }
  },

  created () {
  },

  methods: {

    signInRecord (subject,studio,student_name) {
      this.$router.push({ path: '/signinrecord', query: { subject: subject,studio: studio,student_name: student_name,role:this.role,openid:this.openid } })
    },

    leaveRecord (subject,studio,student_name) {
      this.$router.push({ path: '/leaverecord', query: { subject: subject,studio: studio,student_name: student_name,role:this.role,openid:this.openid,leave_type:'请假' } })
    },

    absentRecord (subject,studio,student_name) {
      this.$router.push({ path: '/leaverecord', query: { subject: subject,studio: studio,student_name: student_name,role:this.role,openid:this.openid,leave_type:'旷课' } })
    },

    growthRecord (subject,studio,student_name) {
      this.$router.push({ path: '/growthrecord', query: { subject: subject,studio: studio,student_name: student_name,role:this.role,openid:this.openid } })
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
  width: 80%;
  justify-content: space-between;
  margin-bottom: 15px;
  
}

.item{
  background-color: #d8e8e1;
  width: 150px;
  height: 150px;
  border-radius: 1rem;

  /* color: #517cf1; */
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
