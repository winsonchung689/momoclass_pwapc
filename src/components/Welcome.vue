<template>
  <div class="welcome">
    <!-- <meta http-equiv="refresh" content="5; URL=/Login"> -->
    <img src="@/assets/welcome.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'Welcome',

  data () {
    return {
      openid: ''
    }
  },
  
  created() {
        this.getCookie()//调用getShops函数
  },

  methods: {
      getCookie() {
          if (document.cookie.length > 0) {
              var arr = document.cookie.split('; ');
              console.log(arr)
              for (var i = 0; i < arr.length; i++) {
                  var arr2 = arr[i].split('='); 
                  if (arr2[0] == 'openid') {
                      this.openid = arr2[1]; 
                       if(this.openid != ''){
                        console.log("cookie_openid:" + this.openid)
                        this.$router.push({path: '/Home',query:{ openid: this.openid}});
                       }else{
                        console.log("cookie_openid 为空!")
                        this.$router.push('/Login');
                       }

                  } 
              }
          }
      },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.welcome{
  position: fixed;
  height: 100%;
  width: 100%;
  /* background: url("@/assets/welcome.png") no-repeat; */
  background-size: 100%  100%;
  background-color: white;
}

.welcome img{
  position: fixed;
  width: 100%; 
  height: 100%; 
  left: 0;
  top: 0;
}

</style>
