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

export function downloadAttachment(path, param) {
  var url = baseUrl + path
  axios({
    method: 'POST',
    url: url,
    data: param,
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => {
    console.log(res)
    resolveBlob(res, res.data.type)
  })
}


export const ImageUrl = baseUrl + '/data/disk/uploadimages/'

export const Mp3Url = baseUrl + '/data/disk/uploadMP3/'

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
}


export function sendNotification(subscription,json){
  let param ={
    subscription:subscription,
    publickey: 'BNuTcvDy80K11oNHamaMxjG7mQht2r5wDP2ZdR6kL_rLkaizhUDxXFmjlCMS57XaWYgflJlo-_cDF8wVqWIPd2U',
    privatekey: 'q3-gIs92LkUmtLIKJB3bR3_ATFWTkDXJ4Pt9HGB84S8',
    payload:json
  }
  let res = HttpPost('/sendSubscription', param )
  
  return res
}
