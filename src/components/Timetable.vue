<template>
    <div>
      <div style="display: flex;direction: row;margin-bottom: 5px;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ header }}</div>
      </div>


      <el-dialog title="排课中" :visible.sync="dialogFormVisible">
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="state"
          :fetch-suggestions="querySearch"
          placeholder="请选择学生"
          @select="handleSelect">
          <template slot-scope="{ item }">
            <div class="name">{{ item.student_name }}</div>
          </template>
        </el-autocomplete>
        <div slot="footer" style="display: flex;flex-direction: row;justify-content: space-between;">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="arrangeClass()">确 定</el-button>
        </div>
      </el-dialog>

      <el-table :data="tableData" style="width: 100%;font-size: small;justify-content: center;" max-height="750">
        <el-table-column prop="week1" label="周一"  width="150" style="text-align: center;">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week1" :key="index">
              <div class="class_element_1">
                  <div class="t_choose" @click="chooseLesson(item.dayofweek,item.subject,item.class_number,item.duration,item.chooseLesson,index)">{{ item.chooseLesson }}</div>
                  <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                  <div class="text"> {{ item.duration }} </div>
                  <div class="text"> 报名: {{ item.classes_count }} </div>
                  
                 <div class="t_choose">
                    <el-popover
                      placement="right"
                      width="120"
                      trigger="click">
                      <el-table :data="gridData">
                        <el-table-column width="120" property="student_name" label="学生名"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70" v-if="isShow">
                        <template slot-scope="scope" >
                          <div style="justify-content: center;display: flex;flex-direction: column;">
                            <div>
                                <el-button @click.native.prevent="deleteRow(scope.$index, gridData)" type="text" size="small" style="font-size:x-small">移除</el-button>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      </el-table>
                      <el-button @click="getStudents(item.dayofweek,item.subject,item.class_number,item.duration)"  slot="reference" smaller style="font-size: smaller;font-weight: bolder;">明细</el-button>
                    </el-popover>
                    <el-button type="primary" style="font-size: smaller;font-weight: bolder;height: 37px;" @click="dialogFunction(item.dayofweek,item.subject,item.class_number,item.duration,index)">排课</el-button>
                 </div>

              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week2" label="周二" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week2" :key="index">
              <div class="class_element_2">
                <div class="t_choose" @click="chooseLesson(item.dayofweek,item.subject,item.class_number,item.duration,item.chooseLesson,index)">{{ item.chooseLesson }}</div>
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>

                 <div class="t_choose">
                    <el-popover
                      placement="right"
                      width="120"
                      trigger="click">
                      <el-table :data="gridData">
                        <el-table-column width="120" property="student_name" label="学生名"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70" v-if="isShow">
                        <template slot-scope="scope" >
                          <div style="justify-content: center;display: flex;flex-direction: column;">
                            <div>
                              <el-button @click.native.prevent="deleteRow(scope.$index, gridData)" type="text" size="small" style="font-size:x-small">移除</el-button>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      </el-table>
                      <el-button @click="getStudents(item.dayofweek,item.subject,item.class_number,item.duration)"  slot="reference" smaller style="font-size: smaller;font-weight: bolder;">明细</el-button>
                    </el-popover>
                    <el-button type="primary" style="font-size: smaller;font-weight: bolder;height: 37px;" @click="dialogFunction(item.dayofweek,item.subject,item.class_number,item.duration,index)">排课</el-button>
                 </div>

              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week3" label="周三" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week3" :key="index">
              <div class="class_element_1">
                <div class="t_choose" @click="chooseLesson(item.dayofweek,item.subject,item.class_number,item.duration,item.chooseLesson,index)">{{ item.chooseLesson }}</div>
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>
                 
                 <div class="t_choose">
                    <el-popover
                      placement="right"
                      width="120"
                      trigger="click">
                      <el-table :data="gridData">
                        <el-table-column width="120" property="student_name" label="学生名"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70" v-if="isShow">
                        <template slot-scope="scope" >
                          <div style="justify-content: center;display: flex;flex-direction: column;">
                            <div>
                              <el-button @click.native.prevent="deleteRow(scope.$index, gridData)" type="text" size="small" style="font-size:x-small">移除</el-button>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      </el-table>
                      <el-button @click="getStudents(item.dayofweek,item.subject,item.class_number,item.duration)"  slot="reference" smaller style="font-size: smaller;font-weight: bolder;">明细</el-button>
                    </el-popover>
                    <el-button type="primary" style="font-size: smaller;font-weight: bolder;height: 37px;" @click="dialogFunction(item.dayofweek,item.subject,item.class_number,item.duration,index)">排课</el-button>
                 </div>

              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week4" label="周四" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week4" :key="index">
              <div class="class_element_2">
                <div class="t_choose" @click="chooseLesson(item.dayofweek,item.subject,item.class_number,item.duration,item.chooseLesson,index)">{{ item.chooseLesson }}</div>
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>

                 <div class="t_choose">
                    <el-popover
                      placement="right"
                      width="120"
                      trigger="click">
                      <el-table :data="gridData">
                        <el-table-column width="120" property="student_name" label="学生名"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70" v-if="isShow">
                        <template slot-scope="scope" >
                          <div style="justify-content: center;display: flex;flex-direction: column;">
                            <div>
                              <el-button @click.native.prevent="deleteRow(scope.$index, gridData)" type="text" size="small" style="font-size:x-small">移除</el-button>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      </el-table>
                      <el-button @click="getStudents(item.dayofweek,item.subject,item.class_number,item.duration)"  slot="reference" smaller style="font-size: smaller;font-weight: bolder;">明细</el-button>
                    </el-popover>
                    <el-button type="primary" style="font-size: smaller;font-weight: bolder;height: 37px;" @click="dialogFunction(item.dayofweek,item.subject,item.class_number,item.duration,index)">排课</el-button>
                 </div>
                 
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week5" label="周五" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week5" :key="index">
              <div class="class_element_1">
                 <div class="t_choose" @click="chooseLesson(item.dayofweek,item.subject,item.class_number,item.duration,item.chooseLesson,index)">{{ item.chooseLesson }}</div>
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>

                 <div class="t_choose">
                    <el-popover
                      placement="right"
                      width="120"
                      trigger="click">
                      <el-table :data="gridData">
                        <el-table-column width="120" property="student_name" label="学生名"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70" v-if="isShow">
                        <template slot-scope="scope" >
                          <div style="justify-content: center;display: flex;flex-direction: column;">
                            <div>
                              <el-button @click.native.prevent="deleteRow(scope.$index, gridData)" type="text" size="small" style="font-size:x-small">移除</el-button>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      </el-table>
                      <el-button @click="getStudents(item.dayofweek,item.subject,item.class_number,item.duration)"  slot="reference" smaller style="font-size: smaller;font-weight: bolder;">明细</el-button>
                    </el-popover>
                    <el-button type="primary" style="font-size: smaller;font-weight: bolder;height: 37px;" @click="dialogFunction(item.dayofweek,item.subject,item.class_number,item.duration,index)">排课</el-button>
                 </div>

              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="week6" label="周六" width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week6" :key="index">
              <div class="class_element_2">
                 <div class="t_choose" @click="chooseLesson(item.dayofweek,item.subject,item.class_number,item.duration,item.chooseLesson,index)">{{ item.chooseLesson }}</div>
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>

                 <div class="t_choose">
                    <el-popover
                      placement="right"
                      width="120"
                      trigger="click">
                      <el-table :data="gridData">
                        <el-table-column width="120" property="student_name" label="学生名"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70" v-if="isShow">
                        <template slot-scope="scope" >
                          <div style="justify-content: center;display: flex;flex-direction: column;">
                            <div>
                              <el-button @click.native.prevent="deleteRow(scope.$index, gridData)" type="text" size="small" style="font-size:x-small">移除</el-button>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      </el-table>
                      <el-button @click="getStudents(item.dayofweek,item.subject,item.class_number,item.duration)"  slot="reference" smaller style="font-size: smaller;font-weight: bolder;">明细</el-button>
                    </el-popover>
                    <el-button type="primary" style="font-size: smaller;font-weight: bolder;height: 37px;" @click="dialogFunction(item.dayofweek,item.subject,item.class_number,item.duration,index)">排课</el-button>
                 </div>
              </div>
            </div>
          </template>
          
        </el-table-column>
        <el-table-column prop="week7" label="周日"  width="150">
          <template slot-scope="scope">
            <div v-for="(item,index) in scope.row.week7" :key="index">
              <div class="class_element_1">
                <div class="t_choose" @click="chooseLesson(item.dayofweek,item.subject,item.class_number,item.duration,item.chooseLesson,index)">{{ item.chooseLesson }}</div>
                 <div class="text"> {{ item.subject }}_{{ item.class_number }}</div>
                 <div class="text"> {{ item.duration }} </div>
                 <div class="text"> 报名: {{ item.classes_count }} </div>
                 
                 <div class="t_choose">
                    <el-popover
                      placement="right"
                      width="120"
                      trigger="click">
                      <el-table :data="gridData">
                        <el-table-column width="120" property="student_name" label="学生名"></el-table-column>
                        <el-table-column fixed="right" label="操作" width="70" v-if="isShow">
                        <template slot-scope="scope" >
                          <div style="justify-content: center;display: flex;flex-direction: column;">
                            <div>
                              <el-button @click.native.prevent="deleteRow(scope.$index, gridData)" type="text" size="small" style="font-size:x-small">移除</el-button>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      </el-table>
                      <el-button @click="getStudents(item.dayofweek,item.subject,item.class_number,item.duration)"  slot="reference" smaller style="font-size: smaller;font-weight: bolder;">明细</el-button>
                    </el-popover>
                    <el-button type="primary" style="font-size: smaller;font-weight: bolder;height: 37px;" @click="dialogFunction(item.dayofweek,item.subject,item.class_number,item.duration,index)">排课</el-button>
                 </div>

              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      
      <div style="margin-left: 70%;">
        <el-button @click="showAdd" type="primary">新增课程</el-button>
      </div>
     
      <div v-if="isAdd">
        <el-select v-model="value" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
      </el-select>
      <el-input v-model="subject_add" placeholder="请输入科目"></el-input>
      <el-input v-model="class_number_add" placeholder="请输入班号"></el-input>
      <!-- <div style="display: flex;flex-direction: row;">
        <el-time-select allow-create 
          placeholder="起始时间"
          v-model="start_time"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:59'
          }">
        </el-time-select>
        <el-time-select allow-create 
          placeholder="结束时间"
          v-model="end_time"
          :picker-options="{
            start: '00:00',
            step: '00:30',
            end: '23:59',
            minTime: start_time
          }">
        </el-time-select>
      </div> -->

      <el-time-picker
        value-format="HH:mm"
        format="HH:mm"
        is-range
        v-model="time_value"
        range-separator="至"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        placeholder="选择时间范围">
      </el-time-picker>

      <div style="margin-left: 50%;margin-top: 10px;">
        <el-button @click ="addArrangement" type="success" plain>确定</el-button>
      </div>
      
      </div>



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
      tableData: [],
      leave_data:[],
      isShow:false,
      gridData: [],
      dialogFormVisible: false,
      allstudents:[],
      searchsubject:' 全科目',
      state:'',
      class_select:'',
      student_select:'',
      week_select:'',
      index_select:'',
      options: [{
          value: '1',
          label: '星期一'
        }, {
          value: '2',
          label: '星期二'
        }, {
          value: '3',
          label: '星期三'
        }, {
          value: '4',
          label: '星期四'
        }, {
          value: '5',
          label: '星期五'
        },{
          value: '6',
          label: '星期六'
        },{
          value: '7',
          label: '星期日'
        }],
        isAdd:false,
        value:'',
        time_value: [],
        subject_add:'',
        start_time:'',
        end_time:'',
        class_number_add:'',
        subject_add:''
    }
  },

  created () {
    this.getTimetable();
    this.getAllStudents();
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
      // console.log(that.tableData)
    },

    async chooseLesson (dayofweek,subject,class_number,duration,chooselesson,index) {
        let that = this
        let weekday = '星期' + dayofweek
        let inputdefault = weekday+ ',' + subject + ',' + class_number + ',' + duration
        let param ={
          openid: that.openid,
          inputdefault: inputdefault,
          chooselesson: chooselesson  
        }
        await HttpPost('/updateBossLessons', param)

        let res = await that .getArrangement(dayofweek)
        let status = res.chooseLesson
        that.tableData[0]['week'+dayofweek][index].chooseLesson = status
    },

    async getArrangement (dayofweek) {
      let that = this
      let param_1 ={
            studio: that.studio,
            dayofweek: dayofweek,
            subject: that.subject,
            openid: that.openid
        }
        const leave = await HttpPost('/getArrangement', param_1)
        let leave_data = leave.data[0]
        return leave_data
    },

    async addArrangement () {
      let that = this
      console.log(that.time_value)
      let duration = that.time_value[0] + '-' + that.time_value[1]
      console.log(that.value,duration,that.subject_add,that.class_number_add)

      if(that.value == ''){
          that.$message({
            message: '星期不能为空',
            type: 'warning'
          });
        return
      }

      if(that.subject_add == ''){
          that.$message({
            message: '科目不能为空',
            type: 'warning'
          });
        return
      }

      if(that.class_number_add == ''){
          that.$message({
            message: '班号不能为空',
            type: 'warning'
          });
        return
      }

      if(that.time_value.length == 0){
          that.$message({
            message: '时间不能为空',
            type: 'warning'
          });
        return
      }

      let param ={
        dayofweek:that.value,
        class_number:that.class_number_add,
        duration:duration,
        limits:10,
        studio:that.studio,
        subject:that.subject_add
      }
      await HttpPost('/insertArrangement', param)
      that.$message({
        message: '新增成功',
        type: 'success'
      });
      that.getTimetable()
      that.isAdd = false
    },

    showAdd() {
      this.isAdd=true
    },

    async getStudents (dayofweek,subject,class_number,duration) {
      let that = this;
      let weekDay = parseInt(dayofweek) + parseInt(1);
      if(dayofweek==7){
          weekDay=1
      }

      let param ={
        studio:that.studio,
        weekDay:weekDay,
        duration:duration,
        class_number:class_number,
        subject:subject,
      }
      const students = await HttpPost('/getScheduleDetail', param)
      let students_data = students.data;
      console.log(students_data)
      that.gridData = []
      for(var i in students_data){
        let json={}
        let student_name = students_data[i].student_name
        let id = students_data[i].id
        json.student_name = student_name
        json.id = id
        that.gridData.push(json)
      }
      // console.log(that.gridData)
    },

    deleteRow (index, gridData) {
      const id = gridData[index].id
      console.log(id)
      console.log(this.studio)
      console.log(this.role)
      let param ={
          studio:this.studio,
          id:id,
          role:this.role,
          openid:this.openid
        }
      let res = HttpPost("/deleteSchedule",param)
      res.then(res => {
          console.log(res.data)
          if(res.data == 1){
            this.$message({
                message: '删除成功',
                type: 'success'
            });
            this.getTimetable()
          }else {
            this.$message({
                message: '删除失败',
                type: 'warning'
            });
          }
      })
      
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
        if (subject == this.searchsubject){
          json.student_name = student_name
          list.push(json)
        }
      }
      if(list.size == 0){
        that.$message({
          message: '该学生未报该科目',
          type: 'warning'
        });
      }
      var results = queryString ? list.filter(this.createFilter(queryString)) : list;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },

    async getAllStudents () {
      let that = this;
      let param ={
        studio:that.studio,
        student_name:'all',
        subject:'全科目'
      }
      console.log(param)
      const students = await HttpPost('/getLesson', param)
      let students_data = students.data;
      console.log(students_data)
      that.allstudents = []
      for(var i in students_data){
        let json={}
        let student_name = students_data[i].student_name
        let subject = students_data[i].subject
        json.student_name = student_name
        json.subject = subject
        that.allstudents.push(json)
      }
      console.log(that.allstudents)

    },

    dialogFunction (dayofweek,subject,class_number,duration,index) {
        this.searchsubject = subject
        this.dialogFormVisible = true
        this.week_select = dayofweek
        this.index_select = index
        this.class_select = '星期'+dayofweek + ',' + class_number + ',' + duration + ',' + subject
        console.log(this.class_select)
    },

    handleSelect(item) {
      console.log(item);
      const subject = item.subject
      const student_name = item.student_name
      this.state = student_name
      this.student_select = student_name
    },

  
    async arrangeClass () {
      let that = this;
      that.dialogFormVisible = false
      let param ={
        student_name: that.student_select,
        class_select: that.class_select,
        studio:that.studio,
        status:'1'
      }
      await HttpPost('/arrangeClass', param)
      that.$message({
        message: '排课成功',
        type: 'success'
      });

      let res = await that .getArrangement(that.week_select)
      let classes_count = res.classes_count
      that.tableData[0]['week'+that.week_select][that.index_select].classes_count = classes_count
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
  background-color: rgb(147, 236, 181);
  border-radius: 5%;
  height: 180px;
  margin-bottom: 20px;
}

.t_choose{
  border-radius: 3rem;
  background-color: rgb(221, 232, 184);
  width: 60px;
  height: 25px;
  font-size: small;
  margin-left: 25%;
  justify-content: center;
  display: flex;
  margin-top: 25px;
}

.t_detail{
  border-radius: 3rem;
  width: 60px;
  height: 25px;
  font-size: small;
  margin-left: 25%;
  justify-content: center;
  display: flex;
}

.t_choose text {
  color: white;
}

.test{
  color:rgba(33, 31, 160, 0.843) ;
}


</style>
