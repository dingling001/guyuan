/**
 * 默认配置
 */
var BaseUrl = 'http://47.93.76.140:20013'
export default {
    // 基础url前缀
    baseURL: BaseUrl,
    // 请求头信息
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept: 'application/json',
    },
    // 设置超时时间
    timeout: 10000,
    // 携带凭证
    // 返回数据类型
    responseType: 'json',
};
