import axios from 'axios'

const baseUrl = 'https://www.momoclasss.xyz:443'

export function HttpGet (param) {
  return axios.get(`${baseUrl}` + param)
}

export function HttpPost (url, params ) {
  return axios({
    url: `${baseUrl}` + url,
    method: 'POST',
    params: params
  })
}

export function HttpPostData (url, data ) {
  return axios({
    url: `${baseUrl}` + url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json'
    },
  })
}

export function UploadFile (url, formData) {
  return axios({
    url: `${baseUrl}` + url,
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}


export const ImageUrl = baseUrl + '/file/uploadimages/'

export const Mp3Url = baseUrl + '/file/uploadMP3/'

export function uploadImgToBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () { // 图片转base64完成后返回reader对象
      resolve(reader)
    }
    reader.onerror = reject
  })
}

export function audioPlay() {
   new Audio("../assets/notification.wav").play(); 
  // let music = new Audio("../assets/notification.mp3"); 
  // music = require("../assets/notification.mp3");
  // this.$refs.audio.src = music;
  // this.$refs.audio.play();
}
