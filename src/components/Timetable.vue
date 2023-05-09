<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 15%;">
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

        <div v-if="isTimetable" >
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
                      <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 10px;">
                        <div @click="updateRemind(item.remind,item.subject,item.duration,item.class_number,item.dayofweek)" style="justify-content: center;margin-top: 12px;">
                          <el-button v-if="item.remind==0?true:false" icon="el-icon-message-solid" circle size="mini"></el-button>
                          <el-button v-if="item.remind==1?true:false" type="primary" icon="el-icon-message-solid" circle size="mini"></el-button>
                        </div>
                        <el-popconfirm title="确定删除吗？" style="justify-content: center;margin-top: 12px;" @confirm="deleteArrangement(item.id,item.dayofweek,item.subject,item.class_number,item.duration)">
                          <el-button slot="reference" icon="el-icon-delete" type="danger" circle size="mini"></el-button>
                        </el-popconfirm>
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

                    <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 10px;">
                        <div @click="updateRemind(item.remind,item.subject,item.duration,item.class_number,item.dayofweek)" style="justify-content: center;margin-top: 12px;">
                          <el-button v-if="item.remind==0?true:false" icon="el-icon-message-solid" circle size="mini"></el-button>
                          <el-button v-if="item.remind==1?true:false" type="primary" icon="el-icon-message-solid" circle size="mini"></el-button>
                        </div>
                        <el-popconfirm title="确定删除吗？" style="justify-content: center;margin-top: 12px;" @confirm="deleteArrangement(item.id,item.dayofweek,item.subject,item.class_number,item.duration)">
                          <el-button slot="reference" icon="el-icon-delete" type="danger" circle size="mini"></el-button>
                        </el-popconfirm>
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

                    <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 10px;">
                      <div @click="updateRemind(item.remind,item.subject,item.duration,item.class_number,item.dayofweek)" style="justify-content: center;margin-top: 12px;">
                        <el-button v-if="item.remind==0?true:false" icon="el-icon-message-solid" circle size="mini"></el-button>
                        <el-button v-if="item.remind==1?true:false" type="primary" icon="el-icon-message-solid" circle size="mini"></el-button>
                      </div>
                      <el-popconfirm title="确定删除吗？" style="justify-content: center;margin-top: 12px;" @confirm="deleteArrangement(item.id,item.dayofweek,item.subject,item.class_number,item.duration)">
                        <el-button slot="reference" icon="el-icon-delete" type="danger" circle size="mini"></el-button>
                      </el-popconfirm>
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

                    <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 10px;">
                      <div @click="updateRemind(item.remind,item.subject,item.duration,item.class_number,item.dayofweek)" style="justify-content: center;margin-top: 12px;">
                        <el-button v-if="item.remind==0?true:false" icon="el-icon-message-solid" circle size="mini"></el-button>
                        <el-button v-if="item.remind==1?true:false" type="primary" icon="el-icon-message-solid" circle size="mini"></el-button>
                      </div>
                      <el-popconfirm title="确定删除吗？" style="justify-content: center;margin-top: 12px;" @confirm="deleteArrangement(item.id,item.dayofweek,item.subject,item.class_number,item.duration)">
                        <el-button slot="reference" icon="el-icon-delete" type="danger" circle size="mini"></el-button>
                      </el-popconfirm>
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

                    <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 10px;">
                      <div @click="updateRemind(item.remind,item.subject,item.duration,item.class_number,item.dayofweek)" style="justify-content: center;margin-top: 12px;">
                        <el-button v-if="item.remind==0?true:false" icon="el-icon-message-solid" circle size="mini"></el-button>
                        <el-button v-if="item.remind==1?true:false" type="primary" icon="el-icon-message-solid" circle size="mini"></el-button>
                      </div>
                      <el-popconfirm title="确定删除吗？" style="justify-content: center;margin-top: 12px;" @confirm="deleteArrangement(item.id,item.dayofweek,item.subject,item.class_number,item.duration)">
                        <el-button slot="reference" icon="el-icon-delete" type="danger" circle size="mini"></el-button>
                      </el-popconfirm>
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

                    <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 10px;">
                      <div @click="updateRemind(item.remind,item.subject,item.duration,item.class_number,item.dayofweek)" style="justify-content: center;margin-top: 12px;">
                        <el-button v-if="item.remind==0?true:false" icon="el-icon-message-solid" circle size="mini"></el-button>
                        <el-button v-if="item.remind==1?true:false" type="primary" icon="el-icon-message-solid" circle size="mini"></el-button>
                      </div>
                      <el-popconfirm title="确定删除吗？" style="justify-content: center;margin-top: 12px;" @confirm="deleteArrangement(item.id,item.dayofweek,item.subject,item.class_number,item.duration)">
                        <el-button slot="reference" icon="el-icon-delete" type="danger" circle size="mini"></el-button>
                      </el-popconfirm>
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

                    <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 10px;">
                      <div @click="updateRemind(item.remind,item.subject,item.duration,item.class_number,item.dayofweek)" style="justify-content: center;margin-top: 12px;">
                        <el-button v-if="item.remind==0?true:false" icon="el-icon-message-solid" circle size="mini"></el-button>
                        <el-button v-if="item.remind==1?true:false" type="primary" icon="el-icon-message-solid" circle size="mini"></el-button>
                      </div>
                      <el-popconfirm title="确定删除吗？" style="justify-content: center;margin-top: 12px;" @confirm="deleteArrangement(item.id,item.dayofweek,item.subject,item.class_number,item.duration)">
                        <el-button slot="reference" icon="el-icon-delete" type="danger" circle size="mini"></el-button>
                      </el-popconfirm>
                    </div>

                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <div style="display: flex;flex-direction: row;justify-content: space-between;">
            <div>
              <el-time-select
                style="width: 80%;"
                v-model="send_time"
                :picker-options="{
                  start: '00:00',
                  step: '00:15',
                  end: '23:59'
                }"
                placeholder="选择时间">
              </el-time-select>
              <el-button @click="updateSendTime()" type="primary" icon="el-icon-thumb" circle></el-button>
            </div>
            <el-button @click="showAdd" type="primary">新增课程</el-button>
          </div>
        </div>
        
        <div v-if="isAdd">
          <div>
            <el-button type="text"  @click="back">取消</el-button>
          </div>

          <div style="width: 50%;">
            <el-select v-model="value" placeholder="请选择星期">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>

            <el-input v-model="subject_add" placeholder="请输入科目"></el-input>
            <el-input v-model="class_number_add" placeholder="请输入班号"></el-input>
          </div>
          
          <div style="display: flex;flex-direction: row; width: 80%;"> 
            <el-time-select
              placeholder="起始时间"
              v-model="start_time"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:59'
              }">
            </el-time-select>
            <el-time-select
              placeholder="结束时间"
              v-model="end_time"
              :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:59',
                minTime: start_time
              }">
            </el-time-select>
          </div>
          
          <div style="margin-top: 20px;display: flex;justify-content: center;">
            <el-button @click ="addArrangement" type="success" plain>确定</el-button>
          </div>
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
      send_time:this.$route.query.send_time,
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
      subject_add:'',
      start_time:'00:00',
      end_time:'00:00',
      class_number_add:'',
      subject_add:'',
      isTimetable:true,
      Remind:true,
      isRemind:false
    }
  },

  created () {
    this.getTimetable();
    this.getAllStudents();
  },

  methods: {
    async getTimetable () {
      let that = this;
      if(that.role == 'boss' || that.role == 'teacher'){
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
          // console.log(leave_data)
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
      let duration = that.start_time + '-' + that.end_time
      // console.log(that.value,duration,that.subject_add,that.class_number_add)

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

      let param ={
        dayofweek:that.value,
        class_number:that.class_number_add,
        duration:duration,
        limits:10,
        studio:that.studio,
        subject:that.subject_add,
        openid:that.openid
      }
      await HttpPost('/insertArrangement', param)
      that.$message({
        message: '新增成功',
        type: 'success'
      });
      that.getTimetable()
      that.isAdd = false
      that.isTimetable = true
    },

    showAdd() {
      this.isAdd=true
      this.isTimetable = false
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
        openid:that.openid
      }
      const students = await HttpPost('/getScheduleDetail', param)
      let students_data = students.data;
      // console.log(students_data)
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
      let param ={
          studio:this.studio,
          id:id,
          role:this.role,
          openid:this.openid
        }
      let res = HttpPost("/deleteSchedule",param)
      res.then(res => {
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
        subject:'全科目',
        openid:that.openid
      }
      // console.log(param)
      const students = await HttpPost('/getLesson', param)
      let students_data = students.data;
      // console.log(students_data)
      that.allstudents = []
      for(var i in students_data){
        let json={}
        let student_name = students_data[i].student_name
        let subject = students_data[i].subject
        json.student_name = student_name
        json.subject = subject
        that.allstudents.push(json)
      }
      // console.log(that.allstudents)

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
      // console.log(item);
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
        status:'1',
        openid:that.openid
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

    deleteArrangement (id,dayofweek,subject,class_number,duration) {
      let that = this 
      let param ={
          id:id,
          studio:that.studio,
          role:that.role,
          openid:that.openid,
          duration:duration,
          weekday:dayofweek,
          class_number:class_number,
          subject:subject
        }
      let res = HttpPost("/deleteArrangement",param)
      res.then(res => {
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

    updateRemind(remind,subject,duration,class_number,dayofweek){
      console.log(dayofweek)
      let that = this 
      let subject_class =subject + ',' + class_number.replace('(插班生)','') + ','+ duration;
      let type = 'reremind'
      if(remind == 1 ){
        type = 'cancel'
      }
      if(dayofweek == 7){
        dayofweek = 1
      }else{
        dayofweek = dayofweek + 1
      }
      let param ={
        subject_class:subject_class,
        studio:that.studio,
        type:type,
        dayofweek:dayofweek,
        oepnid:that.openid
      }
      let res = HttpPost("/updateRemind",param)
      res.then(res => {
        // console.log(res.data)
        this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.getTimetable()
        })
    },

    back () {
      this.isTimetable = true
      this.isAdd =false
    },

    goOff () {
      this.$router.go(-1);
    },

    async updateSendTime(){
      let that = this
      let param ={
          studio:that.studio,
          openid:that.openid,
          send_time:that.send_time
        }
      let res = await HttpPost("/updateSendTime",param)
      // console.log(res)
      if(res.status == 200){
            this.$message({
                message: '操作成功',
                type: 'success'
            });
            this.getTimetable()
          }else {
            this.$message({
                message: '操作失败',
                type: 'warning'
            });
          }

    }

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
  height: 200px;
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
  height: 200px;
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
  color:rgba(222, 121, 53, 0.843) ;
}


</style>
