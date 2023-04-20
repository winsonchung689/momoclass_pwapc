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
            <div>学生: {{ subject }}_{{ student_name }}</div>
            <div>课堂名称: {{ item.class_name }}</div>
            <div>老师点评: {{ item.comment }}</div>
            <div >
              <audio controls ref="audio" class="aud" :src="item.mp3_url"></audio>
            </div>
            <div style="font-size: x-small;font-weight: bold;color: #a3b2b3;margin-top: 5px;">{{ studio }}  {{ item.create_time}}</div>
            <el-divider></el-divider>
          </div>
        </div>

        <div :style="{display:MinDisplay}" style="display: flex;justify-content: center;position: fixed;bottom: 10px;background-color: #fff;width: 100%;">
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
      header:  '成长记录',
      items: [],
      MinDisplay:'flex',
      ShowIndex:0,
      display: 'none',
      page:1
    }
  },

  created () {
    this.getGrowthRecord(this.page)
  },

  methods: {
    async getGrowthRecord (page) {
      let that = this;
      let param ={
          studio:that.studio,
          student_name:that.student_name,
          page:page
        }
      const growth = await HttpPost('/getGrowthRecord', param)
      let growth_data = growth.data;
      for( var i in growth_data){
          const uuids = growth_data[i].uuids

          const mp3_url_get = growth_data[i].mp3_url
          if(mp3_url_get){
            let mp3_url = Mp3Url + mp3_url_get
            growth_data[i]["mp3_url"] = mp3_url
          }
          
          let comment = growth_data[i].comment
          if(comment == 'no_comment'){
            growth_data[i]["comment"] = '暂无文字点评'
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
            growth_data[i]["images"] = images;
          }
      }
      that.items = growth_data

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
      this.getGrowthRecord(this.page)

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
  margin-bottom: 5px;
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
