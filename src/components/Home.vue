<template>
  <div class="hello">
    <h1>HI,{{ nick_name }}</h1>
    <h1>欢迎来到《{{ studio }}》</h1>
    <button @click="$router.push('/next')">工作台</button>
    <button @click="$router.push('/next')">学生专区</button>
    <button @click="$router.push('/next')">个人中心</button>
  </div>
</template>

<script>
import {AllShops} from "@/api";

export default {
    name: 'App',
    data() {
        return {
            isAllShop: [],//定义空数组
            studio:'',
            nick_name:''
        }
    },
    created() {
        this.getShops()//调用getShops函数
    },
    methods: {
        async getShops() { //异步  async与await
            const res = await AllShops()
            this.isAllShop = res.data//将后端获取的数据赋值给isAllShop空数组
            this.studio = res.data[0].studio
            this.nick_name = res.data[0].nick_name
            console.log(res.data)
            console.log( this.studio,this.nick_name)//空数组输出获得的数据
        }
    },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
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
</style>
