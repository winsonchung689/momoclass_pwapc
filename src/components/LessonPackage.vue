<template>

    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 2%;">

        <div style="margin-left: 2%;color: cornflowerblue;font-weight: bolder;">总续课:{{ total_sum }}</div>

        <el-table :data="tableData" style="width: 100%;font-size: small;" max-height="750">
          <el-table-column prop="student_name" label="名字"  >
          </el-table-column>
          <el-table-column prop="total_money" label="原价" >
          </el-table-column>
          <el-table-column prop="discount_money" label="优惠" >
          </el-table-column>
          <el-table-column prop="all_lesson" label="原课时" >
          </el-table-column>
          <el-table-column prop="give_lesson" label="赠课时" >
          </el-table-column>
          <el-table-column prop="start_date" label="报课时间" >
          </el-table-column>
          <el-table-column prop="end_date" label="有效期至" >
          </el-table-column>
          <el-table-column prop="mark" label="备注" >
          </el-table-column>
          <el-table-column prop="nick_name" label="操作人" >
          </el-table-column>
          
          <el-table-column fixed="right" label="操作"  v-if="isShow">
            <template slot-scope="scope" >
              <div style="justify-content: center;display: flex;flex-direction: column;">
                <div>
                  <el-popconfirm title="确定移除吗？" @confirm="deleteRow(scope.$index, tableData,'delete')">
                    <el-button slot="reference" type="text" size="small" style="font-size:small">移除</el-button>
                  </el-popconfirm>
                </div>
                <div>
                  <el-popconfirm title="确定移除吗？" @confirm="deleteRow(scope.$index, tableData,'return')">
                    <el-button slot="reference" type="text" size="small" style="font-size:small">取消</el-button>
                  </el-popconfirm>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    
</template>

<script>

import { HttpPost } from '@/api'

export default {
  name: 'LessonPackage',
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
      isShow:false,
      total_sum : 0
    }
  },

  created () {
    this.getLessonPackage()
  },

  methods: {
    async getLessonPackage () {
      let that = this;
      if(that.role == 'boss' || that.role == 'teacher'){
        that.isShow = true
      }

      let param ={
        studio:that.studio,
        student_name:that.student_name,
        subject:that.subject,
        leave_type:that.leave_type,
        openid:that.openid,
        search_type:'个人',
        duration_time:'无_无'
      }

      // console.log(param)
      const res = await HttpPost('/getLessonPackage', param)
      let package_data = res.data;

      // console.log(package_data)
      let total_sum = 0;
      that.tableData =[]
      for( var i in package_data){
          const all_lesson = package_data[i].all_lesson
          const give_lesson = package_data[i].give_lesson
          const total_money = package_data[i].total_money
          const discount_money = package_data[i].discount_money
          const student_name = package_data[i].student_name
          const mark = package_data[i].mark
          const start_date = package_data[i].start_date
          const end_date = package_data[i].end_date
          const nick_name = package_data[i].nick_name
          const id = package_data[i].id
          total_sum = total_sum + all_lesson + give_lesson

          var json ={};
          json.all_lesson = all_lesson
          json.give_lesson = give_lesson
          json.total_money = total_money
          json.discount_money = discount_money
          json.student_name = student_name
          json.start_date = start_date
          json.end_date = end_date
          json.nick_name = nick_name
          json.id = id
          that.tableData.push(json)
      }
      that.total_sum = total_sum
    },

    goOff() {
      this.$router.go(-1);
    },

    deleteRow (index, tableData,type) {
      const id = tableData[index].id
      let param ={
          id:id,
          type:type
        }
      let res = HttpPost("/deleteLessonPackage",param)
      res.then(res => {
          if(res.data == 1){
            this.$message({
                message: '删除成功',
                type: 'success'
            });
            this.getLessonPackage()
          }else {
            this.$message({
                message: '删除失败',
                type: 'warning'
            });
            this.getLessonPackage()
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
