/**
 * 默认配置
 */
var BaseUrl = 'http://192.168.7.57:20006';

export default {
    // 基础url前缀
    baseURL: STATIC_GUIDE_URL,
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
