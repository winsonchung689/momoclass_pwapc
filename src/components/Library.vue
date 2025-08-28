<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 40px;width: 95%;">
          <!-- 进度条 -->
          <div style="display: flex;flex-direction: row;justify-content: space-around;">
            <div>最大空间：{{ size_limit }} G</div>
            <div>已用空间：{{ used_size }} G</div>
            <div>可用空间：{{ free_size }} G</div>
          </div>
          <el-progress :text-inside="true" :stroke-width="20" :percentage="percentage" :color="progress_color"></el-progress>

          <!-- 类别 -->
          <div style="margin-top: 20px;display:flex;flex-direction: row;justify-content: space-around;font-weight: bold;">
            <div v-for="item in category_all_list" >
                <el-button type="primary" plain round @click="getPptMenu(item)" style="border-radius: 0.6rem;">{{item}}</el-button>
            </div>
            <!-- <div><el-button type="success">新增类别</el-button></div> -->
          </div>
          
          <template>
            <div style="height: 10vh">
              <vue-office-pptx :src="pptUrl" @rendered=""  @error=""/>
            </div>
          </template>
          
          
          <!-- 列表 -->
          <el-table :data="tableData" style="width: 100%;font-size: small;color: black;font-weight: bold;" >
            <el-table-column prop="category" label="类别">
            </el-table-column>
            <el-table-column prop="ppt_name" label="名称" >
            </el-table-column>
            <el-table-column label="封面">
              <template slot-scope="scope">
                <div style="height: 70px;width: 150px;overflow: hidden;display: flex;align-items: center;">
                  <img :src="scope.row.url" width="70%" alt="">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="introduce" label="简介" >
            </el-table-column>
            <el-table-column prop="single_size" label="大小(G)">
            </el-table-column>
            <!-- 展开 -->
            <el-table-column type="expand">
              <template slot-scope="props">
                  <div v-for="(item,index) in props.row.children" :key="index">

                    <div style="margin-top: 10px;color:darkgrey;font-size: small;width: 90%;;display: flex;flex-direction: row;margin-left: 1%;justify-content: space-between;align-items: center;">
                        <div style="display: flex;flex-direction: row;width: 40%;">
                            <div>序号：{{ item.rank }}</div>
                            <div style="margin-left: 10px;">名称：{{ item.file_name }}</div>
                        </div>
                        <div style="height: 70px;width: 150px;overflow: hidden;display: flex;align-items: center;">
                          <img :src="item.url" width="70%" alt="">
                        </div>
                        <div >大小：{{ item.size }} G</div>
                        <button @click="preview(item.file_name)">预览</button>
                        <button type="button" @click="downlowd(item.file_name)">下载</button>
                    </div>

                  </div>
              </template>
            </el-table-column>
            <!-- 按钮 -->
            <el-table-column fixed="right" label="操作" v-if="isShow">
              <template slot-scope="props" >
                <div style="justify-content: space-between;display: flex;flex-direction: row;width: 200px;">
                  <div>
                    <el-popconfirm v-if="!isUpload" title="确定上传吗？" @confirm="menuId(props.row.id)">
                      <el-button slot="reference" type="primary" size="small">点击上传 </el-button>
                    </el-popconfirm>

                    <el-upload 
                      class="upload-demo"
                      action="#"
                      :on-change="handleChange"
                      :multiple="true"
                      :type="file"
                      :auto-upload="true"
                      >
                      <el-button v-if="isUpload" type="success" size="small">添加文件 </el-button>
                    </el-upload>
                  </div>

                  <!-- <div>
                    <el-popconfirm title="确定下载全部吗？" @confirm="downloadAll(props.row.children,props.row.ppt_name)">
                      <el-button slot="reference" type="primary" size="small" style="font-size:small">下载全部</el-button>
                    </el-popconfirm>
                  </div> -->
                  
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
import download from "downloadjs"
import { ImageUrl } from '@/api'
import { UploadFile } from '@/api'
import { saveAs } from 'file-saver';
import JSZip from 'jszip';


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
      tableData:[],
      percentage:0,
      category_all_list:[],
      soli_color:'#535CBE',
      light_color:'rgba(230, 231, 233, 0.904)',
      menu_id:'',
      isUpload:false,
      file:'',
      pptUrl:'https://www.momoclasss.xyz:443/data/disk/uploadteach/' + 'aa.pptx'
    }
  },


  created () {
    this.getPptMenu(this.dayType)
  },

  watch:{
    
  },

  computed:{

    backgroundClass() {
      let that = this;
      return that.select_category?'soli-background':'light-background ';
    }
  },

  methods: {
    async getPptMenu(select_category){
      let that = this

      let param ={
          openid:that.openid,
          studio:that.studio,
          page:1,
          category:select_category,
          type:that.type
      }
      console.log(param)
      const res = await HttpPost('/getPptMenu', param)
      let res_data = res.data
      console.log(res_data)

      let size_limit = res_data[0].size_limit;
      let used_size = res_data[0].used_size;
      let free_size = size_limit - used_size;
      let category_all = res_data[0].category_all;
      that.category_all_list = category_all.split(',')
      that.select_category = res_data[0].category;
      // console.log( that.category_all_list)
      that.size_limit = size_limit;
      that.used_size = used_size.toFixed(4);
      that.free_size = free_size.toFixed(4);
      that.percentage = (free_size*100/size_limit).toFixed(2)*1
      for(var i in res_data){
          res_data[i].url =ImageUrl + res_data[i].uuid;
          res_data[i].single_size = res_data[i].single_size.toFixed(4);
          let menu_id = res_data[i].id;


          let param ={
            menu_id:menu_id
          }
          console.log(param)
          const librarg_res = await HttpPost('/getLibraryByMenuId', param)
          let librarg_data = librarg_res.data
          console.log(librarg_data)

          let children = [];
          for(var j in librarg_data){
            var json = {}
            const file_name = librarg_data[j].file_name
            const size = (librarg_data[j].size/1024/1024/1024).toFixed(4);
            const id = librarg_data[j].id;
            const uuid = librarg_data[j].uuid;
            const url = ImageUrl + librarg_data[j].uuid;

            json.url = url;
            json.uuid = uuid;
            json.file_name = file_name;
            json.size = size;
            json.id = id;
            json.rank = parseInt(j) + 1;
            children.push(json)
          }
          res_data[i].children = children;
      }
      that.tableData = res_data
      console.log(res_data)
    },

    async downlowd(file_name){
      let that = this;
      let studio = that.studio.replace('/','');
      console.log(file_name)
      window.open('https://www.momoclasss.xyz:443/downloadFile?file_name=' + file_name + '&studio=' + studio)
    },

    preview(file_name){
      let that = this;
      let studio = that.studio.replace('/','');
      window.open('https://www.momoclasss.xyz:443/downloadFile?file_name=' + file_name + '&studio=' + studio)
      // that.pptUrl =  pptUrl;
    },

    async downloadAll(list,ppt_name){
      let that = this;
      let studio = that.studio.replace('/','');
      const zip = new JSZip();
      this.$message('正在下载中');
      for(var i in list){
        let file_name = list[i].file_name;
        const response =await fetch('https://www.momoclasss.xyz:443/downloadFile?file_name=' + file_name + '&studio=' + studio);
        const blob = await response.blob();
        zip.file(file_name,blob)
      }
      const content =await zip.generateAsync({type: 'blob' });
      saveAs(content, ppt_name);
      this.$message('下载完成！');
    },

    async downloadFileByType(file_name,studio,type){
       let param ={
            file_name:file_name,
            studio:studio,
            type:type
        }
        let res = HttpPost('/downloadFileByType', param)
        console.log(res)
        window.open(res)
    },

    menuId(id){
      let that = this;
      that.menu_id = id;
      that.isUpload = !that.isUpload;
      console.log(that.menu_id,that.isUpload)

    },

    async handleChange(file,fileList){
      let that = this
      for(var i in fileList){
        console.log(fileList[i])
        let file = fileList[i];

        const formdata = new FormData();
        formdata.append('file',file.raw);
        formdata.append('file_name',file.name);
        formdata.append('studio',that.studio);
        formdata.append('type','teach');
        // console.log(formdata)
        let res =  UploadFile('/uploadFileByType', formdata)
        console.log(res)
        res.then(res => {
            that.insertLibrary(that.menu_id,file.name,file.size)
        })
      }
    },

    async insertLibrary(menu_id,file_name,size){
        let that = this;
        let param ={
            menu_id:menu_id,
            file_name:file_name,
            size:size
        }
        let res = HttpPost('/insertLibrary', param)
        res.then(res => {
          this.$message({
              message: '上传成功',
              type: 'success'
          });
          // console.log(res)
          that.getPptMenu(that.select_category)
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

.soli-background {

  background-color: #535CBE;

}

.light-background {

  background-color: rgba(135, 136, 136, 0.904);

}

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
