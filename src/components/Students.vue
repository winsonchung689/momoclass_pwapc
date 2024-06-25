<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: center; width: 100%;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 2%; margin-bottom: 30px;">
        <div style="display:flex;justify-content: left;margin-top: 5px;margin-left: 2%;flex-direction: row;">
          <div v-if="isBoss" style="margin-right: 15px;"> 
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="state"
              :fetch-suggestions="querySearch"
              placeholder="请输入学生名"
              @select="handleSelect">
              <template slot-scope="{ item }">
                <div class="name">{{ item.student_name }}</div>
              </template>
            </el-autocomplete>
          </div>
          
          <el-button-group>
            <el-button @click="getStudents()" type="primary">刷新<i class="el-icon-refresh el-icon--right"></i></el-button>
          </el-button-group>
        </div>

        <div style="justify-content: center;display: flex;margin-top: 1%;" v-for="item of items">

          <div class="lesson">
            <img style="width: 50px;height: 50px;border-radius: 15%;margin-left: 20px;margin-top: 20px;" src="@/assets/logo.png" alt="">
            
            <div style="margin-left: 40px;margin-top: 10px;">
              <div style="font-weight: bolder;font-size: large;color: #43504a;">{{ item.student_name }}</div>
              <div style="color: #fff;font-size: small;display: flex;direction: row;margin-top: 5px;">
                <div style="margin-right: 5px;">科目: {{ item.subject }} </div>
                <div style="margin-right: 5px;">积分: {{ item.points }} </div>
              </div>
              <div style="color: #fff;font-size: small;display: flex;direction: row;margin-top: 5px;">
                <div style="margin-right: 5px;">历史课时: {{ item.left_amount }} </div>
                <div style="margin-right: 5px;">余课时: {{ item.left_amount }} </div>
              </div>
            </div>

            <div style="display: flex;flex-direction: row;justify-content: space-between;width: 30%;margin-left: 5%;align-items: center;">
              <div>
                <el-button @click="signInRecord(item.subject,item.student_name)">签到记录</el-button>
              </div>
              <div>
                <el-button @click="leaveRecord(item.subject,item.student_name)">请假记录</el-button>
              </div>
              <div>
                <el-button @click="growthRecord(item.subject,item.student_name)">成长记录</el-button>
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
  name: 'Students',
  components: {
  },
  data () {
    return {
      items:[],
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      studio: this.$route.query.studio,
      header:'学生专区',
      allstudents:[],
      state:'',
      isBoss:false
    }
  },

  created () {
    this.getStudents()
  },

  methods: {
    async getStudents () {
      let that = this

      if(that.role === 'boss' || that.role == 'teacher'){
        that.isBoss = true
        let param = {
          studio: that.studio,
          student_name: 'all',
          subject:'全科目',
          openid:that.openid
        }
        const lessons = await HttpPost('/getLesson', param)
        const lessons_data = lessons.data
        // console.log(lessons_data)
        that.items =[]
        that.allstudents = []
        for( var i in lessons_data){
            const total_amount = lessons_data[i].total_amount
            const left_amount = lessons_data[i].left_amount
            const subject = lessons_data[i].subject
            const points = lessons_data[i].points
            const studio = lessons_data[i].studio
            const student_name = lessons_data[i].student_name
            var json ={};
            json.studio = studio
            json.subject = subject
            json.student_name = student_name
            json.total_amount = total_amount
            json.left_amount = left_amount
            json.points = points
            
            that.allstudents.push(json)
            that.items.push(json)
        }
        // console.log(that.allstudents)

      }else {
          const users = await HttpGet('/getUserByOpenid?openid=' + that.openid)
          const user_data = users.data
          for ( var i in user_data){
              const student_name = user_data[i].student_name
              const studio = user_data[i].studio
              let param ={
                student_name:student_name,
                studio:studio,
                openid:that.openid
              }
              const lessons = await HttpPost('/getLessonByName',param)
              const lessons_data = lessons.data
              that.items =[]
              for( var i in lessons_data){
                const total_amount = lessons_data[i].total_amount
                const left_amount = lessons_data[i].left_amount
                const subject = lessons_data[i].subject
                const points = lessons_data[i].points
                const student_name = lessons_data[i].student_name
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

      }
    },

    async handleSelect (item) {
      let that = this
      const student_name = item.student_name
      that.state = student_name
      let subject_get = student_name.split('_')[1]
      let student_name_get = student_name.split('_')[0]
      // console.log(subject_get,student_name_get)
      let param = {
          studio: that.studio,
          student_name: student_name_get,
          subject:subject_get,
          openid:that.openid
        }
        const lessons = await HttpPost('/getLesson', param)
        const lessons_data = lessons.data
        that.items =[]
        for( var i in lessons_data){
            const total_amount = lessons_data[i].total_amount
            const left_amount = lessons_data[i].left_amount
            const subject = lessons_data[i].subject
            const points = lessons_data[i].points
            const studio = lessons_data[i].studio
            const student_name = lessons_data[i].student_name
            var json ={};
            json.studio = studio
            json.subject = subject
            json.student_name = student_name
            json.total_amount = total_amount
            json.left_amount = left_amount
            json.points = points
            
            that.items.push(json)
        }
    },

    createFilter(queryString) {
      return (list) => {
        return (list.student_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    signUpRecord (subject,student_name) {
      this.$router.push({ path: '/signUpRecord', query: { subject: subject,studio: this.studio,student_name: student_name,role:this.role,openid:this.openid } })
    },

    leaveRecord (subject,student_name) {
      this.$router.push({ path: '/leaverecord', query: { subject: subject,studio: this.studio,student_name: student_name,role:this.role,openid:this.openid,leave_type:'请假' } })
    },

    absentRecord (subject,student_name) {
      this.$router.push({ path: '/leaverecord', query: { subject: subject,studio: this.studio,student_name: student_name,role:this.role,openid:this.openid,leave_type:'旷课' } })
    },

    growthRecord (subject,student_name) {
      this.$router.push({ path: '/growthrecord', query: { subject: subject,studio: this.studio,student_name: student_name,role:this.role,openid:this.openid } })
    },

    querySearch(queryString,cb) {
      let that = this;      
      var list = []
      for(var i in that.allstudents){
        let json ={}
        let student_name = that.allstudents[i].student_name
        let subject = that.allstudents[i].subject
        json.student_name = student_name + '_' + subject
        list.push(json)
      }
      var results = queryString ? list.filter(this.createFilter(queryString)) : list;
      // 调用 callback 返回建议列表的数据
      cb(results);
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
  background-color: #ceab93;
  width: 95%;
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
