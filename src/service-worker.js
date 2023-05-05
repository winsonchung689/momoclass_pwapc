console.log('hello,service worker')

importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.3.0/workbox-sw.js');

if(workbox){
  console.log('worker loaded')
}else{
  console.log('worker unloaded')
}



workbox.skipWaiting()
workbox.clientsClaim()

// 设置缓存名称前缀
workbox.core.setCacheNameDetails({
  prefix: 'momoclass'
})

// 缓存manifest.json
workbox.routing.registerRoute(
  /\/manifest\.json/,
  workbox.strategies.staleWhileRevalidate()
)

//sw-register网络请求优先
workbox.routing.registerRoute(
  /\.js$/,
  workbox.strategies.networkOnly()
)

workbox.routing.registerRoute(
  /\.png$/,
new workbox.strategies.CacheFirst()
)

workbox.routing.registerRoute(
  /\.css$/,   //通过正则匹配需要缓存哪些文件
  new workbox.strategies.StaleWhileRevalidate(),
);

// workbox.precaching.precacheAndRoute(self.__precacheManifest || [])


// self.addEventListener('visibilitychange', function() {
//   if (document.visibilityState === 'visible') {
//       console.log('APP resumed');
//       window.location.reload();
//   }
// });

self.addEventListener("click", () => {
  let promise = Notification.requestPermission();
  // wait for permission
});

self.addEventListener('install', function(e) {
  console.log('[Service Worker] Install');
  // self.registration.showNotification('[Service Worker] Install')
});


self.addEventListener('push', function (event) {
  // 检查服务端是否发来了任何有效载荷数据
   var payload = event.data ? JSON.parse(event.data.text()) : 'no payload';
   console.log(payload)
   var title = payload.title;
   var options  = {
        body:payload.message,
   }
   event.waitUntil(
     // 使用提供的信息来显示 Web 推送通知
     self.registration.showNotification(title,options)
   );
 });


 self.addEventListener('notificationclick', function (event) {
      // console.log(event.notification.data)
      // var title = event.notification.data.title
      event.waitUntil(clients.openWindow('https://www.momoclass.xyz:8080/'))
 })




