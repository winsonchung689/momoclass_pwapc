<template>
  <div>
    <audio src='../assets/notification.mp3' ref="audio" class="aud">
    </audio>
  </div>
</template>

<script>
export default {
  name: 'Websocket',

  data () {
    return {
        wsIsRun:false,
        webSocket:null,
        ws:'',
        wsTimer:null,
        openid:'',
        isAudio:false,
        mp3url:''
    }
  },

  async mounted(){
    this.wsIsRun = true
    this.wsInit()
  },

  created () {

  },

  sockets:{
  },

  methods: {
    getCookie () {
      if (document.cookie.length > 0) {
        var arr = document.cookie.split('; ')
        // console.log(arr)
        for (var i = 0; i < arr.length; i++) {
          var arr2 = arr[i].split('=')
          if (arr2[0] === 'openid') {
            this.openid = arr2[1]
          }
        }
      } else {
        console.log('cookie_openid 为空!')
        setTimeout(() => {
          this.$router.replace('/Login')
        }, 3000)
      }
    },

    sendDataToServer(){
        if(this.webSocket.readyState === 1){
            this.webSocket.send('来自前端的数据')
            console.log('客户端已连接')
        }else{
            throw Error('未连接')
        }
    },

    wsInit() {
        this.getCookie()
        const wsuri = 'wss://www.momoclasss.xyz:443/websocket/' + this.openid
        this.ws = wsuri
        if(!this.wsIsRun) return
        this.wsDestroy()
        this.webSocket = new WebSocket(this.ws)
        this.webSocket.addEventListener('open',this.wsOpenHandler)
        this.webSocket.addEventListener('message',this.wsMessageHandler)
        this.webSocket.addEventListener('error',this.wsErrorHandler)
        this.webSocket.addEventListener('close',this.wsCloseHandler)

        clearInterval(this.wsTimer)
        this.wsTimer = setInterval(()=>{
            if(this.webSocket.readyState === 1){
                clearInterval(this.wsTimer)
            }else{
                console.log('ws buiding up')
            }
        },3000)
    },

    wsOpenHandler(event){
        console.log('ws builded')
    },

    wsMessageHandler(e){
        console.log('收到信息')
        // console.log(e)
        let data = e.data
        console.log(data)
        if(data != '成功'){
            this.$notify({
                title: '通知',
                message: data,
                duration: 0
            });
        this.audio();
        }
    },

    audio(){

      new Audio("../assets/notification.wav").play(); 
      // let music = new Audio("../assets/notification.mp3"); 
      // music = require("../assets/notification.mp3");
      // this.$refs.audio.src = music;
      // this.$refs.audio.play();
    },

    wsErrorHandler(event){
        console.log(event,'error')
    },
    
    wsCloseHandler(event){
        console.log('closed')
    },

    wsDestroy(){
        if(this.webSocket !== null){
            this.webSocket.removeEventListener('open',this.wsOpenHandler)
            this.webSocket.removeEventListener('message',this.wsMessageHandler)
            this.webSocket.removeEventListener('error',this.wsErrorHandler)
            this.webSocket.removeEventListener('close',this.wsCloseHandler)
            this.webSocket.close()
            this.webSocket = null
            clearInterval(this.wsTimer)
        }
    },

  }
}

</script>

<style >

</style>
