<template>
    <div>
      <div style="display: flex;direction: row;">
        <i class="el-icon-arrow-left" @click="goOff()"></i>
        <div style="font-size: medium;margin-left: 35%;margin-top: 5px;font-weight: bolder;">{{ header }}</div>
      </div>

      <div style="justify-content: center;display: flex;margin-top: 5%;" v-for="item of items">
          <div class="lesson" @click="goIn(item.studio,item.subject,item.student_name)">
            <img style="width: 50px;height: 50px;border-radius: 15%;margin-left: 20px;margin-top: 20px;" src="@/assets/logo.png" alt="">


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
      items: []
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

      console.log(growth_data)
      that.tableData =[]
      for( var i in growth_data){
          const uuids = growth_data[i].uuids
          const class_name = growth_data[i].class_name
          const studio = growth_data[i].studio
          const create_time = growth_data[i].create_time

          let images =[]
          let uuidslist =uuids.split(",");
          for(let i in uuidslist){
              let url = ImageUrl + uuidslist[i];
              console.log(url)
              var json = {
                src:url
              }
              images.push(json);
            }
            growth_data[i]["images"] = images;


          // var json ={};
          // json.rank = rank
          // json.subject = subject
          // json.student_name = student_name
          // json.mark_leave = mark_leave
          // json.date_time = date_time
          // json.duration = duration
          // json.id = id
          // that.tableData.push(json)
      }

      console.log(growth_data)

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

</style>
