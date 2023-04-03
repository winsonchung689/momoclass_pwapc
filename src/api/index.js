import axios from "axios";
//引入axios//定义baseUrl  接口网址
const baseUrl = "https://www.momoclasss.xyz:443/getUser?openid=oRRfU5TCmjXtbw9WsxnekwJAa72M";

//暴漏函数AllShops  请求类型为get  无请求参数
// 接口网址/biz/queryAllCommodity//``连接字符串
export function AllShops() { return axios.get(`${baseUrl}`) }