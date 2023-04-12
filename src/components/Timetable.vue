<template>
    <div>
      <div style="display: flex;direction: row;margin-bottom: 5px;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ header }}</div>
      </div>

      <el-table :data="tableData" style="width: 100%;font-size: small;justify-content: center;" max-height="750">
        <el-table-column prop="week1" label="周一"  width="150" style="text-align: center;">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week1" :key="index">
              <div class="class_element_1">
                  <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                  <div class="text"> {{ item.duration }} </div>
                  <div class="text"> 报名: {{ item.classes_count }} </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week2" label="周二" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week2" :key="index">
              <div class="class_element_2">
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week3" label="周三" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week3" :key="index">
              <div class="class_element_3">
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week4" label="周四" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week4" :key="index">
              <div class="class_element_4">
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week5" label="周五" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week5" :key="index">
              <div class="class_element_5">
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week6" label="周六" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week6" :key="index">
              <div class="class_element_6">
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>
              </div>
            </div>
          </template>
          
        </el-table-column>
        <el-table-column prop="week7" label="周日"  width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week7" :key="index">
              <div class="class_element_7">
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>
              </div>
            </div>
          </template>
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
      header: '课程表',
      tableData: [
      ],
      leave_data:[],
      isShow:false
    }
  },

  created () {
    this.getTimetable();
  },

  methods: {
    async getTimetable () {
      let that = this;
      if(that.role == 'boss'){
        that.isShow = true
      }

      let json ={}
      that.tableData =[]
      for( var i=0; i <= 6;i++ ){
          let param ={
            studio:that.studio,
            dayofweek:i+1,
            subject:that.subject,
            openid:that.openid
          }
          const leave = await HttpPost('/getArrangement', param)
          let leave_data = leave.data;
          if(i == 0){
            json.week1 = leave_data
          }else if(i == 1){
            json.week2 = leave_data
          }else if(i == 2){
            json.week3 = leave_data
          }else if(i == 3){
            json.week4 = leave_data
          }else if(i == 4){
            json.week5 = leave_data
          }else if(i == 5){
            json.week6 = leave_data
          }else if(i == 6){
            json.week7 = leave_data
          }
      } 
      that.tableData.push(json)
      console.log(that.tableData)
    },

    goOff () {
      this.$router.go(-1);
    },

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-icon-arrow-left{
  margin-left: 5px;
  margin-top: 10px;
  scale: 1.5;
}
.class_element_1{
  background-color: rgb(177, 245, 242);
  border-radius: 5%;
  height: 180px;
  margin-bottom: 20px;
}

.text{
  justify-content: center;
  display: flex;
  margin-top: 5px;
}

.class_element_2{
  background-color: rgb(177, 245, 180);
  border-radius: 5%;
  height: 180px;
  margin-bottom: 20px;
}


.class_element_3{
  background-color: rgb(228, 245, 177);
  border-radius: 5%;
  height: 180px;
  margin-bottom: 20px;
}


.class_element_4{
  background-color: rgb(177, 203, 245);
  border-radius: 5%;
  height: 180px;
  margin-bottom: 20px;
}


.class_element_5{
  background-color: rgb(228, 177, 245);
  border-radius: 5%;
  height: 180px;
  margin-bottom: 20px;
}


.class_element_6{
  background-color: rgb(245, 221, 177);
  border-radius: 5%;
  height: 180px;
  margin-bottom: 20px;
}


.class_element_7{
  background-color: rgb(177, 245, 242);
  border-radius: 5%;
  height: 180px;
  margin-bottom: 20px;
}



</style>
