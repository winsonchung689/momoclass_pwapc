<template>
  <div :style="screenStyle">
    <div class='welcome' style="height: 60%;">
      <img src='@/assets/welcome.png' alt=''>
    </div>
   
    <div class="slogan">
      <div style="margin-top: 10px;margin-left: 42%;font-size: x-large;">hello！</div>   
      <div style="margin-left: 42%;">欢迎使用小桃子助手！</div> 
      <div class="button">现在进入</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Welcome',

  data () {
    return {
      openid: '',
      screenWidth: window.outerWidth,
      screenHeight: window.outerHeight
    }
  },

  computed:{

    screenStyle(){
      return{
        width: this.screenWidth + 'px',
        height: this.screenHeight + 'px',
      }
    }
  },

  created () {
    
    this.getCookie()
  },

  methods: {
    getCookie () {
      console.log(this.screenHeight)
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ')
        console.log(arr)
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=')
          if (arr2[0] === 'openid') {
            this.openid = arr2[1]
            if (this.openid !== '') {
              // console.log('cookie_openid:' + this.openid)
              setTimeout(() => {
                this.$router.replace({ path: '/Home', query: { openid: this.openid } })
              }, 3000)
            } else {
              console.log('cookie_openid 为空!')
              setTimeout(() => {
                // this.$router.replace('/Login')
                this.$router.replace({ path: '/Home', query: { openid: this.openid } })
              }, 3000)
            }
          }
        }
      } else {
        console.log('cookie_openid 为空!')
        setTimeout(() => {
          this.$router.replace('/Home')
        }, 3000)
      }
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.welcome {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-top: 10%; */
  flex-direction: column;

}

.welcome img {
  width: 200px;
  height:200px;
}

.slogan{
  flex-direction: column;
  border-top-right-radius: 3rem;
  border-top-left-radius: 3rem;
  height: 40%;
  font-size: xx-large;
  display: flex;
  /* justify-content: center; */
  background-color: #535CBE; 
  color: #ffff;
}

.button{
  margin-top: 50px;
  margin-left: 45%;
  border-radius: 0.5rem;
  justify-content: center;
  display: flex;
  background-color: #ffff;
  color: #535CBE;
  width: 10%;

}

</style>
