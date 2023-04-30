

export default function window () {
  window.onload = function(){
    document.addEventListener('touchstart',function(event){
        if(event.touches.length>1){
            event.preventDefault()
        }
    });

    document.addEventListener('gesturestart',function(event){
        if(event.touches.length>1){
            event.preventDefault()
        }
    });

    var lastTouchEnd = 0;
    document.documentElement.addEventListener('touchend', function(event){
        var now =  (new Date()).getTime()
        if(now - lastTouchEnd <= 300){
            event.preventDefault()
        }
        lastTouchEnd = now
    },false)
}
}

