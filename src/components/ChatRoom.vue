<template>
  <div>
    <div style="background-color: #fff;;position: fixed; top: 0;display: flex;flex-direction: row; width: 500px;">
        <div>
          <i class="el-icon-arrow-left" @click="goOff()"></i>
        </div>
        <div style="font-size: medium;font-weight: bold;justify-content: left;margin-left: 10px;margin-top: 5px;">{{ header }}</div>
    </div>
    <div class="chatTitle">实时聊天，不留记录（在线:{{ onlinecount }}）</div>

    <!-- <WebSocket ref="WebSocket"></WebSocket> -->
    <div ref="scrolldIV" class="chatAppBody">
        <div v-for="item in message_list">
            <div v-if="item.direction === 1" class="chatRow">
              <el-avatar v-if="item.openid != 'o25ly6whIE5oBYdDjc2M4afnxQmU'" class="chatAvatar" :size="30" src="../assets/chat.png"></el-avatar>
              <el-avatar v-if="item.openid==='o25ly6whIE5oBYdDjc2M4afnxQmU'" class="chatAvatar" :size="30" src="../assets/logo.png"></el-avatar>
              <div class="chatMsgContent">
                  <div v-if="item.openid==='o25ly6whIE5oBYdDjc2M4afnxQmU'" class="chatUsername">小桃子</div>
                  <div v-if="item.openid != 'o25ly6whIE5oBYdDjc2M4afnxQmU'" class="chatUsername">匿名</div>
                  <div class="chatContent">{{ item.msg }}</div>
              </div>
            </div>
            <div v-if="item.direction === 2" class="chatRow chatRowMe">
                <div class="chatContent">{{ item.msg }}</div>
            </div>
        </div>
    </div>

    <div style="position: fixed;width: 100%;margin-top: 20px;">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="textarea">
      </el-input>
      <div style="display: flex;justify-content: right;">
        <el-button @click="sendMessage" type="primary">发送</el-button>
      </div>
     
    </div>
    
  </div>

</template>

<script>

import { HttpGet } from '@/api'
import { HttpPost } from '@/api'
import ReconnectingWebSocket from 'reconnecting-websocket'

export default {
    name: "ChatRoom",
    data() {
      return {
        header: "聊天室",
        subject: this.$route.query.subject,
        studio: this.$route.query.studio,
        role: this.$route.query.role,
        openid: this.$route.query.openid,
        textarea: "",
        message_list: [],
        message :'',
        wsIsRun:false,
        webSocket:null,
        ws:'',
        wsTimer:null,
        isAudio:false,
        lockReconnect:false,
        timeoustObj:null,
        timeout:55*1000,
        serverTimeoutObj:null,
        timeoutnum:null,
        onlinecount:0
    };
  },

  async mounted(){
    this.wsIsRun = true
    this.wsInit()
  },

  created() {
    
  },

  watch:{
    message_list: function(){
      let div = this.$refs.scrolldIV
      setTimeout(()=> {
        div.scrollTop = div.scrollHeight;
        // console.log(div.scrollTop)
      })
    },
  },

  methods: {

    wsInit() {
      const wsuri = 'wss://www.momoclasss.xyz:443/websocket/' + this.openid
      this.ws = wsuri
      if(!this.wsIsRun) return
      this.wsDestroy()
      this.webSocket = new ReconnectingWebSocket(this.ws)
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

  reconnect() {
      console.log('reconnecting...')
      var that = this;
      if(that.lockReconnect) {
        return;
      }
      that.lockReconnect = true;
      that.timeoutnum && clearTimeout(that.timeoutnum);
      that.timeoutnum = setTimeout(function () {
        that.wsInit();
        that.lockReconnect = false;
      },5000);
  },

  reset(){
    let that = this
    clearTimeout(that.timeoustObj)
    clearTimeout(that.serverTimeoutObj)
    that.start()
  },

  wsOpenHandler(event){
      console.log('ws builded')
        this.start()
  },

  start(){
    console.log('heartbeat is starting...')
    var self = this
    self.timeoustObj && clearTimeout(self.timeoustObj)
    self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
    self.timeoustObj = setTimeout(function(){
      if(self.ws.readyState == 1){
        self.ws.send("heartCheck")
      }else{
        self.reconnect()
      }

      self.serverTimeoutObj = setTimeout(function() {
        self.ws.close()
      },self.timeout)
    },self.timeout)

  },

  wsMessageHandler(e){
      let that = this
      let data = e.data
      console.log(data)
      let str = data.split(':')[0]
      let count = data.split(':')[1]
      if(count){
        that.onlinecount = count
      }
      if(str != 'online'){
        let openid = data.split('_')[0]
        let msg = data.split('_')[1]
        if(msg){
          let json = {}
          json.msg = msg
          json.direction = 1
          json.openid = openid
          console.log(json)
          that.message_list.push(json)
          console.log(that.message_list)

          setTimeout(function () {
            that.reset()
          },2000)
          
        }
      }
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

  wsErrorHandler(event){
      console.log(event,'error')
      this.reconnect();
  },
  
  wsCloseHandler(event){
      console.log('closed')
      this.reconnect();
  },

  goOff() {
      this.$router.go(-1);
      this.message_list = []
  },
  
  async sendMessage(){
    let that = this
    let textarea = that.textarea
    let openid = that.openid
    let message = openid + '_' + textarea

    let json = {}
    json.msg = textarea
    json.direction = 2
    json.openid = openid
    that.message_list.push(json)

    let res = await HttpGet('/websocket/sendNotification?message='+ message + '&openid=' + openid)
    console.log(res.data)
    if(res.data == 200){
      that.textarea =  ''
    }

  },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chatAppBody{
    display: flex;
    flex-direction: column;
    height: 70vh;
    background-color: #f1f5f8;
    margin-top: 2%;
    overflow: scroll;
}
.chatTitle{
    background: #fff;
    font-size: small;
    color: rgb(151, 160, 163);
    font-weight: bolder;
    margin-top: 3%;
}
.chatBox{
    flex: 1;
    padding: 0 5px;
    overflow: auto;
}
.chatBottom{
    background: #fff;
}
.chatRow{
    display: flex;
    align-items: flex-end;
    margin: 5px 0px;
}
.chatAvatar{
    margin-right: 5px;
    flex-shrink: 0;
}
.chatUsername {
    font-size: 12px;
    white-space: nowrap;
    color: #999;
    margin-bottom: 2px;
}
.chatContent{
    border-radius: 10px 10px 10px 0px;
    padding: 10px;
    background-color: rgb(255,255,255);
    box-shadow: 0 5px 30px rgb(50 50 93 / 8%), 0 1px 3px rgb(0 0 0 / 5%);
    font-size: 14px;
    word-break: break-all;
    line-height: 21px;
}
.chatRowMe{
    justify-content: flex-end;
}
.chatRowMe .chatContent{
    border-radius: 10px 10px 0px 10px;
}

</style>
