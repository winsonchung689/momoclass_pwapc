<template>
    <div>
      <div style="display: flex;direction: row;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ header }}</div>
      </div>

      <div style="justify-content: center;display: flex;margin-top: 5%;" v-for="item of items">
          <div class="lesson">
            <img style="width: 50px;height: 50px;border-radius: 15%;margin-left: 20px;margin-top: 20px;" :src="item.avatarurl" alt="">

            <div style="margin-left: 40px;margin-top: 10px;">
              <div style="font-size: small;display: flex;direction: row;font-weight: bolder;">
                <div style="margin-right: 5px;color: #4d67e8;">科目: {{ item.subject }} </div>
              </div>

              <div style="font-weight: bolder;font-size: medium;color: #43504a;">{{ item.student_name }}  (家长:{{ item.parent }})</div>
              <div style="font-weight: bold;color: #a0a3a7;font-size: small;display: flex;direction: row;margin-top: 5px;">
                <div style="margin-right: 5px;">总积分: {{ item.points }} </div>
                <div style="margin-right: 5px;">扣课: {{ item.minus }}/次 </div>
                <div style="margin-right: 5px;">积分: {{ item.coins }}/课</div>
              </div>
              <div style="font-weight: bolder;font-size: small;display: flex;direction: row;margin-top: 5px;">
                <div style="color: #4d67e8;margin-right: 5px;">总课时: {{ item.left_amount }} </div>
                <div style="color: #4d67e8;margin-right: 5px;">余课时: {{ item.total_amount }} </div>
              </div>
              <el-progress :percentage="item.percentage"></el-progress>
            </div>

          </div>
      </div>
    </div>
</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'

export default {
  name: 'Students',
  data () {
    return {
      items:[],
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      studio: this.$route.query.studio,
      header:'学生专区'
    }
  },

  created () {
    this.getUser()
  },

  methods: {
    async getUser () {
      let that = this

      let param = {
        studio: that.studio,
        student_name: 'all',
        subject:'全科目'
      }
      const lessons = await HttpPost('/getLesson', param)
      const lessons_data = lessons.data
      console.log(lessons_data)
      that.items =[]
      for( var i in lessons_data){
          const total_amount = lessons_data[i].total_amount
          const left_amount = lessons_data[i].left_amount
          const subject = lessons_data[i].subject
          const points = lessons_data[i].points
          const studio = lessons_data[i].studio
          const student_name = lessons_data[i].student_name
          let avatarurl = lessons_data[i].avatarurl
          if(avatarurl=='未绑定'){
            avatarurl = "https://www.momoclasss.xyz:443/file/uploadimages/fa8a634a-40c2-412a-9a95-2bd8d5ba5675.png"
          }
          const parent = lessons_data[i].parent
          const percentage = lessons_data[i].percent
          const minus = lessons_data[i].minus
          const coins = lessons_data[i].coins


          var json ={}
          json.studio = studio
          json.subject = subject
          json.student_name = student_name
          json.total_amount = total_amount
          json.left_amount = left_amount
          json.points = points
          json.avatarurl = avatarurl
          json.parent = parent
          json.percentage = percentage
          json.minus = minus
          json.coins = coins
          
          that.items.push(json)
      }

     

    },

    goOff() {
      this.$router.go(-1);
    },

    goIn(studio,subject,student_name) {
      this.$router.push({ path: '/records', query: { studio: studio,subject: subject,student_name: student_name,role:this.role,openid:this.openid } })
    },

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.lesson{
  background-color: rgb(226, 235, 217);
  width: 85%;
  height: 150px;
  border-radius: 0.5rem;
  margin-bottom: 6px;
  flex-direction: row;
  display: flex;
  color: #a0a3a7;
}

.el-icon-arrow-left{
  margin-left: 5px;
  margin-top: 10px;
  scale: 1.5;
}

</style>
