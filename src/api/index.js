import axios from "axios";
import { Toast } from "mint-ui"

const baseUrl = "https://www.momoclasss.xyz:443";


var HttpRequest = {
    getRequest({ url,data={},method = "GET" }){
        return new Promise((resolve, reject) => {
            this._getRequest(url,resolve,reject,data,method);
        });
    },
    _getRequest:function(url,resolve,reject,data={},method="GET"){
        let format = method.toLocaleLowerCase() == 'get'?'params':'data';
        axios({
            url:baseUrl+url,
            method:method,
            [format]:data,
            headers:{
                "content-type":"application/json"
            }
        }).then(res => {
            if (res.code==0){
                resolve(res);
            }else if (res.code==-1){
                resolve(res);
            }
        } ).catch(() => {
            reject();
            Toast({
                message:"发生错误，请检查！",
                position:"middle",
                durantion:2000
            });
        })
    }
};

export { HttpRequest };


let http = {
    
}




export function HttpGet(param) { 
    return axios.get(`${baseUrl}` + param) 
}


export function HttpPost(url,data) { 
    return axios({
        url: `${baseUrl}` + url,
        method: 'POST',
        params: data
      })
}