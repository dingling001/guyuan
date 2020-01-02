import axios from "../api"; // 导入 api
/**
 * 详情
 */
export const GOrderIdFeedback = (gorder_id) =>
    axios(
        "/api/feedback/gorder_id_feedback", {
            p: 't',
            gorder_id,
        },
        "GET",
        true
    );
export const OrderIdFeedback = (order_id) =>
    axios(
        "/api/feedback/order_id_feedback", {
            p: 'wx',
            order_id,
        },
        "GET",
        true
    );
export const FeedbackList = () =>
    axios(
        "/api/feedback/list", {
            p: 'wx',
        },
        "GET",
        true
    );
/*
* order_id     团体票订单id
* gorder_id    团体预约订单id
* taskid       任务id
* guideid      讲解员id
* star_num      星级
* label_ids     标签id，逗号分隔
* remark_text   评价备注
*/
export const FeedbackSubmit = (data) =>
    axios(
         '/api/feedback/submit', {
            p: 't',
            ...data
        },
        'POST',
        true
    );
