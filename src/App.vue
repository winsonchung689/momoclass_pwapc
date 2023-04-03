<template>
  <div id="app">
    <router-view/>
    <!-- <bottom-navigation></bottom-navigation> -->
  </div>
</template>

<script>
// import {AllShops} from "@/api";

// export default {
//     name: 'App',
//     data() {
//         return {
//             isAllShop: [],//定义空数组
//         }
//     },
//     created() {
//         this.getShops()//调用getShops函数
//     },
//     methods: {
//         async getShops() { //异步  async与await
//             const res = await AllShops()
//             this.isAllShop = res.data//将后端获取的数据赋值给isAllShop空数组
//             console.log(res.data[0].studio)//空数组输出获得的数据
//         }
//     },
// }
</script>

<style>
#App {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: hwb(210 9% 6%);
  margin-top: 60px;
}
body {
  margin: 0;
  padding-top: 60px;
}

</style>
