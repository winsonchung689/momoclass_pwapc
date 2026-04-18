<template>
    <div>
      <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
      </div>


      <div style="background-color:blue;margin-top: 10rpx;">
          <iframe src="http://119.29.168.112:8100/#/de-link/5qhn0x7d" style="z-index: 1000;height:560px;width:100%" 
          sandbox="allow-scripts allow-top-navigation allow-same-origin allow-popups"  
           frameborder="0"></iframe>
      </div>
      
    </div>
</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import * as echarts from "echarts";

export default {
  name: 'AccountBook',
  data () {
    return {
      openid: this.$route.query.openid,
      role: this.$route.query.role,
      studio: this.$route.query.studio,
      header:'整体看板',
    }
  },

  created () {
  },

   mounted() {
  },

  watch:{
  },

  methods: {

    goOff() {
      this.$router.go(-1);
    },

  }

}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>
