<template>
    <el-button @click="sendDataToServer">click</el-button>

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
    }
  
  },

  async mounted(){
    this.wsIsRun = true
    this.wsInit()
  },

  created () {
  },

  methods: {
    sendDataToServer(){
        if(this.webSocket.readyState === 1){
            this.webSocket.send('来自前端的数据')
        }else{
            throw Error('未连接')
        }
    },

    wsInit() {
        const wsuri = 'wss://www.momoclasss.xyz:443/websocket/baoba'
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
        console.log(e)
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
