<template>
    <div>
      <div style="display: flex;direction: row;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ header }}</div>
      </div>
      

      <div style="justify-content: left;display: flex;margin-top: 5%;margin-bottom: 15px;flex-direction: column;" v-for="item of items">
        <div class="covers" :style="{display:MinDisplay}">
            <div class="cover" v-for="(img,index) in item.images" :key='img'><img :src="img.src" width="90%" class="min" @click="ZoomIn(index)" alt=""></div>
        </div>
        <div>
          <div>学生: {{ student_name }}</div>
          <div>课堂名称: {{ item.class_name }}</div>
          <div>老师点评: {{ item.comment }}</div>
          <div> {{ studio }} {{ item.create_time}}</div>
        </div>
      </div>

    </div>
</template>

<script>
import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import { ImageUrl } from '@/api'

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
    }
  },

  created () {
    this.getGrowthRecord()
  },

  methods: {
    async getGrowthRecord () {
      let that = this;
      let param ={
          studio:that.studio,
          student_name:that.student_name,
          page:1
        }
      const growth = await HttpPost('/getGrowthRecord', param)
      let growth_data = growth.data;
      for( var i in growth_data){
          const uuids = growth_data[i].uuids
          let images =[]
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
      console.log(growth_data)
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

.covers{
    width: 60%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.cover{
    display: flex;
    justify-content: center;
    width: 33%;
    margin: 10px 0;
}

</style>
