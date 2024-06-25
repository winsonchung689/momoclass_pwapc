<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 2%;">
        <el-table :data="tableData" style="width: 100%;font-size: small;" >
          <el-table-column fixed prop="rank" label="序号">
          </el-table-column> 
          <el-table-column prop="student_name" label="名字" >
          </el-table-column>
          <el-table-column prop="create_time" label="上课日">
          </el-table-column>
          <el-table-column prop="duration" label="时间段" >
          </el-table-column>
          <el-table-column prop="sign_time" label="签到日">
          </el-table-column>
          <el-table-column prop="mark" label="备注">
          </el-table-column>
          <el-table-column prop="count" label="课时">
          </el-table-column>
          <el-table-column prop="status" label="状态">
          </el-table-column>
          <el-table-column fixed="right" label="操作" v-if="isShow">
            <template slot-scope="scope" >
              <div style="justify-content: center;display: flex;flex-direction: column;">
                <div>
                  <el-popconfirm title="确定移除吗？" @confirm="deleteRow(scope.$index, tableData)">
                    <el-button slot="reference" type="text" size="small" style="font-size:small">移除</el-button>
                  </el-popconfirm>
                </div>

                <div>
                  <el-popconfirm title="确定取消吗？" @confirm="cancel(scope.$index, tableData)">
                    <el-button slot="reference" type="text" size="small" style="font-size:small">取消</el-button>
                  </el-popconfirm>
                </div>

                <div>
                  <el-popconfirm title="确定清空吗？" @confirm="deleteAll()">
                    <el-button slot="reference" type="text" size="small" style="font-size:small">清空</el-button>
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

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'

export default {
  name: 'signUpRecord',
  data () {
    return {
      subject: this.$route.query.subject,
      studio: this.$route.query.studio,
      student_name: this.$route.query.student_name,
      role: this.$route.query.role,
      openid: this.$route.query.openid,
      header:'签到记录',
      tableData: [],
      isShow:false
    }
  },

  created () {
    this.getSignInRecord()
  },

  methods: {
    async getSignInRecord () {
      let that = this;
      if(that.role == 'boss' || that.role == 'teacher'){
        that.isShow = true
      }
      
      let param ={
          studio:that.studio,
          student_name:that.student_name,
          subject:that.subject,
          openid:that.openid
        }
      const signins = await HttpPost('/getSignUp', param)
      let signin_data = signins.data;

      // console.log(signin_data)
      that.tableData =[]
      for( var i in signin_data){
          const rank = signin_data[i].rank
          const student_name = signin_data[i].student_name
          const create_time = signin_data[i].create_time
          const duration = signin_data[i].duration
          const sign_time = signin_data[i].sign_time
          const mark = signin_data[i].mark
          const count = signin_data[i].count
          const status = signin_data[i].status
          const id = signin_data[i].id
          const subject = signin_data[i].subject

          var json ={};
          json.rank = rank
          json.student_name = student_name
          json.create_time = create_time
          json.duration = duration
          json.sign_time = sign_time
          json.mark = mark
          json.count = count
          json.status = status
          json.id = id
          json.subject = subject
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
      let res = HttpPost("/deleteSignUpRecord",param)
      res.then(res => {
          if(res.data == 1){
            this.$message({
                message: '删除成功',
                type: 'success'
            });
            this.getSignInRecord()
          }else {
            this.$message({
                message: '删除失败',
                type: 'warning'
            });
          }
      })
      
    },

    deleteAll () {
      let param ={
          name:this.student_name,
          role:this.role,
          studio: this.studio,
          openid:this.openid
        }
      let res = HttpPost("/deleteSignUpAllRecord",param)
      res.then(res => {
          if(res.data == 1){
            this.$message({
                message: '清空成功',
                type: 'success'
            });
            this.getSignInRecord()
          }else {
            this.$message({
                message: '清空失败',
                type: 'warning'
            });
            this.getSignInRecord()
          }
      })

    },

    async cancel (index, tableData) {
      let that = this
      let data = tableData[index]
           
      let param ={
        id:data.id,
        role:that.role,
        studio: that.studio,
        openid:that.openid,
        student_name:data.student_name,
        count:data.count,
        subject:data.subject
      }

      await HttpPost("/cancelSignUp",param)
      this.$message({
        message: '取消成功',
        type: 'success'
      })
      await that.getSignInRecord()
    }

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
