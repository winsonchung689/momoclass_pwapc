<template>

    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="justify-content: left;display: flex;margin-top: 3%;margin-bottom: 15px;flex-direction: column;">
        <el-collapse v-model="activeName" accordion v-for="(item,index_out) in items">
          <el-collapse-item :title="item.title" :name='index_out'>
            <div style="font-size: small;font-weight: bolder;color: rgb(21, 48, 116);">{{ item.content }}</div>
            <div style="font-size:small;color: rgb(124, 119, 125);margin-left: 90%;">{{ item.create_time }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>



    </div>
    
</template>

<script>
import { HttpPost } from '@/api'

export default {
  name: 'AnnouncementRecord',
  data () {
    return {
      subject: this.$route.query.subject,
      studio: this.$route.query.studio,
      student_name: this.$route.query.student_name,
      role: this.$route.query.role,
      openid: this.$route.query.openid,
      header:  '通知',
      items: [],
      MinDisplay:'flex',
      ShowIndex:0,
      display: 'none',
      page:1,
      activeName: 0
    }
  },

  created () {
    this.getAnnouncementRecord()
  },

  methods: {
    async getAnnouncementRecord () {
      let that = this;
      let param ={
          studio:that.studio,
          openid:that.openid
        }
      const res = await HttpPost('/getAnnouncement', param)
      let res_data = res.data
      that.items = res_data
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

.custom-collapse .custom-collapse-item{
  background-color: #b43434;
}

</style>
