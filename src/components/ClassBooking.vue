<template>
  <div>
    <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
      <div>
        <i class="el-icon-arrow-left" @click="goOff()"></i>
      </div>
      <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
    </div>
  
    <div style="margin-top: 2%;">
      <div v-if="isCalender" style="height: 50%;width: 100%;font-size: large;justify-content: center;">
        <el-calendar v-model="value">
          <template slot="dateCell" slot-scope="{data}">
          <!--自定义内容-->
            <div>
              <div class="calendar-day" >{{data.day.split('-').slice(2).join('-') }}</div>
            </div>
        </template>
        </el-calendar>
      </div>


      <el-table :data="tableData" style="width: 100%;font-size: small;font-size: medium;">

        <el-table-column prop="subject" label="科目" >
        </el-table-column>
        <el-table-column prop="class_number" label="班号" >
        </el-table-column>
        <el-table-column prop="duration" label="时间段" >
        </el-table-column>
        <el-table-column prop="book_stauts" label="状态" >
        </el-table-column>
      </el-table>

    </div>
  </div>
    
</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import { sendNotification } from '@/api'
import { UploadFile } from '@/api'
import Recorder from 'js-audio-recorder'

const recorder = new Recorder({
          sampleBits: 16,               
          sampleRate: 16000,             
          numChannels: 1,
        }   
      );

recorder.onprogress = function(params) {
// console.log('--------------START---------------')
// console.log('录音时长(秒)', params.duration);
// console.log('录音大小(字节)', params.fileSize);
// console.log('录音音量百分比(%)', params.vol);
// console.log('当前录音的总数据([DataView, DataView...])', params.data);
// console.log('--------------END---------------')
}



export default {
  name: 'Timetable',
  data () {
    return {
      subject:this.$route.query.subject,
      studio:this.$route.query.studio,
      role:this.$route.query.role,
      openid:this.$route.query.openid,
      student_string:this.$route.query.student_string,
      header: '签到处',
      tableData: [],
      isBoss:true,
      value: new Date(),
      date_time: '',
      dialogFormVisible: false,
      leave_value:true,
      leave_student:'',
      leave_duration:'00:00-00:00',
      leave_type:'',
      mark_leave:'无备注',
      leave_subject:'',
      index1:'',
      index2:'',
      isLeave:false,
      isSignIn:false,
      isComment:false,
      class_count:1,
      sign_class_number:'',
      button:'',
      fileList:[],
      uuids:[],
      positive:5,
      discipline:5,
      happiness:5,
      class_target:'',
      class_comment:'',
      class_name:'',
      isCalender:true,
      mp3_url:'',
      record_duration:'standby',
      children:[]
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
        // console.log(year + '-' + month + '-' + date) 
        this.getLesson()

    }
},

  created () {
    this.getLesson();
  },

  methods: {

    startRecorder () {
      recorder.start().then(() => {
      }, (error) => {
      // 出错了
      console.log(`${error.name} : ${error.message}`);
      });

      this.record_duration = 'recording'
    },

    pauseRecorder () {
      let toltime = recorder.duration
      this.record_duration = Math.round(toltime)

      recorder.pause();
    },

    resumeRecorder () {
      this.record_duration = 'recording'
      recorder.resume()
    },

    stopRecorder () {
      let toltime = recorder.duration
      this.record_duration = Math.round(toltime)

      recorder.stop()
      this.getRecorder()
    },

    playRecorder () {
      this.record_duration = 'playing'
      recorder.play()
    },

    stopPlayRecorder () {
      this.record_duration = 'stanby'
      recorder.stopPlay();
    },

    async getRecorder(){
      let that = this
      let toltime = recorder.duration;//录音总时长
      let fileSize = recorder.fileSize;//录音总大小
      console.log(toltime,fileSize)
      //录音结束，获取取录音数据
      let PCMBlob = recorder.getPCMBlob();//获取 PCM 数据
      let wav = recorder.getWAVBlob();//获取 WAV 数据
      // const mp3Blob = this.convertToMp3(recorder.getWAV());

      const formdata = new FormData();
      formdata.append('photo',wav);
      formdata.append('class_target',录音文件);
        
      let res = await UploadFile('/push_photo', formdata)
      that.mp3_url = res.data.split("/")[4]
      console.log(res,that.mp3_url)
    },

    async getLesson () {
      let that = this
      console.log(that.student_string)
      if(that.role == 'client'){
        that.isBoss = false
      }

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
      const lessons = await HttpPost('/getTodayClasses', param)
      let lessons_data = lessons.data;
      console.log(lessons_data)
      that.tableData =lessons_data
    },

    async selectActionConfirm(type,index1){
      let that = this;
      var children = that.tableData[index1].children
      // console.log(children)
      for(var i in children){
        let sign_select = children[i].sign_select
        let student_name = children[i].student_name
        let duration = children[i].duration
        let class_number = children[i].class_number
        let subject = children[i].subject
        let sign_up = children[i].sign_up

        if(sign_select == true && sign_up == '签到'){
          that.leave_student = student_name
          that.leave_subject = subject
          that.leave_duration = duration
          that.sign_class_number = class_number
          that.index1 = index1
          that.index2 = i
          await that.signIn()
        }
      }
    },

    async selectAllSign(type,index1){
      let that = this;
      var children = that.tableData[index1].children
      for(var i in children){
        children[i].sign_select=true
      }
      that.tableData[index1].children = children
    },

    async cancelAllSign(type,index1){
      let that = this;
      var children = that.tableData[index1].children
      for(var i in children){
        children[i].sign_select=false
      }
      that.tableData[index1].children = children
    },

    dialogFunction (type,sign_up,class_number,student_name,subject,leave,duration,index1,index2,comment_status) {
      let that = this
      that.isLeave = false
      that.isSignIn = false
      that.mark_leave = ''
      that.class_count = 1
      if(type =='leave'){
        if(leave == '请假'){
          that.button = 'leave'
          that.dialogFormVisible = true
          that.isLeave = true
          that.leave_student = student_name
          that.leave_subject = subject
          that.leave_duration = duration
          that.index1 = index1
          that.index2 = index2
        }else{
          that.$message({
            message: '学生' + leave,
            type: 'warning'
          });

          that.leaveRecord(subject,that.studio,student_name,leave.replace('已',''))
        }
      }else if(type == 'signin'){
        if(sign_up == '签到'){
          that.button = 'signin'
          that.dialogFormVisible = true
          that.isSignIn = true
          that.leave_student = student_name
          that.leave_subject = subject
          that.leave_duration = duration
          that.sign_class_number = class_number
          that.index1 = index1
          that.index2 = index2
        }else{
          that.$message({
            message: '学生' + sign_up,
            type: 'warning'
          });
          that.signUpRecord(subject,that.studio,student_name)
        }
      }else if(type == 'comment'){
        if(comment_status == '课评'){
          let string1 = that.leave_subject + ',' +that.sign_class_number + ',' +that.leave_duration
          let string2 = subject + ',' + class_number + ',' + duration
          console.log(string1,string2)

          if(string1 != string2){
            that.class_target = ''
            that.class_name = ''
          }

          that.button = 'comment'
          that.isComment = true
          that.isCalender = false
          that.leave_student = student_name
          that.leave_subject = subject
          that.leave_duration = duration
          that.sign_class_number = class_number
          that.index1 = index1
          that.index2 = index2
          that.uuids = []
          that.positive = 5
          that.discipline = 5
          that.happiness = 5
        
          that.class_comment = '',
          that.fileList = [],
          that.uuids =[]

        }else{
          that.$message({
            message: '学生' + comment_status,
            type: 'warning'
          });
          that.growthRecord(subject,that.studio,student_name)
        }
      }
      
    },

    back () {
      let that = this
      that.isComment = false
      that.isCalender = true
      that.uuids = []
      that.positive = 5
      that.discipline = 5
      that.happiness = 5
      that.class_target = ''
      that.class_comment = ''
      that.class_name = ''
    },

    async addLeave () {
      let that = this;
      if(that.leave_value == true){
        that.leave_type = '请假'
      }else{
        that.leave_type = '旷课'
      }

      if(that.mark_leave.trim().length == 0  || that.mark_leave == null){
        that.mark_leave = '无备注'
      }
      console.log(that.leave_type,that.leave_subject,this.leave_student,this,this.leave_duration,that.mark_leave)
      
      let param ={
        student_name: that.leave_student,
        studio:that.studio,
        date_time:that.date_time,
        duration: that.leave_duration,
        leave_type:that.leave_type,
        mark_leave:that.mark_leave,
        subject:that.leave_subject,
        openid:that.openid
      }
      await HttpPost('/leaveRecord', param)
      that.$message({
        message: '操作成功',
        type: 'success'
      });

      that.tableData[that.index1].children[that.index2].leave = '已'+that.leave_type
    },

    async signIn () {
      let that = this
      if(that.mark_leave.trim().length == 0  || that.mark_leave == null){
        that.mark_leave = '无备注'
      }

      let param ={
        student_name:that.leave_student,
        studio:that.studio,
        date_time:that.date_time,
        duration:that.leave_duration,
        class_number:that.sign_class_number,
        subject:that.leave_subject,
        openid:that.openid,
        mark:that.mark_leave,
        class_count:that.class_count,
      }

      // console.log(param)
      await HttpPost('/signUpSchedule', param)
      that.$message({
        message: '签到成功',
        type: 'success'
      });
      that.tableData[that.index1].children[that.index2].sign_up = '已签到'
    },

    async comment () {
      let that = this
      let uuids = ''
      for(var i in that.uuids){
        if(uuids==''){
          uuids = that.uuids[i]
        }else{
          uuids = uuids.concat(',' + that.uuids[i])
        }
      }

      if(uuids == ''){
        that.$message({
          message: '请先上传图片',
          type: 'warning'
        });
        return
      }

      let param ={
        class_name:that.class_name,
        student_name:that.leave_student,
        class_target:that.class_target,
        class_target_bak:'课评',
        comment:that.class_comment,
        studio:that.studio,
        date_time:that.date_time,
        duration:that.leave_duration,
        positive:that.positive,
        discipline:that.discipline,
        happiness:that.happiness,
        uuids:uuids,
        mp3_url:that.mp3_url,
        openid:that.openid
      }
      console.log(param)
      await HttpPost('/push', param)
      that.$message({
          message: '发布成功',
          type: 'success'
      });
      that.tableData[that.index1].children[that.index2].comment_status = '已课评'
    },

    async confirm_buttom () {
      let that = this
      that.dialogFormVisible = false
      if (that.button == 'leave'){
        await that.addLeave ()
      }else if (that.button == 'signin'){
        await that.signIn ()
      } 

    },

    async handleChange(file, fileList) {
        let that = this

        const formdata = new FormData();
        formdata.append('photo',file.raw);


        let res = await UploadFile('/push_photo', formdata)
        let uuid  = res.data.split("/")[4]
        that.uuids.push(uuid)
        console.log(that.uuids)
    },
    
    goOff () {
      this.$router.go(-1);
    },

    signUpRecord (subject,studio,student_name) {
      this.$router.push({ path: '/signUpRecord', query: { subject: subject,studio: studio,student_name: student_name,role:this.role,openid:this.openid } })
    },

    growthRecord (subject,studio,student_name) {
      this.$router.push({ path: '/growthrecord', query: { subject: subject,studio: studio,student_name: student_name,role:this.role,openid:this.openid } })
    },

    leaveRecord (subject,studio,student_name,leave_type) {
      this.$router.push({ path: '/leaverecord', query: { subject: subject,studio: studio,student_name: student_name,role:this.role,openid:this.openid,leave_type:leave_type } })
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
