<template>
  <div class="hello">
    <div class="avatar">
      <img :src="avatarurl" alt=""
        style="width: 50px;height: 50px;border-radius: 50%; position: relative; top: 10px; right: 5px;">
      <div style="margin-top: 15px;">
        <h1>HI,{{ nick_name }}</h1>
        <h2 @click="$router.push('/Login')">欢迎来到《{{ studio }}》</h2>
      </div>
    </div>

    <div class="banner">
      <div class="banner_wrap">
        <!-- 加上v-if="banner_data.length > 1" 来防止swiper出现无法循环播放的效果 -->
        <swiper :options="swiperOption" v-if="images.length > 1" class="banner-swiper-container swiper-container">
          <swiper-slide class="swiper-wrapper" v-for="(item, index) in images" :key="index">
            <div>
              <div>
                <img :src="item.img" alt="" style="border-radius: 5%; scale: 0.9;">
              </div>
              <div style="display: flex;justify-content: center;">
                <button @click="$router.push('/next')"> {{ item.name }}</button>
              </div>
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>

  </div>
</template>

<script>
import { HttpGet } from '@/api'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'App',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      images: [{ img: '../assets/students.png', name: '学生专区' }, { img: '../assets/workspace.png', name: '工作台' }, { img: '../assets/me.png', name: '个人中心' }],
      studio: '',
      nick_name: '',
      avatarurl: '',
      swiperOption: {
        loop: true,
        speed: 2000,
        observer: true,
        observeParents: true,

        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        }
      },
      openid: this.$route.query.openid
    }
  },
  created () {
    this.getUser()
  },
  methods: {

    async getUser () {
      const users = await HttpGet('/getUser?openid=' + this.openid)
      // this.isAllShop = res.data//将后端获取的数据赋值给isAllShop空数组
      this.studio = users.data[0].studio
      this.nick_name = users.data[0].nick_name
      this.avatarurl = users.data[0].avatarurl

      const home = await HttpGet('getHome?studio=' + this.studio)
      let uuids = home.data[0].uuids
      console.log(uuids)
    }
  }
}
</script>

<style scoped>
h1 {
  font-weight: bolder;
  font-size: medium;
  color: #8F8FBD;
}

h2 {
  font-weight: bolder;
  font-size: medium;
  margin-bottom: 5px;
  color: #8F8FBD;
}

button {
  font-size: 16px;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
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

.header-mid-name {
  flex: 1;
  text-align: center;
  color: white;
  font-size: medium;
  justify-content: center;
}

.avatar {
  display: flex;
  flex-direction: row;
  height: 70px;
  margin-left: 10px;
}

.welcome {
  margin-top: 5px;
  font-weight: bolder;
  font-size: small;
  color: #e7e9def1;
}

.banner {
  width: 100%;
  /* height: 2.9rem; */
}

.banner_bg {
  width: 100%;
}

.banner_wrap {
  padding: 0 0.2rem;
}

.banner .swiper-container {
  width: 100%;
  height: 100%;
}

.banner .swiper-container .swiper-wrapper {
  width: 100%;
  height: 100%;
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

.scroll-box {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  /*height: 100vh;*/
  overflow: hidden;
}
</style>
