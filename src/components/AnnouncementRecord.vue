<template>

    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style=" width: 50%;font-size: medium;font-weight: bolder;justify-content: center;display: flex;margin-left: 30px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="justify-content: left;display: flex;margin-top: 5%;margin-bottom: 15px;flex-direction: column;">

        <!-- <el-collapse-item :title="item.create_time" name="1">
          <div>{{ item.content }}</div>
        </el-collapse-item> -->

        <el-collapse v-model="activeName" accordion v-for="(item,index_out) in items">
          <el-collapse-item :title="item.create_time" :name='index_out'>
            <div>{{ item.content }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>



    </div>
    
</template>

<script>
import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import { ImageUrl } from '@/api'
import { Mp3Url } from '@/api'

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
          studio:that.studio
        }
      const res = await HttpPost('/getAnnouncement', param)
      let res_data = res.data
      console.log(res_data)
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

</style>
