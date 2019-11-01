import axios from "../api"; // 导入 api
/**
 * 列表
 */
export const ExhibitList = (language = 1, skip, take) =>
    axios(
        "/api/exhibit_list", {
            p: 'wx',
            language,
            skip,
            take
        },
        "GET",
        true
    );
export const ExhibitInfo = (language = 1, exhibit_id, api_token) =>
    axios(
        "/api/exhibit_info", {
            p: 'wx',
            language,
            exhibit_id,
            api_token
        },
        "GET",
        true
    );
export const ExhibitCateTj = (language = 1, exhibit_id, skip, take, is_getcounts) =>
    axios(
        "/api/exhibit_cate_tj", {
            p: 'wx',
            language,
            exhibit_id,
            skip,
            take,
            is_getcounts
        },
        "GET",
        true
    );
// 点赞
export const DoLike = (exhibit_id, type) =>
    axios(
        "/api/zb_exhibit_visit_like", {
            p: 'wx',
            exhibit_id,
            type,
        },
        "GET",
        true
    );