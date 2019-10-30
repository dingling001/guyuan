import axios from "../api"; // 导入 api
/**
 * 列表
 */
export const ExhibitList = (language=1,skip,take) =>
    axios(
        BaseUrl + "/api/exhibit_list", {
            p: 'wx',
            language,
            skip,
            take
        },
        "GET",
        true
    );
export const ExhibitInfo = (language=1,exhibit_id,api_token) =>
    axios(
        BaseUrl + "/api/exhibit_info", {
            p: 'wx',
            language,
            exhibit_id,
            api_token
        },
        "GET",
        true
    );