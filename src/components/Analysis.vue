<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>

     
      <div style="margin-top: 3%;">
        <div style="display: flex;justify-content: space-evenly;">
          <div style="display: flex;flex-direction: row;align-items: center;justify-content: space-between;width: 50%;">
            <el-date-picker
              v-model="isDuration"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions">
            </el-date-picker>

            <div>
              <el-select v-model="type">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>

            <div>
              <el-switch
                style="display: block"
                v-model="isFilter"
                active-color="#13ce66"
                inactive-color="#13ce66"
                active-text="月统计"
                inactive-text="日统计">
              </el-switch>
            </div>

          </div>
        </div>

        <div v-if="isTable">
          <div style="justify-content: left;display: flex;">
            <div class="echart" id="mychart" :style="myChartStyle"></div>
          </div>
        </div>

        <template>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="create_time"
              label="时间"
              >
            </el-table-column>
            <el-table-column
              prop="leaveCount"
              label="请假/次"
            >
            </el-table-column>
            <el-table-column
              prop="tryCount"
              label="试听/节"
            >
            </el-table-column>
            <el-table-column
              prop="all_lesson_count"
              label="排课/节"
            >
            </el-table-column>
            <el-table-column
              prop="signCount"
              label="签到/节"
              >
            </el-table-column>
            <el-table-column
              prop="lessonCount"
              label="消课/课时"
            >
            </el-table-column>
            <el-table-column
              prop="weekPrice"
              label="金额/元"
            >
            </el-table-column>
            <el-table-column
              prop="rate"
              label="出勤率%"
            >
            </el-table-column>
            
          </el-table>
        </template>
      </div>
    </div>


</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import * as echarts from "echarts";

export default {
  name: 'An',
  data () {
    return {
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      studio: this.$route.query.studio,
      header:'统计分析',
      tableData:[],
      date_value:'',
      date_time:'',
      type:'课时',
      myChart: {},
      myChartStyle: { float: "left", width: "100%", height: "400px" },
      date_time_bar: [],
      sum_data_bar: [],
      start_date:'',
      isTable:true,
      month_value:'',
      isFilter:false,
      dayType:'day',
      value:false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      isDuration:'',
      duration_time:'无_无',
      options: [{
          value: '课时',
          label: '课时'
        }, {
          value: '签到',
          label: '签到'
        }, {
          value: '排课',
          label: '排课'
        }, {
          value: '金额',
          label: '金额'
        }],
    }
  },

  created () {
    this.getAnalyzeDetail(this.dayType)
  },

   mounted() {
    this.initEcharts();
  },

  watch:{
    isFilter:function(){
      let that = this
      console.log(that.isFilter)
      if(that.isFilter == true){
          that.dayType = 'month'
      }else if(that.isFilter == false){
          that.dayType = 'day'
      }
      that.getAnalyzeDetail(that.dayType)
    },

    isDuration:function(){
      let that = this
      console.log(that.isDuration)
      let start_time = that.isDuration[0]
      var year = start_time.getFullYear()
        var month =start_time.getMonth() + 1
        var date= start_time.getDate()
        if (date >= 1 && date <= 9) {
            date = "0" + date;
        }
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        let start_date = year + '-' + month + '-' + date
        // console.log(start_date)

        let end_time = that.isDuration[1]
        var year1 = end_time.getFullYear()
        var month1 =end_time.getMonth() + 1
        var date1= end_time.getDate()
        if (date1 >= 1 && date1 <= 9) {
          date1 = "0" + date1;
        }
        if (month1 >= 1 && month1 <= 9) {
          month1 = "0" + month1;
        }
        let end_date = year1 + '-' + month1 + '-' + date1
        // console.log(end_date)

        that.duration_time= start_date + '_' + end_date;
        // console.log(that.duration_time)
        that.getAnalyzeDetail(that.dayType)
    },

    type:function(){
      let that = this
      that.getAnalyzeDetail(that.dayType)
    },
  },

  methods: {
    async getAnalyzeDetail(dayType){
      let that = this
      console.log(dayType)
      let dimension = '日';
      if(dayType == 'day'){
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
      }else if (dayType == 'month'){
          dimension = '月';
          console.log(that.month_value)
          if(that.month_value){
            var year = that.month_value.getFullYear()
            var month = that.month_value.getMonth() + 1
            var date= that.month_value.getDate()
            if (date >= 1 && date <= 9) {
                date = "0" + date;
            }
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            let date_time = year + '-' + month + '-31'
            let start_date = year + '-' + month + '-01'
            that.date_time = date_time
            that.start_date = start_date
        }
      }
        
      
      let param ={
          studio:that.studio,
          date_time:that.date_time,
          openid:that.openid,
          dimension:dimension,
          duration_time:that.duration_time
      }
      console.log(param)
      const res = await HttpPost('/getAnalyzeDetail', param)
      let res_data = res.data
      that.tableData = res_data
      console.log(res_data)

      that.date_time_bar=[];
      that.sum_data_bar=[];
      for(var i in res_data){
        that.date_time_bar.push(res_data[i].create_time);

        if(that.type == '课时'){
          that.sum_data_bar.push(res_data[i].lessonCount);
        }else if(that.type == '签到'){
          that.sum_data_bar.push(res_data[i].signCount);
        }else if(that.type == '排课'){
          that.sum_data_bar.push(res_data[i].all_lesson_count);
        }else if(that.type == '金额'){
          that.sum_data_bar.push(res_data[i].weekPrice);
        }
        
        
      }
      console.log(that.date_time_bar,that.sum_data_bar)
      that.initEcharts();

    },

    initEcharts() {
      const option = {
        title: {
          text: this.type + "统计图",
          top: "0%",
          right: "10%"
        },
        xAxis:{
          data:this.date_time_bar,
        },
        yAxis:{},
        label:{
          show:true,
          position:'top'
          
        },
        series: [
          {
            name:"课时数",
            type:'bar',
            barWidth:20,
            data:this.sum_data_bar,
            barHeight:150
          }
        ]
      };
      // console.log(this.seriesData);
      this.myChart = echarts.init(document.getElementById("mychart"));
      this.myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },

    goOff() {
      this.$router.go(-1);
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

.el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

</style>
