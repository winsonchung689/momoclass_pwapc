<template>
  
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
      </div>
      <div style="margin-top: 15%;">
        <div style="justify-content: left;display: flex;margin-top: 5%;margin-bottom: 15px;flex-direction: column;" v-for="(item,index_out) in items">
          <div class="covers" :style="{display:MinDisplay}">
              <div class="cover" v-for="(img,index) in item.images" :key='img'>
                <img :src="img.src" width="90%" class="min" @click="ZoomIn(index_out+'_'+index)" alt="">
              </div>
          </div>

          <div class="max" :style="{display:display}">
              <div @click="ZoomOut"  v-for="(img,index) in item.images" :key='img' :class="[index_out+'_'+index===ShowIndex?'active':'None']" ><img :src="img.src" width="100%"></div>
          </div>

          <div  class="foot" :style="{display:MinDisplay}">
            <div>学生: {{ item.student_name }}</div>
            <div>课堂名称: {{ item.class_name }}</div>
            <div>课堂目标: {{ item.class_target }}</div>

            <div>
              积极度:
              <el-rate
                disabled
                v-model= "item.positive"
                >
              </el-rate>
            </div>
            <div>
              纪律性:
              <el-rate
                disabled
                v-model="item.discipline"
                >
              </el-rate>
            </div>
            <div>
              开心值:
              <el-rate
                disabled
                v-model="item.happiness"
                >
              </el-rate>
            </div>

            <div>老师点评: {{ item.comment }}</div>
            <div v-if="item.isMp3">
              <audio  controls ref="audio" class="aud" :src="item.mp3_url"></audio>
            </div>
            <div style="font-size: x-small;font-weight: bold;color: #a3b2b3;margin-top: 5px;">{{ studio }}  {{ item.create_time}}</div>
            <div v-if="isBoss" @click=deleteRow(item.id) style="margin-top: 10px;margin-left: 85%;"><el-button type="danger" icon="el-icon-delete" circle></el-button></div>
            <el-divider></el-divider>
          </div> 
        </div>


          <div :style="{display:MinDisplay}" style="display: flex;justify-content: center;position: fixed;bottom: 10px;;background-color: #fff;width: 100%;">
            <el-pagination
              medium
              background
              layout="prev, pager, next"
              :total="500"
              @current-change="handleCurrentChange">
            </el-pagination>
          </div>
      </div>
  </div>

</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import { ImageUrl } from '@/api'
import { Mp3Url } from '@/api'

export default {
  name: 'GrowthRecord',
  data () {
    return {
      subject: this.$route.query.subject,
      studio: this.$route.query.studio,
      student_name: this.$route.query.student_name,
      role: this.$route.query.role,
      openid: this.$route.query.openid,
      comment_style: this.$route.query.comment_style,
      header:  '课评中心',
      items: [],
      MinDisplay:'flex',
      ShowIndex:0,
      display: 'none',
      page:1,
      isBoss:false,
    }
  },

  created () {
    this.getComment (this.page)
  },

  methods: {
    async getComment (page) {
      let that = this;
      if(that.role == 'boss'){
        that.isBoss = true
      }
      let param ={
        studio:that.studio,
        comment_style:that.comment_style,
        openid:that.openid,
        role:that.role,
        class_target:'课评',
        page:page
      }
      const comments = await HttpPost('/getMessage', param)
      let comments_data = comments.data;
      // console.log(comments_data)
      for( var i in comments_data){
          const uuids = comments_data[i].uuids
          const mp3_url_get = comments_data[i].mp3_url
          comments_data[i]["isMp3"] = false
          console.log(mp3_url_get)
          if(mp3_url_get.replace('undefined','').replace('no_mp3_url','').length > 0){
            let mp3_url = Mp3Url + mp3_url_get
            comments_data[i]["mp3_url"] = mp3_url
            comments_data[i]["isMp3"] = true
          }
          

          let comment = comments_data[i].comment
          if(comment == 'no_comment'){
            comments_data[i]["comment"] = '暂无文字点评'
          }

          let images =[]
          if(uuids){
            let uuidslist =uuids.split(",");
            for(let i in uuidslist){
                let url = ImageUrl + uuidslist[i];
                var json = {
                  src:url
                }
                images.push(json);
            }
            comments_data[i]["images"] = images
          }
      }
      
      console.log(comments_data)
      that.items = comments_data

    },

    goOff() {
      this.$router.go(-1);
    },

    ZoomIn(i){
        this.display='block';
        this.MinDisplay='none';
        this.ShowIndex=i;
    },

    ZoomOut(){
        this.display='none';
        this.MinDisplay='flex';
    },

    select(i){
        this.ShowIndex=i;
    },

    handleCurrentChange (val) {
      this.page = val
      this.getComment(this.page)
    },
    
    deleteRow (id) {
      let that = this;
      let param ={
          studio:this.studio,
          id:id,
          role:this.role,
          openid:this.openid
        }
      let res = HttpPost("/deleteComment",param)
      res.then(res => {
          if(res.data == 1){
            this.$message({
                message: '删除成功',
                type: 'success'
            });
            this.getComment(this.page)
          }else {
            this.$message({
                message: '删除失败',
                type: 'warning'
            });
            this.getComment(this.page)
          }
      })
    }

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
  /* color: #608bc9; */
}

.el-icon-arrow-left{
  margin-left: 5px;
  margin-top: 10px;
  scale: 1.5;
}

.covers{
    width: 60%;
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
}
.cover{
    display: flex;
    justify-content: center;
    width: 33%;
    margin: 10px 0;
}

.foot{
  font-size: small;
  font-weight: bold;
  color: #608bc9;
  display: flex;
  flex-direction: column;
}

.max{
    cursor: zoom-out;
    width: 100%;

}
.small{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.cover-small{
    display: flex;
    justify-content: center;
    width: 10%;
    margin: 10px 0;
    opacity: 0.6;
    cursor: pointer;
}
.cover-small:hover{
    opacity: 1;
}
.active{
    display: flex;
}
.None{
    display: none;
}
.smallActive{
    opacity: 1;
}

</style>
