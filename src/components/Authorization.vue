<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 15%;">

        <div style="display:flex;justify-content: left;margin-top: 5px;margin-left: 10%;margin-bottom: 10px;flex-direction: row;">
          <div v-if="isBoss" style="margin-right: 15px;"> 
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="state"
              :fetch-suggestions="querySearch"
              placeholder="请输入名字"
              @select="handleSelect">
              <template slot-scope="{ item }">
                <div class="name">{{ item.nick_name }}</div>
              </template>
            </el-autocomplete>
          </div>

          <el-button-group>
            <el-button @click="getUsers()" type="primary">刷新<i class="el-icon-refresh el-icon--right"></i></el-button>
          </el-button-group>
        </div>

        <div style="justify-content: center;display: flex;margin-top: 5%;" v-for="item of items">
          <div class="lesson">
            <img style="width: 50px;height: 50px;border-radius: 15%;margin-left: 20px;margin-top: 20px;" :src="item.avatarurl" alt="">

            <div style="margin-left: 40px;margin-top: 20px;">
              <div style="font-weight: bolder;font-size: large;color: #43504a;">{{ item.nick_name }} ({{ item.role }})</div>
              <div @click="modifyFunction(item.openid)" style="color: #4d67e8;margin-right: 5px;">校区: {{ item.campus }} </div>
              <div style="color: #fff;font-size: small;display: flex;flex-direction: column;margin-top: 5px;">
                <div style="margin-right: 5px;">过期时间: {{ item.expired_time }} </div>
                <div style="margin-right: 5px;">工作室: {{ item.studio }} </div>
                <div style="margin-right: 5px;">科目: {{ item.subject }} </div>
              </div>
            </div>
            
            <div v-if="item.role != '校长'" style="width: 20%;margin-left: 10px;">
              <div @click="updateRole(item.openid,item.role)">
                <el-radio v-model="item.role" label="老师">老师角色</el-radio>
              </div>
                <div @click="updateRole(item.openid,item.role)">
                  <el-radio v-model="item.role" label="普通">普通角色</el-radio>
                </div>
                
            </div>
          </div>
        </div>

        <el-dialog :title="leave_student" :visible.sync="dialogFormVisible" style="width: 400px">
          <el-input v-model="campus" placeholder="请输入校区"></el-input>
          <div slot="footer" style="display: flex;flex-direction: row;justify-content: space-between;">
            <el-button @click="cancel_buttom()">取 消</el-button>
            <el-button type="primary" @click="confirm_buttom()">确 定</el-button>
          </div>
        </el-dialog>
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
      header:'权限管理',
      allstudents:[],
      state:'',
      isBoss:true,
      dialogFormVisible:false,
      campus:'',
      openid_get:''
    }
  },

  created () {
    this.getUsers()
  },

  methods: {
    async getUsers () {
        let that = this
        let param = {
          studio: that.studio,
          openid:that.openid
        }
        const users = await HttpPost('/getAllUserByStudio', param)
        const users_data = users.data
        // console.log(users_data)
        that.items =[]
        that.allstudents =[]
        for( var i in users_data){
            let role = users_data[i].role
            if(role == 'boss'){
                role = '校长'
                that.isBoss = true
            }else if(role == 'teacher' ){
                role = '老师'
            }else if(role == 'client' ){
                role = '普通'
            }
            const expired_time = users_data[i].expired_time
            const nick_name =users_data[i].nick_name
            const subject = users_data[i].subjects
            const studio = users_data[i].studio
            const student_name = users_data[i].student_name
            const campus = users_data[i].campus
            let avatarurl = users_data[i].avatarurl
            if(avatarurl=='未绑定'){
                avatarurl = "https://www.momoclasss.xyz:443/data/disk/uploadimages/fa8a634a-40c2-412a-9a95-2bd8d5ba5675.png"
            }
            const openid = users_data[i].openid

            var json ={};
            json.studio = studio
            json.subject = subject
            json.student_name = student_name
            json.nick_name = nick_name
            json.expired_time = expired_time
            json.avatarurl = avatarurl
            json.role = role
            json.openid = openid
            json.campus= campus
            
            that.allstudents.push(json)
            that.items.push(json)
        }
    },

    async updateRole (openid,role) {
        let that = this
        let role_input = 'client'
        console.log(openid,role)
        if(role=='老师'){
          role_input = 'client'
        }else if(role == '普通'){
          role_input = 'teacher'
        }

        let param = {
            openid:openid,
            role:role_input
        }
        await HttpPost('/updateRole', param)
        that.getUsers()
    },

    goOff() {
      this.$router.go(-1);
    },

    async handleSelect (item) {
      let that = this
      const nick_name = item.nick_name
      let param = {
          studio: that.studio,
          nick_name: nick_name,
          openid:that.openid
        }
        const users = await HttpPost('/getUserByNickStudio', param)
        const users_data = users.data
        // console.log(users_data)
        that.items =[]
        for( var i in users_data){
            let role = users_data[i].role
            if(role == 'boss'){
                role = '老师'
            }else if(role == 'client' ){
                role = '普通'
            }
            const expired_time = users_data[i].expired_time
            const nick_name =users_data[i].nick_name
            const subject = users_data[i].subjects
            const studio = users_data[i].studio
            const student_name = users_data[i].student_name
            let avatarurl = users_data[i].avatarurl
            if(avatarurl=='未绑定'){
                avatarurl = "https://www.momoclasss.xyz:443/data/disk/uploadimages/fa8a634a-40c2-412a-9a95-2bd8d5ba5675.png"
            }
            const openid = users_data[i].openid

            var json ={};
            json.studio = studio
            json.subject = subject
            json.student_name = student_name
            json.nick_name = nick_name
            json.expired_time = expired_time
            json.avatarurl = avatarurl
            json.role = role
            json.openid = openid
            
            that.items.push(json)
        }
    },

    createFilter(queryString) {
      return (list) => {
        return (list.nick_name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    querySearch(queryString,cb) {
      let that = this;      
      var list = []
      for(var i in that.allstudents){
        let json ={}
        let nick_name = that.allstudents[i].nick_name
        json.nick_name = nick_name 
        list.push(json)
      }
      var results = queryString ? list.filter(this.createFilter(queryString)) : list;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    modifyFunction(openid){
      let that = this
      that.campus = ''
      that.openid_get = openid
      that.dialogFormVisible = true
    },

    cancel_buttom(){
      this.dialogFormVisible = false
      this.campus = ''
    },

    async confirm_buttom(){
      let that = this 
      let param = {
        openid: that.openid_get,
        campus:that.campus
      }

      let status = ''
      let res = await HttpPost("/updateCampus",param)
      status = res.status

      if(status == 200){
        that.$message({
            message: '操作成功',
            type: 'success'
        });
        that.dialogFormVisible = false
        that.getUsers()
      }else {
        that.$message({
            message: '操作失败',
            type: 'warning'
        });
        that.dialogFormVisible = false
        that.getUsers()
      }
    }

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.lesson{
  background-color: #90d6b1db;
  width: 85%;
  height: 150px;
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
