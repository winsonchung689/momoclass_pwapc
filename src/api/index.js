import axios from 'axios'

const baseUrl = 'https://www.momoclasss.xyz:443'

export function HttpGet (param) {
  return axios.get(`${baseUrl}` + param)
}

export function HttpPost (url, data) {
  return axios({
    url: `${baseUrl}` + url,
    method: 'POST',
    params: data
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
