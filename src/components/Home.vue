<template>
  <div >
    <div class="avatar">
      <div style="margin-top: auto;">
        <h1>HI,{{ nick_name }} ({{ mode }})</h1>
      </div>
      <img :src="avatarurl" alt="" style="width: 30px;height: 30px;border-radius: 50%; position: relative;margin-left: 10px;margin-top: 5px;">
    </div>

    <h2 @click="$router.push('/Login')">{{ hello }}</h2>

    <div style="display: flex;justify-content: center;">
      <div class="today">
        <h3>{{ today }}  {{ today_season }}</h3>
        <img :src="today_img" alt="" style="border-radius: 20%;width: 55px;height: 70px;background-color:  #b7f4d9;">
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
                <button @click="click"> {{ item.name }}</button>
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
  name: 'Home',
  components: {
    swiper,
    swiperSlide
  },
  data () {
    return {
      images: [
        { img: '../assets/students.png', name: '学生专区' ,url:'/students'}, 
        { img: '../assets/workspace.png', name: '工作台' ,url:'/next'}, 
        { img: '../assets/me.png', name: '个人中心' ,url:'/next'}
      ],
      studio: '',
      nick_name: '你好',
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
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      seasons:[
        { img: '../assets/spring.png', name: '春' }, 
        { img: '../assets/summer.png', name: '夏' }, 
        { img: '../assets/autumn.png', name: '秋' },
        { img: '../assets/winter.png', name: '冬' }
      ],
      today:'',
      today_img:'',
      today_season:'',
      mode: '游客模式',
      hello:'去登陆 👉'
    }
  },
  created () {
    this.getUser()
  },
  methods: {

    async getUser () {
      let that = this

      const date = new Date
      const year = date.getFullYear()
      const month = date.getMonth()+1
      const day = date.getDate()
      that.today = year+'年'+month+'月'+day+'日'

      let num = parseInt(month/4)
      console.log(that.today,num)
      that.today_img = that.seasons[num].img
      that.today_season = that.seasons[num].name

      const users = await HttpGet('/getUser?openid=' + this.openid)
      that.studio = users.data[0].studio
      if(that.studio.length>0){
        that.hello = '欢迎来到《' + that.studio + "》！"
      }else {
        that.hello = '去登陆 👉'
      }

      that.nick_name = users.data[0].nick_name
      that.avatarurl = users.data[0].avatarurl
      that.role = users.data[0].role
      if('boss' == that.role){
        that.mode = '老师模式'
      }else if('client' == that.role){
        that.mode = '家长模式'
      }else if('visit' == that.role){
        that.mode = '游客模式'
      }else {
        that.mode = '未登录'
      }
    },

    click () {
      this.$router.push({ path: '/Students', query: { openid: this.openid,role:this.role,studio:this.studio } })
    }
  }
}
</script>

<style scoped>
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
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-left: 5%;
  
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
