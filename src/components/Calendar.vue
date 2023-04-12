<template>
    <div>
      <div style="display: flex;direction: row;margin-bottom: 5px;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ header }}</div>
      </div>

      <el-calendar v-model="value">
        <template slot="dateCell" slot-scope="{data}">
        <!--自定义内容-->
          <div>
             <div class="calendar-day" >{{data.day.split('-').slice(2).join('-') }}</div>
          </div>
      </template>
      </el-calendar>

      <el-table :data="tableData" style="width: 100%;font-size: small;" max-height="750" default-expand-all :tree-props="{children: 'children', hasChildren: true}">
        <el-table-column prop="subject" label="科目"  width="120">
        </el-table-column>
        <el-table-column prop="class_number" label="班号" width="120">
        </el-table-column>
        <el-table-column prop="duration" label="时间段" width="120">
        </el-table-column>
      </el-table>

    </div>
</template>

<script>
import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
export default {
  name: 'Timetable',
  data () {
    return {
      subject:this.$route.query.subject,
      studio:this.$route.query.studio,
      role:this.$route.query.role,
      openid:this.$route.query.openid,
      header: '签到处',
      tableData: [],
      isShow:false,
      value: new Date(),
      date_time: ''
    }
  },

  watch: {
    value: function() {
        this.date_time=''
        var year = this.value.getFullYear()
        var month = this.value.getMonth() + 1
        var date=this.value.getDate()
        if (date >= 1 && date <= 9) {
            date = "0" + date;
        }
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        let date_time = year + '-' + month + '-' + date
        this.date_time = date_time
        console.log(year + '-' + month + '-' + date) 
        this.getLesson()

    }
},

  created () {
    this.getLesson();
  },

  methods: {
    async getLesson () {
      let that = this;
      if(that.date_time == ''){
        var year = new Date().getFullYear()
        var month = new Date().getMonth() + 1
        var date= new Date().getDate()
        if (date >= 1 && date <= 9) {
            date = "0" + date;
        }
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        let date_time = year + '-' + month + '-' + date
        that.date_time = date_time
      }

      let param ={
          date_time: that.date_time,
          studio:that.studio,
          subject:that.subject,
          openid:that.openid,
          test:'0'
        }
      const lessons = await HttpPost('/getSchedule', param)
      let lessons_data = lessons.data;
      console.log(lessons_data)
      that.tableData = []
      for( var i=1; i < lessons_data.length; i++ ){
          const subject = lessons_data[i].subject
          const class_number = lessons_data[i].class_number
          const duration = lessons_data[i].duration
          const student_name = lessons_data[i].student_name



          var json ={};
          json.subject = subject
          json.class_number = class_number
          json.duration = duration
          
          that.tableData.push(json)
      }
    },

    goOff () {
      this.$router.go(-1);
    },

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.el-icon-arrow-left{
  margin-left: 5px;
  margin-top: 10px;
  scale: 1.5;
}

.el-calendar-table .el-calendar-table_row .el-calendar-day {
    height: 55px;
}

</style>
