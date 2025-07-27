<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 40px;width: 95%;">
          <div style="display: flex;flex-direction: row;justify-content: space-between;">
            <div>最大空间：{{ size_limit }} G</div>
            <div>已用空间：{{ used_size }} G</div>
            <div>可用空间：{{ free_size }} G</div>
          </div>
          <el-progress :show-text	="true" :text-inside="false" :stroke-width="20" :percentage="percentage" :color="progress_color"></el-progress>



          <el-table :data="tableData" style="width: 100%;font-size: small;" >
          <el-table-column prop="ppt_name" label="名称" >
          </el-table-column>
          <el-table-column prop="create_time" label="类别">
          </el-table-column>
          <el-table-column prop="single_size" label="大小(G)">
          </el-table-column>
          <el-table-column fixed="right" label="操作" v-if="isShow">
            <template slot-scope="scope" >
              <div style="justify-content: space-between;display: flex;flex-direction: row;width: 100px;">
                <div>
                  <el-button slot="reference" type="text" size="small" style="font-size:small">展开</el-button>
                </div>

                <div>
                  <el-popconfirm title="确定下载吗？" @confirm="deleteAll()">
                    <el-button slot="reference" type="text" size="small" style="font-size:small">下载</el-button>
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
  name: 'An',
  data () {
    return {
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      studio: this.$route.query.studio,
      header:'教学智库',
      select_category:'',
      type:'library',
      size_limit:0,
      used_size:0,
      free_size:0,
      progress_color:'#535CBE',
      isShow:true,
      tableData:[]
      
    }
  },

  created () {
    this.getAnalyzeDetail(this.dayType)
  },

  watch:{
    
  },

  methods: {
    async getAnalyzeDetail(){
      let that = this

      let param ={
          openid:that.openid,
          studio:that.studio,
          page:1,
          category:that.select_category,
          type:that.type
      }
      console.log(param)
      const res = await HttpPost('/getPptMenu', param)
      let res_data = res.data
      that.tableData = res_data
      console.log(res_data)
      let size_limit = res_data[0].size_limit;
      let used_size = res_data[0].used_size;
      let free_size = size_limit - used_size;
      that.size_limit = size_limit;
      that.used_size = used_size.toFixed(4);
      that.free_size = free_size.toFixed(4);
      that.percentage = (free_size*100/size_limit).toFixed(2);;
      for(var i in res_data){
        res_data[i].single_size = res_data[i].single_size.toFixed(4)
      }
      

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
