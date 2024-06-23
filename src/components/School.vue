<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 3%;">

        <div style="display:flex;justify-content: left;margin-left: 2%;margin-bottom: 10px;">
          <el-button-group>
            <el-button @click="singleAdd()" type="primary">新增学员<i class="el-icon-user el-icon--right"></i></el-button>
            <el-button @click="getUser()" type="primary">刷新<i class="el-icon-refresh el-icon--right"></i></el-button>
          </el-button-group>
          <div v-if="isBoss" style="margin-left: 2%;"> 
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
        </div>

        <div style="margin-left: 2%;margin-bottom: 10px;font-weight:bolder;font-size: medium;">
          <div>总人数: {{ total_student }}</div>
          <div>总课时数: {{ total_amount_all }}</div>
          <div>余课时数: {{ left_amount_all }}</div>
        </div>

        
        <div v-if="isAdd" style="margin-bottom: 30px;">
          <div>
            <el-button type="text"  @click="back">取消</el-button>
          </div>

          <div style="width: 50%;">
              <el-input
              placeholder="请输入科目"
              v-model="subject"
              clearable>
            </el-input>
            <el-input
              placeholder="请输入学生名"
              v-model="student_name"
              clearable>
            </el-input>
          </div>

          <div style="font-size: small;font-weight: bolder;">
            总课时:
            <el-input-number v-model="total_amount" :precision="2" :step="1" :max="10000">总课时</el-input-number>
          </div>
          <div style="font-size: small;font-weight: bolder;">
            余课时:
            <el-input-number v-model="left_amount" :precision="2" :step="1" :max="10000">总课时</el-input-number>
          </div>

          <div style="display: flex;justify-content: center; margin-top: 20px;">
            <el-button type="primary" @click="submit_add">提交</el-button>
          </div>
        </div>
        
        <div v-if="isStudent" style="justify-content: center;display: flex;margin-top: 15px" v-for="item of items">

          <div class="card">
            <div class="lesson">
              <img style="height: 50px;border-radius: 15%;margin-left: 20px;margin-top: 20px;" :src="item.avatarurl" alt="">
              <div style="margin-left: 10px;margin-top: 20px;">
                <div style="font-size: small;display: flex;direction: row;font-weight: bolder;">
                  <div style="margin-right: 5px;color: #43504a;">科目: {{ item.subject }} </div>
                </div>

                <div style="font-weight: bolder;color: #43504a;">{{ item.student_name }}  (家长:{{ item.parent }})</div>
                <div style="font-weight: bolder;font-size: small;display: flex;direction: row;margin-top: 5px;">
                  <div @click="modifyFunction('余课时',item.student_name,item.subject)" style="color: #ea8c28;margin-right: 5px;font-size:medium;">余课时: {{ item.left_amount }} </div>
                  <div @click="modifyFunction('总课时',item.student_name,item.subject)" style="color: #a4a499;margin-left: 15px;">历史课时: {{ item.total_amount }} </div>
                </div>
                <div style="font-weight: bolder;font-size: small;display: flex;direction: row;margin-top: 5px;">
                  <div @click="modifyFunction('扣课',item.student_name,item.subject)" style="color: #4d67e8;margin-right: 15px;">单次扣课: {{ item.minus }} </div>
                  <div @click="modifyFunction('积分',item.student_name,item.subject)" style="color: #4d67e8;margin-left: 5px;">单课积分: {{ item.coins }}</div>
                </div>
                <!-- <el-progress style="margin-top: 5px;width: 70%;" :percentage="item.percentage"></el-progress> -->
              </div>
            </div>
            <el-popconfirm title="确定删除吗？" style="margin-left: 98%;" @confirm="deleteRow(item.id,item.student_name)">
              <el-button slot="reference" icon="el-icon-delete" type="danger" circle size="mini"></el-button>
            </el-popconfirm>
          </div>

          <el-dialog :title="leave_student" :visible.sync="dialogFormVisible" style="width: 400px">
            <el-input v-model="number" :placeholder="mark"></el-input>
            <div slot="footer" style="display: flex;flex-direction: row;justify-content: space-between;">
              <el-button @click="cancel_buttom()">取 消</el-button>
              <el-button type="primary" @click="confirm_buttom()">确 定</el-button>
            </div>
          </el-dialog>
            
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
      header:'学员管理',
      isAdd:false,
      student_name:'',
      subject:'',
      isStudent:true,
      state:'',
      allstudents:[],
      isBoss:false,
      dialogFormVisible:false,
      mark:'',
      number:'',
      subject_new:'全科目',
      gift_name:'',
      coins_amount:'',
      minus_amount:'',
      student_name_new:'',
      total_amount:'',
      modify_type:'',
      lessons_amount:'',
      consume_lesson_amount:'',
      left_amount:'',
      total_amount_all:'',
      left_amount_all:'',
      total_student:''
    }
  },

  created () {
    this.getUser()
  },

  methods: {
    async getUser () {
      let that = this

      if(that.role == 'boss' || that.role == 'teacher'){
        that.isBoss = true
      }

      let param = {
        studio: that.studio,
        student_name: 'all',
        subject:'全科目',
        openid:that.openid
      }
      const lessons = await HttpPost('/getLesson', param)
      const lessons_data = lessons.data
      // console.log(lessons_data)
      that.total_student = lessons_data[0].total_student
      that.total_amount_all = lessons_data[0].total_amount_all
      that.left_amount_all = lessons_data[0].left_amount_all
      that.items =[]
      that.allstudents = []
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
          const id = lessons_data[i].id


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
          json.id = id
          
          that.allstudents.push(json)
          that.items.push(json)
      }
    },

    deleteRow(id,student_name){
      let param ={
        id:id,
        role:this.role,
        studio:this.studio,
        openid:this.openid,
        student_name:student_name
      }
      // console.log(id,student_name)
      let res = HttpPost("/deleteLesson",param)
      res.then(res => {
          if(res.data == 1){
            this.$message({
                message: '删除成功',
                type: 'success'
            });
            this.getUser()
          }else {
            this.$message({
                message: '删除失败',
                type: 'warning'
            });
            this.getUser()
          }
      })
    },

    goOff() {
      this.$router.go(-1);
    },

    goIn(studio,subject,student_name) {
      this.$router.push({ path: '/records', query: { studio: studio,subject: subject,student_name: student_name,role:this.role,openid:this.openid } })
    },

    submit_add () {
      let that = this

      if(that.subject == ''){
          that.$message({
            message: '科目不能为空',
            type: 'warning'
          });
        return
      }

      if(that.student_name == ''){
          that.$message({
            message: '学生名不能为空',
            type: 'warning'
          });
        return
      }

      let param ={
        studio:that.studio,
        subject: that.subject,
        student_name: that.student_name,
        total_amount: that.total_amount,
        left_amount: that.left_amount,
        openid:that.openid
      }
      // console.log(param)
      let res = HttpPost("/singleAdd",param)
      res.then(res => {
          if(res.data == 1){
            that.$message({
                message: '新增成功',
                type: 'success'
            });
            that.getUser()
          }else {
            that.$message({
                message: '新增失败',
                type: 'warning'
            });
            that.getUser()
          }
      })

      this.isStudent = true
      this.isAdd = false

    },

    singleAdd() {
      this.student_name = ''
      this.subject = ''
      this.isAdd = true
      this.isStudent = false
    },

    back () {
      this.isStudent = true
      this.isAdd = false
    },

    async handleSelect (item) {
      let that = this
      const student_name = item.student_name
      let subject_get = student_name.split('_')[1]
      let student_name_get = student_name.split('_')[0]
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
          let avatarurl = lessons_data[i].avatarurl
          if(avatarurl=='未绑定'){
            avatarurl = "https://www.momoclasss.xyz:443/file/uploadimages/fa8a634a-40c2-412a-9a95-2bd8d5ba5675.png"
          }
          const parent = lessons_data[i].parent
          const percentage = lessons_data[i].percent
          const minus = lessons_data[i].minus
          const coins = lessons_data[i].coins
          const id = lessons_data[i].id


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
          json.id = id
          
          that.items.push(json)
        }
    },

    createFilter(queryString) {
      return (list) => {
        return (list.student_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
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

    modifyFunction(type,student_name,subject){
      let that = this
      that.number = ''
      that.student_name = student_name
      that.subject = subject
      that.dialogFormVisible = true
      if(type == '扣课' ){
        that.mark = '请输入单次扣课数'
      }else if(type == '积分'){
        that.mark = '请输入单课积分数'
      }else if(type == '总课时'){
        that.mark = '请输入总课时数'
      }else if(type == '余课时'){
        that.mark = '请输入余课时数'
      }
    },

    cancel_buttom(){
      this.dialogFormVisible = false
      this.number = ''
      this.student_name = ''
    },
    
    async confirm_buttom(){
      let that = this 
      let param = {
        studio: that.studio,
        subject:that.subject,
        student_name:that.student_name,
        subject_new:'全科目',
        gift_name:that.gift_name,
        coins_amount:that.coins_amount,
        minus_amount:that.minus_amount,
        student_name_new:that.student_name_new,
        modify_type:that.modify_type,
        consume_lesson_amount:that.consume_lesson_amount,
        lessons_amount:that.lessons_amount,
        minus_amount:that.minus_amount,
        coins_amount:that.coins_amount,
        total_amount:that.total_amount,
        left_amount:that.left_amount,
        openid:that.openid
      }

      let status = ''
      if(that.mark == '请输入单次扣课数'){
        param.minus_amount = that.number
        // console.log(param)
        let res = await HttpPost("/updateLesson",param)
        status = res.status
      }else if(that.mark == '请输入单课积分数'){
        param.coins_amount = that.number
        // console.log(param)
        let res = await HttpPost("/updateLesson",param)
        status = res.status
      }else if(that.mark == '请输入总课时数'){
        param.total_amount = that.number
        // console.log(param)
        let res = await HttpPost("/updateLesson",param)
        status = res.status
      }else if(that.mark == '请输入余课时数'){
        param.left_amount = that.number
        // console.log(param)
        let res = await HttpPost("/updateLesson",param)
        status = res.status
      }

      if(status == 200){
        that.$message({
            message: '操作成功',
            type: 'success'
        });
        that.dialogFormVisible = false
        that.getUser()
      }else {
        that.$message({
            message: '操作失败',
            type: 'warning'
        });
        that.dialogFormVisible = false
        that.getUser()
      }
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.lesson{
  background-color: rgb(226, 235, 217);
  width: 85%;
  height: 120px;
  border-radius: 0.5rem;
  margin-bottom: 6px;
  flex-direction: row;
  display: flex;
  color: #a0a3a7;
}

.card{
  background-color: rgb(226, 235, 217);
  width: 95%;
  border-radius: 0.5rem;
}

.el-icon-arrow-left{
  margin-left: 5px;
  margin-top: 10px;
  scale: 1.5;
}

</style>
