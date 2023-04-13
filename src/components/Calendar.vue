<template>
    <div>
      <div style="display: flex;direction: row;margin-bottom: 5px;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ header }}</div>
      </div>

      <div style="height: 50%;width: 100%;">
        <el-calendar v-model="value">
        <template slot="dateCell" slot-scope="{data}">
        <!--自定义内容-->
          <div>
             <div class="calendar-day" >{{data.day.split('-').slice(2).join('-') }}</div>
          </div>
      </template>
      </el-calendar>
      </div>


      <el-table :data="tableData" style="width: 100%;font-size: small;">
        <el-table-column type="expand">
            <template slot-scope="props">
                <div v-for="(item,index) in props.row.children" :key="index">
                  <div style="display: flex;flex-direction: row;margin-left: 20px;justify-content: left;margin-bottom: 20px;">
                    <div style="margin-right: 5px;font-size: small;margin-top: 10px;">{{ item.student_name }}</div>
                    <el-button type="primary" plain style="margin-right: 5px;font-size: small;">{{ item.leave }}</el-button>
                    <el-button type="primary" plain style="margin-right: 5px;font-size: small;">{{ item.sign_up }}</el-button>
                    <el-button type="primary" plain style="margin-right: 5px;font-size: small;">{{ item.comment_status }}</el-button>
                  </div>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="subject" label="科目" width="120">
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
      let tmp = []
      for( var i=1; i < lessons_data.length; i++ ){
          const subject = lessons_data[i].subject
          const class_number = lessons_data[i].class_number
          const duration = lessons_data[i].duration
          const id = lessons_data[i].id

          let label = subject+class_number+duration
          let index = tmp.indexOf(label)
          if(index < 0){
            var json = {};
            json.subject = subject
            json.class_number = class_number
            json.duration = duration
            json.id = id
            tmp.push(label)

            let param = {
              date_time: that.date_time,
              studio:that.studio,
              subject:subject,
              openid:that.openid,
              duration:duration,
              class_number:class_number.replace('(插班生)','')
            }
            const details = await HttpPost('/getScheduleByClass', param)
            console.log(class_number)
            let details_data = details.data;
            console.log(details_data)
            
            var children = []
            for(var i=0; i < details_data.length; i++ ){
              var json_detail = {}
              const student_name = details_data[i].student_name
              const id = details_data[i].id
              const leave = details_data[i].leave
              const sign_up = details_data[i].sign_up
              const comment_status = details_data[i].comment_status

              json_detail.student_name = student_name
              json_detail.leave = leave
              json_detail.sign_up = sign_up
              json_detail.comment_status = comment_status
              json_detail.id = id
              children.push(json_detail)
            }
            json.children = children

            that.tableData.push(json)
          }
      }

      console.log(that.tableData)

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

.el-calendar .el-calendar__body .el-calendar-table__row .el-calendar-day {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    padding: 8px;
    height: 50px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

</style>
