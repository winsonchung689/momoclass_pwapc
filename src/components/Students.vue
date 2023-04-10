<template>
    <div>
      <div style="display: flex;direction: row;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ header }}</div>
      </div>
      <div style="justify-content: center;display: flex;margin-top: 5%;" v-for="item of items">
          <div class="lesson" @click="goIn(item.studio,item.subject,item.student_name)">
            <img style="width: 50px;height: 50px;border-radius: 15%;margin-left: 20px;margin-top: 20px;" src="@/assets/logo.png" alt="">
            <div style="margin-left: 40px;margin-top: 20px;">
              <div style="font-weight: bolder;font-size: large;color: #43504a;">{{ item.student_name }}</div>
              <div style="color: #c1c5c7;font-size: small;display: flex;direction: row;margin-top: 5px;">
                <div style="margin-right: 5px;">科目: {{ item.subject }} </div>
                <div style="margin-right: 5px;">课时: {{ item.left_amount }}/{{ item.total_amount }} </div>
                <div style="margin-right: 5px;">积分: {{ item.points }} </div>
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
  name: 'Students',
  data () {
    return {
      items:[],
      openid: this.$route.query.openid,
      header:'学生专区'
    }
  },

  created () {
    this.getUser()
  },

  methods: {
    async getUser () {
      let that = this
      const users = await HttpGet('/getUserByOpenid?openid=' + that.openid)
      const user_data = users.data
      for ( var i in user_data){
        const student_name = user_data[i].student_name
        const studio = user_data[i].studio

        let param ={
          student_name:student_name,
          studio:studio
        }

        const lessons = await HttpPost('/getLessonByName',param)
        const lessons_data = lessons.data

        for( var i in lessons_data){
          const total_amount = lessons_data[i].total_amount
          const left_amount = lessons_data[i].left_amount
          const subject = lessons_data[i].subject
          const points = lessons_data[i].points
          var json ={};
          json.studio = studio
          json.subject = subject
          json.student_name = student_name
          json.total_amount = total_amount
          json.left_amount = left_amount
          json.points = points
          that.items.push(json)
        }
      }

    },

    goOff() {
      this.$router.go(-1);
    },

    goIn(studio,subject,student_name) {
      this.$router.push({ path: '/signin', query: { studio: studio,subject: subject,student_name: student_name } })
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
  /* color: #43504a; */
}

.el-icon-arrow-left{
  margin-left: 5px;
  margin-top: 10px;
  scale: 1.5;
}

</style>
