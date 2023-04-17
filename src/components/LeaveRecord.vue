<template>

    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 15%;">

      <el-table :data="tableData" style="width: 100%;font-size: small;" max-height="750">
        <el-table-column fixed prop="rank" label="序号" width="50">
        </el-table-column> 
        <el-table-column prop="subject" label="科目"  width="70">
        </el-table-column>
        <el-table-column prop="student_name" label="名字"  width="70">
        </el-table-column>
        <el-table-column prop="mark_leave" label="备注" width="90">
        </el-table-column>
        <el-table-column prop="date_time" label="日期" width="90">
        </el-table-column>
        <el-table-column prop="duration" label="时间段" width="90">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="70" v-if="isShow">
          <template slot-scope="scope" >
            <div style="justify-content: center;display: flex;flex-direction: column;">
              <div>
                <el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small" style="font-size:x-small">移除</el-button>
              </div>
              <div>
                <el-button @click.native.prevent="deleteAll()" type="text" size="small" style="font-size:x-small">清空</el-button>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      </div>
    </div>
    
</template>

<script>
import { HttpGet } from '@/api'
import { HttpPost } from '@/api'

export default {
  name: 'SignInRecord',
  data () {
    return {
      subject: this.$route.query.subject,
      studio: this.$route.query.studio,
      student_name: this.$route.query.student_name,
      role: this.$route.query.role,
      openid: this.$route.query.openid,
      leave_type: this.$route.query.leave_type,
      header:  this.$route.query.leave_type+'记录',
      tableData: [],
      isShow:false
    }
  },

  created () {
    this.getLeaveRecord()
  },

  methods: {
    async getLeaveRecord () {
      let that = this;
      if(that.role == 'boss'){
        that.isShow = true
      }

      let param ={
          studio:that.studio,
          student_name:that.student_name,
          subject:that.subject,
          leave_type:that.leave_type
        }
      const leave = await HttpPost('/getLeaveRecord', param)
      let leave_data = leave.data;

      // console.log(leave_data)
      that.tableData =[]
      for( var i in leave_data){
          const rank = leave_data[i].rank
          const subject = leave_data[i].subject
          const student_name = leave_data[i].student_name
          const mark_leave = leave_data[i].mark_leave
          const date_time = leave_data[i].date_time
          const duration = leave_data[i].duration
          const id = leave_data[i].id

          var json ={};
          json.rank = rank
          json.subject = subject
          json.student_name = student_name
          json.mark_leave = mark_leave
          json.date_time = date_time
          json.duration = duration
          json.id = id
          that.tableData.push(json)
      }

    },

    goOff() {
      this.$router.go(-1);
    },

    deleteRow (index, tableData) {
      const id = tableData[index].id
      let param ={
          studio:this.studio,
          id:id,
          role:this.role,
          openid:this.openid
        }
      let res = HttpPost("/deleteLeaveRecord",param)
      res.then(res => {
          if(res.data == 1){
            this.$message({
                message: '删除成功',
                type: 'success'
            });
            this.getLeaveRecord()
          }else {
            this.$message({
                message: '删除失败',
                type: 'warning'
            });
            this.getLeaveRecord()
          }
      })
      
    },

    deleteAll () {
      let param ={
          student_name:this.student_name,
          role:this.role,
          studio: this.studio,
          openid:this.openid,
          leave_type: this.leave_type,
          subject: this.subject
        }
      let res = HttpPost("/deleteLeaveAllRecord",param)
      res.then(res => {
          if(res.data == 1){
            this.$message({
                message: '清空成功',
                type: 'success'
            });
            this.getLeaveRecord()
          }else {
            this.$message({
                message: '清空失败',
                type: 'warning'
            });
            this.getLeaveRecord()
          }
      })

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
