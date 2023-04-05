<template>
  <div class="hello">

      <section class="body">
          <section class="wrap">
              <swiper :options="swiperOption" class="swiper-wrap"  ref="mySwiper" v-if="images.length!=0">
                  <swiper-slide v-for="(item,index) in images" :key="index" >
                      <img :src="item" alt="" @click="skip_out_page(item.url)" />
                  </swiper-slide>
              </swiper>
          </section>
      </section>

    <div class="avatar">
      <img :src="avatarurl" alt="" style="width: 50px;height: 50px;border-radius: 50%; position: relative; top: 10px; right: 5px;">
      <h1>HI,{{ nick_name }}</h1>
    </div>
    <div class="welcome">
      欢迎来到《{{ studio }}》
    </div>

    <button @click="$router.push('/next')">工作台</button>
    <button @click="$router.push('/next')">学生专区</button>
    <button @click="$router.push('/next')">个人中心</button>
  </div>
  
</template>

<script>
import { HttpGet } from "@/api";
import Swiper from "swiper";

window.onload = function () {
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            loop: true,
            autoplay: 5000,
            slidesPerView: "auto",
            centeredSlides: true,
            spaceBetween: 10,
        })
    }

export default {
    name: 'App',
    data() {
        return {
            images: [],//定义空数组
            studio:'',
            nick_name:'',
            avatarurl:'',
            swiperOption: {
                    //是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
                    notNextTick: true,
                    //循环,而不是每次都突然回到第一个
                    loop: true,
                    //设定初始化时slide的索引，加载页面时显示的第几个，从0开始
                    initialSlide: 0,
                    //自动播放
                    autoplay: {
                        /*切换轮播图片的时间，即上次切换成功后到再次需要切换的时间*/
                        delay: 1500,
                        stopOnLastSlide: false,
                        /* 触摸滑动后是否继续轮播 false触摸后不再点击继续轮播，true触摸后不再点击不轮播，停在最后一次页面*/
                        disableOnInteraction: false
                    },
                    //滑动速度，时间单位，越小越快，与上面 delay 区别，speed是完成切换所需时间，delay是切换成功后停留多长时间再切换
                    speed: 800,
                    //滑动方向
                    direction: "horizontal",
                    //小手掌抓取滑动
                    grabCursor: true,
                    on: {
                        //滑动之后回调函数
                        slideChangeTransitionStart: function() {
                            /* realIndex为滚动到当前的slide索引值 */
                            that.imgIndex= this.realIndex - 1;
                        },
                    },
                    //分页器设置
                    pagination: {
                        el: ".swiper-pagination",
                        clickable: true,
                        type: "bullets"
                    }
                },

        }
    },
    created() {
        this.getShops()//调用getShops函数
    },
    methods: {
        async getShops() { //异步  async与await
            const users = await HttpGet("/getUser?openid=oRRfU5TCmjXtbw9WsxnekwJAa72M")
            // this.isAllShop = res.data//将后端获取的数据赋值给isAllShop空数组
            this.studio = users.data[0].studio
            this.nick_name = users.data[0].nick_name
            this.avatarurl = users.data[0].avatarurl
            
            const home = await HttpGet("/getHome?studio=" + this.studio)
            let uuids = home.data[0].uuids
            console.log(uuids)

            if(uuids){
              let uuidslist =uuids.split(",");
              // console.log(uuidslist)
              for(let i in uuidslist){
                let url = "https://www.momoclasss.xyz:443/file/uploadimages/" + uuidslist[i];
                // console.log(url)
                this.images.push(url);
              }

              console.log(this.images)
            }
            
        },
        skip_out_page(v) {
                window.location.href = v
            },
    },
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: lighter;
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

.avatar{
  display: flex;
  flex-direction: row;
  height: 70px;
}
.welcome{
  margin-top: 5px;
  font-weight: bolder;
}
.swiper-wrap{
    width: 80%;
    background-color: #fff;
}
.swiper-pagination{
    background: #fff;
}
.swiper-pagination-bullet{
    background: #ccc;
    width: 10px;
    height: 10px;
    opacity: 1;
}
.swiper-pagination-bullet-active{
    background: #00C293;
}

</style>
