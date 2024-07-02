<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>

      <div style="margin-top: 3%;" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)">
        <div class="banner">
          <swiper :options="swiperOption" v-if="images.length > 1">
            <swiper-slide class="swiper-wrapper" v-for="(item, index) in images" :key="index">
              <div  style="display: flex;justify-content: left; flex-direction: column;">
                <div style="width: 100%;">
                  <el-image  :src="item.img" :preview-src-list=[item.img] alt="" style="width: 90%;border-radius: 1rem; scale: 1;"></el-image>
                </div>
              </div>

            </swiper-slide>
          </swiper>
        </div>

      </div>
    </div>
</template>

<script>

import { HttpPost } from '@/api'
import { ImageUrl } from '@/api'

export default {
  name: 'ClassSystem',

  data () {
    return {
      subject:this.$route.query.subject,
      studio:this.$route.query.studio,
      type:this.$route.query.type,
      role:this.$route.query.role,
      openid:this.$route.query.openid,
      comment_style:this.$route.query.comment_style,
      send_time:this.$route.query.send_time,
      header:'课程体系',
      images:[],
      swiperOption: {
        loop: true,
        speed: 800,
        observer: true,
        observeParents: true,
        slidesPerView:3,
        loopedSlides:5,
        autoplay: {
          delay: 10000,
          disableOnInteraction: false,
          reverseDirection:false
        }
      },
    }
  },

  created () {
    this.getUser()
  },

  mounted() {
  },
  methods: {
    async getUser () {
      let that = this
      let param ={
          studio:that.studio,
          class_target:that.type,
          page:1,
          openid:that.openid,
          header:that.type
      }
      console.log(param)
      const res = await HttpPost('/getClassSys', param)
      let res_data = res.data;
      // console.log(res_data)
      if(res_data){
        let uuids = res_data[0].uuids
        let uuidslist =uuids.split(",");
        that.images = []
        for(let i in uuidslist){
            let url = ImageUrl+uuidslist[i];
            let json = {}
            json.img = url
            that.images.push(json);
        }
      }
    },

    touchStart(e) {
      this.diff = 0
      this.startY = e.targetTouches[0].pageY
      this.startScroll = this.$el.scrollTop || 0
    },

    touchMove(e) {
      let diff = e.targetTouches[0].pageY - this.startY - this.startScroll
      // console.log(diff)
      this.diff = diff
    },

    touchEnd(e) {
      if(this.diff >= 200){
        this.isBoss = false
        this.isClient = false
        this.getUser()
        this.$message({
        message: '刷新成功',
        type: 'success'
      });
      }
    },

    goOff() {
      this.$router.go(-1);
    },

  }
}
</script>

<style scoped>
.main_buttons{
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
   width: 95%;
   margin-top: 20px;
   margin-bottom: 20px;
}

.items{
  width: 100px;
  height: 100px;
  /* margin-right: 6%; */
  background-color:#ffffff89;
  border-radius: 1rem;
  justify-content: center;
  display: flex;
  flex-direction: column;
}

.icon{
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
}

.notice{
  width: 30px;
  height: 30px;
  border-radius: 0.5rem;
  margin-top: 10px;
}


.itemtext {
  font-size:small;
  display: flex;
  justify-content: center;
  color:#767e69;
  font-weight: bolder;
  margin-top: 5px;
}

h1 {
  font-weight: bold;
  font-size: medium;
  color: #a1bfbf91;
}

h2 {
  font-weight: bolder;
  font-size: large;
  color: #434a3d;
  margin-left: 5%;
  height: auto;
}

.today {
  width: 60%;
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  background-color:  #b7f4d9;

}

h3 {
  color: #ffffff;
  /* background-color:  #b7f4d9; */
  justify-content: center;
  margin-left: 20px;
}


header {
  padding: 0 20px;
  width: 100%;
  height: 40px;
  position: fixed;
  top: 0;
  left: 0;
  background: #598cda;
  z-index: 99;
}

.avatar {
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 5%;
  
}

.banner {
  width: 100%;
  /* height: 2.9rem; */
}

.banner_wrap {
  padding: 0 0rem;
}

.banner .swiper-container {
  width: 100%;
  height: 100%;
}

.banner .swiper-container .swiper-wrapper {
  width: 100%;
  height: 100%;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-prev {
    scale: 0.9 !important;
}

.banner .swiper-container  .swiper-wrapper .swiper-slide-next {
    scale: 0.9 !important;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-prev img {
    scale: 0.9 !important;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-next img {
   scale: 0.9 !important;
}

.banner .swiper-container .swiper-wrapper .swiper-slide-active {
   width: 90%;
   scale: 0.9;
}




.banner .swiper-container .swiper-wrapper .swiper-slide {
  height: 100%;
}

.banner .swiper-container .swiper-wrapper .swiper-slide img {
  width: 100%;
  height: 100%;
  border-radius: 0.15rem;
}

.banner .swiper-container .banner-swiper-pagination {
  bottom: 0;
  height: 0.3rem;
}

.banner .swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet {
  width: 0.24rem;
  height: 0.04rem;
  opacity: 1;
  background: #000;
  border-radius: 0;
}

.banner .swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet.swiper-pagination-bullet-active {
  background: #ffffff;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.box-card {
  width: 95%;
  margin-left: 2.5%;
}

text{
  font-weight: bolder;color: #767e69;font-size: medium;
}

</style>
