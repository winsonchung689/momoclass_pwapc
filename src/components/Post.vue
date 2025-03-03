<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
      </div>
    
      <div style="margin-top: 15%;">
        <el-switch
          v-model="is_private"
          active-text="是否仅我的社区可见"
          inactive-text="">
        </el-switch>

         <el-switch
          v-model="is_anonymous"
          active-text="是否游客发布"
          inactive-text="">
        </el-switch>
  
        <div style="margin-bottom: 30px;margin-top: 10px;">
          <el-upload
            list-type="picture-card"
            style="display: inline"
            :auto-upload="false"
            :on-change="handleChange"
            :file-list="fileList"
            :multiple="true"
            :type="file"
            action="#">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url" alt=""
                >
              </div>
          </el-upload>
  
          <div style="width: 80%;margin-top: 10%;">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="说点什么..."
              v-model="content">
            </el-input>
          </div>
  
          <div style="display: flex;justify-content: center; margin-top: 20px;">
            <el-button type="primary" @click="post">提交</el-button>
          </div>
          
        </div>
  
      </div>
    </div>
      
  </template>
  
  <script>
  
  import { HttpGet } from '@/api'
  import { HttpPost } from '@/api'
  import { sendNotification } from '@/api'
  import { UploadFile } from '@/api'
  import Recorder from 'js-audio-recorder'
  
  export default {
    name: 'Post',
    data () {
      return {
        subject:this.$route.query.subject,
        studio:this.$route.query.studio,
        role:this.$route.query.role,
        openid:this.$route.query.openid,
        header: '发帖',
        index1:'',
        index2:'',
        fileList:[],
        uuids:[],
        content:'',
        is_private:false,
        is_anonymous:false
      }
    },
  
    created () {
    },
  
    methods: {

      async post () {
        let that = this
        let uuids = ''
        for(var i in that.uuids){
          if(uuids==''){
            uuids = that.uuids[i]
          }else{
            uuids = uuids.concat(',' + that.uuids[i])
          }
        }
        let is_private_value = 0 
        if(that.is_private==true){
          is_private_value = 1
        }

        let param ={
            openid:that.openid,
            uuids:uuids,
            content:that.content,
            studio:that.studio,
            is_private:is_private_value
        }

         if(that.is_anonymous==true){
            param.openid = ''
            param.studio = ''
        }
        // console.log(param)
        await HttpPost('/insertPost', param)

        that.goOff()
      },

      async handleChange(file, fileList) {
        let that = this

        const formdata = new FormData();
        formdata.append('photo',file.raw);

        let res = await UploadFile('/push_photo', formdata)
        let uuid  = res.data.split("/")[4]
        that.uuids.push(uuid)
        // console.log(that.uuids)
      },
    
      
      goOff () {
        this.$router.go(-1);
      },

  
    }
  
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style>
  .el-icon-arrow-left{
    margin-left: 5px;
    margin-top: 10px;
    scale: 1.5;
  }
  
  .el-calendar .el-calendar__body .el-calendar-table__row .el-calendar-day {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      padding: 8px;
      height: 50px;
  }
  
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  
  </style>
  