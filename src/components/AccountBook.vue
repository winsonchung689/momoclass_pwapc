<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
      </div>

     
      <div style="margin-top: 15%;">

        <el-switch v-if="isTable"
          v-model="isFilter"
          active-text="按月筛选"
          inactive-text="按日筛选">
        </el-switch>

        <div v-if="isBooking">
          <div>
          <el-button type="text"  @click="cancel">取消</el-button>
        </div>
          <el-switch
            style="display: block"
            v-model="type_input"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="收入"
            inactive-text="支出">
          </el-switch>
          
          <el-input style="width:200px; margin-top: 5px;margin-bottom: 5px;" v-model="amount_input" placeholder="请输金额"></el-input>
          <el-input
            style="width: 90%;"
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="mark_input">
          </el-input>
          <el-button @click="booking_confirm()" style="margin-left: 70%;margin-top: 5px;" type="primary">确定</el-button>
        </div>

        <div v-if="isTable">
          <div v-if="isFilterDay">
            <!-- <div style="font-size: medium;font-weight: bolder;color:rgb(80, 147, 255)">按日筛选</div> -->
            <el-date-picker
            v-model="start_date"
            type="date"
            placeholder="开始时间"
            style="width: 45%">
          </el-date-picker>
          <el-date-picker
            v-model="date_value"
            type="date"
            placeholder="结束时间"
            style="width: 45%">
          </el-date-picker>
          </div>

          <div v-if="isFilterMonth">
            <!-- <div style="font-size: medium;font-weight: bolder;color:rgb(80, 147, 255)">按月筛选</div> -->
            <el-date-picker
              v-model="month_value"
              type="month"
              placeholder="选择月">
            </el-date-picker>
          </div>
          

          <div style="margin-top: 5px;">
            <el-button-group>
              <el-button @click="type ='' " type="primary">全部</el-button>
              <el-button @click="type ='收入' " type="success">收入</el-button>
              <el-button @click="type ='支出' " type="danger">支出</el-button>
            </el-button-group>
            <el-button @click="booking" style="margin-left: 20%;" type="primary " icon="el-icon-edit" plain>入账</el-button>
          </div>
          <div style="font-size: medium;font-weight: bolder;color: cornflowerblue;">总营收: {{ turnover }}</div>
          <div class="echart" id="mychart" :style="myChartStyle"></div>
          <template>
            <el-table
              :data="tableData"
              style="width: 100%">
              <el-table-column
                prop="create_time"
                label="日期"
                width="90">
              </el-table-column>
              <el-table-column
                prop="mark"
                label="备注"
                width="150">
              </el-table-column>
              <el-table-column
                prop="amount"
                label="金额"
                width="50">
              </el-table-column>
              <el-table-column
                prop="type"
                label="类型"
                width="50">
              </el-table-column>
              <el-table-column fixed="right" label="操作" width="50">
                <template slot-scope="scope" >
                  <div style="justify-content: center;display: flex;flex-direction: column;">
                    <div>
                      <el-popconfirm title="确定移除吗？" @confirm="deleteRow(scope.$index, tableData)">
                        <el-button slot="reference" type="text" size="small" style="font-size:x-small">移除</el-button>
                      </el-popconfirm>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </div>
      </div>

      

      
    </div>
</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import * as echarts from "echarts";

export default {
  name: 'AccountBook',
  data () {
    return {
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      studio: this.$route.query.studio,
      header:'账本',
      tableData:[],
      date_value:'',
      date_time:'',
      type:'',
      myChart: {},
      myChartStyle: { float: "left", width: "100%", height: "300px" },
      pieData: [],
      pieName: [],
      turnover:'',
      start_date:'',
      type_input:true,
      amount_input:'',
      mark_input:'',
      isBooking:false,
      isTable:true,
      month_value:'',
      isFilter:false,
      isFilterDay:true,
      isFilterMonth:false,
      dayType:'day'
    }
  },

  created () {
    this.getAccountBook(this.dayType)
  },

   mounted() {
    this.initEcharts();
  },

  watch:{
    date_value: function() {
      let that = this
      console.log( 'date_value:' + that.date_value)
      // if(that.date_value.length != 10 && that.date_value.length > 0){
        var year = that.date_value.getFullYear()
        var month = that.date_value.getMonth() + 1
        var date= that.date_value.getDate()
        if (date >= 1 && date <= 9) {
            date = "0" + date;
        }
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        let date_time = year + '-' + month + '-' + date
        console.log(date_time)
        that.date_time = date_time
        that.getAccountBook(that.dayType)
      // }
    },

    start_date: function() {
      let that = this
      console.log(that.start_date)
      that.getAccountBook(that.dayType)
    },

    month_value: function() {
      let that = this
      console.log(that.month_value)
    that.getAccountBook(that.dayType)
    },

    type:function(){
      let that = this
      console.log(that.type)
      that.getAccountBook(that.dayType)
    },

    isFilter:function(){
      let that = this
      console.log(that.isFilter)
      if(that.isFilter == true){
          that.isFilterMonth = true
          that.isFilterDay = false
          that.month_value = ''
          that.dayType = 'month'
      }else if(that.isFilter == false){
          that.isFilterMonth = false
          that.isFilterDay = true
          that.start_date = ''
          that.date_value = ''
          that.dayType = 'day'
      }
    }

  },

  methods: {
    async getAccountBook(dayType){
      let that = this
      console.log(dayType)
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
      
      

      if(that.type == ''){
        that.type = 'all'
      }
      let param ={
          studio:that.studio,
          create_time:that.date_time,
          type: that.type,
          start_date:that.start_date,
          openid:that.openid
      }
      console.log(param)
      const res = await HttpPost('/getBookDetail', param)
      let res_data = res.data
      that.tableData = res_data
      // console.log(res_data)

      let revenue = 0
      let expenditure = 0
      let turnover = 0
      that.pieData = []
      for(var i in res_data){
        let type_get = res_data[i].type
        let amount_get = res_data[i].amount
        turnover = turnover + amount_get
        if(type_get == '收入'){
          revenue = revenue + amount_get
        }else if(type_get == '支出'){
          expenditure = expenditure + amount_get
        }
      }
      that.turnover = turnover
      // console.log(turnover,expenditure,revenue)
      let revenue_json = {
        value: revenue,
        name: "收入"
      }
      that.pieData.push(revenue_json)
      let expenditure_json = {
        value: expenditure,
        name: "支出"
      }
      that.pieData.push(expenditure_json)
      // console.log(that.pieData)
      that.initEcharts();

    },

    initEcharts() {
      // 饼图
      const option = {
        legend: {
          // 图例
          data: this.pieName,
          right: "10%",
          top: "30%",
          orient: "vertical"
        },
        title: {
          // 设置饼图标题，位置设为顶部居中
          text: "",
          top: "0%",
          left: "center"
        },
        series: [
          {
            type: "pie",
            label: {
              show: true,
              formatter: "{b} : {c} ({d}%)" // b代表名称，c代表对应值，d代表百分比
            },
            radius: "30%", //饼图半径
            data: this.pieData
          }
        ]
      };
      // console.log(this.seriesData);
      const optionFree = {
        xAxis: {},
        yAxis: {},
        series: [
          {
            data: this.seriesData,
            type: "line",
            smooth: true
          }
        ]
      };
      this.myChart = echarts.init(document.getElementById("mychart"));
      this.myChart.setOption(option);
      //随着屏幕大小调节图表
      window.addEventListener("resize", () => {
        this.myChart.resize();
      });
    },

    booking(){
      let that = this
      that.isBooking = true
      that.isTable = false
    },

    cancel(){
      let that = this
      that.isBooking = false
      that.isTable = true
      that.getAccountBook(that.dayType)
      // that.initEcharts()
    },

    async booking_confirm(){
      let that = this
      that.isBooking = false
      that.isTable = true
      let type = '收入'
      if(that.type_input == false){
        type = '支出'
      }
      let param ={
          studio: that.studio,
          mark: that.mark_input,
          amount:that.amount_input,
          type: type,
          openid:that.openid
      }
      // console.log(param)
      const res = await HttpPost('/bookkeeping', param)
      console.log(res.data)
      that.$message({
          message: '操作成功',
          type: 'success'
      });
      that.getAccountBook(that.dayType)
    },
  
    deleteRow (index, tableData) {
      const id = tableData[index].id
      let param ={
          studio:this.studio,
          id:id,
          role:this.role,
          openid:this.openid
        }
      let res = HttpPost("/deleteBookDetail",param)
      res.then(res => {
          if(res.data == 1){
            this.$message({
                message: '删除成功',
                type: 'success'
            });
            this.getAccountBook(this.dayType)
          }else {
            this.$message({
                message: '删除失败',
                type: 'warning'
            });
          }
      })
      
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
