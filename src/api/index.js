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


export const ImageUrl = baseUrl + '/file/uploadimages/'
