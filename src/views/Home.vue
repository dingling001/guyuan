<template>
    <div class="order">
        <div class="o">
            <div class="order_item">
                <label class="label">姓名</label>
                <span>{{orderInfo.go_username}}</span>
            </div>
            <div class="order_item">
                <label class="label">手机号码</label>
                <span>{{orderInfo.contact_phone}}</span>
            </div>
        </div>
        <div class="guide__wrap" v-if="showg&&guideList.length">
            <div class="tit">已完成检票，可对讲解服务进行评价</div>
            <ul class="guide">
                <li class="guide__item" v-for="(guideItem,guideIndex) in guideList" :key="guideIndex">
                    <div class="guide__item--info">
                        <div class="name">
                            <span>{{guideItem.realname}}</span>
                            <van-rate v-if="!!guideItem.feedback_info" :value="guideItem.feedback_info.star_num"
                                      :size="20" color="#EE8E41" void-color="#EDEDED" void-icon="star" readonly/>
                        </div>
                        <div class="num">员工编号：{{guideItem.job_no}}</div>
                    </div>
                    <div class="guide__item--btn" @click="openRecommendModal(guideItem)">{{!!guideItem.feedback_info ?
                        '查看评价' : '评价'}}
                    </div>
                </li>
            </ul>
        </div>
        <van-action-sheet v-model="showRateModal" title="评价服务" position="bottom" :round="false">
            <div class="rate">
                <van-rate v-model="rate" :size="36" :disabled="!!guideItemInfo.feedback_info" color="#EE8E41"
                          void-color="#EDEDED" void-icon="star" @change="rateChange"/>
                <p class="msg">{{rateTxt[+rate-1]}}</p>
                <ul class="tags" v-if="tags.length>0">
                    <li v-for="(a,ai) in tags.filter(o=>o.star_num==rate)" :key="ai"
                        :class="{'active':labels.indexOf(a.fb_id) != -1}"
                        @click="!guideItemInfo.feedback_info && chooseTag(a.fb_id)">{{a.label_text}}
                    </li>
                </ul>
                <div class="message">
                    <van-field v-model="content" rows="2" :disabled="!!guideItemInfo.feedback_info" autosize clearable
                               type="textarea" placeholder="还想说点什么..."/>
                </div>
                <div class="bottom" v-if="!guideItemInfo.feedback_info">
                    <van-button type="danger" size="large" :loading="isLoading" :disabled="isLoading"
                                loading-text="提交中..." @click.stop="recommendGuide">匿名提交
                    </van-button>
                </div>
            </div>
        </van-action-sheet>
        <div class="shownodata" v-if="showg&&guideList.length==0">
            <div class="img"><img src="../assets/img/fail.png" alt=""></div>
            <div class="text">暂未分配讲解员，请稍后进行评价</div>
            <van-button  size="large" @click="ordercomfirm">确认</van-button>
        </div>
    </div>
</template>

<script>
    // @ is an alias to /src
    import {Toast} from 'vant'

    export default {
        name: 'home',
        data() {
            return {
                gorder_id: '',
                orderInfo: {},
                showRateModal: false,
                detail: {}, //订单详情

                // 讲解员评价
                guideList: [], //讲解员列表
                guideItemInfo: '', //点击查看单个讲解员评价信息
                tags: [],
                rateTxt: ['非常不满意', '不满意', '一般', '好', '非常好'],
                rate: 5, //星级
                labels: [], //选中标签
                content: '', //评价备注
                isLoading: false, //提交信息loading
                showg:false
            }
        },
        created() {
            this._FeedbackList();
            this.gorder_id = this.$route.query.gorder_id;
            this.getinfo();
        },
        methods: {
            // 确认
            ordercomfirm() {
                this.$router.replace('/')
            },
            _FeedbackList() {
                this.$api.FeedbackList().then(res => {
                    if (res.status == 1) {
                        this.tags = res.data;
                    }
                })
            },
            getinfo() {
                this.$api.GOrderIdFeedback(this.gorder_id).then(res => {
                    this.showg=true;
                    if (res.status == 1) {
                        this.orderInfo = res.data.order;
                        this.guideList = res.data.task
                    } else {
                        Toast('预约手机号暂无订单信息')
                    }
                })
            },
            /**
             * @弹窗-评价讲解员或查看已评价
             */
            openRecommendModal(guideItem) {
                console.log(guideItem)
                let _this = this;
                let {feedback_info} = guideItem;

                _this.showRateModal = true;
                _this.guideItemInfo = guideItem; //讲解员信息填充

                if (!!feedback_info) {
                    //查看已评价
                    let {star_num, label_ids, remark_text} = feedback_info;
                    _this.rate = star_num;
                    _this.content = remark_text || '您未提交评价内容';
                    // 注意类型转换
                    _this.labels = _this.dataType(label_ids, "string") ? label_ids.split(',').map(o => ~~o) : [];
                } else {
                    // 重置数据
                    _this.rate = 5;
                    _this.content = '';
                    _this.labels = [];
                }
            },
            dataType(tgt, type) {
                const dataType = Object.prototype.toString.call(tgt).replace(/\[object /g, "").replace(/\]/g, "").toLowerCase();
                return type ? dataType === type : dataType;
            },
            /**
             * @评价星级改变时
             */
            rateChange(value) {
                let _this = this;
                _this.labels = [];
            },
            /**
             * @选择标签
             */
            chooseTag(fb_id) {
                let _this = this;
                let pos = _this.labels.indexOf(fb_id)
                pos != -1 ? _this.labels.splice(pos, 1) : _this.labels.push(fb_id);
            },
            /**
             * @提交评价
             */
            recommendGuide() {
                let _this = this;
                let {gorder_id, rate, labels, content, guideItemInfo: {order_id, taskid, guideid}} = _this;
                let label_ids = labels.join(',');
                let subData = {
                    gorder_id, //团体预约订单id
                    taskid, //任务id
                    guideid, //讲解员id
                    order_id, //团体票订单id
                    star_num: rate,
                    label_ids: label_ids,
                    remark_text: content
                };
                if(label_ids==''){
                    Toast({
                        message: '请选择评价标签'
                    });
                    return;
                }
                if ([1, 2].includes(+rate)) {
                    if (content == '') {
                        Toast({
                            message: '请填写评价内容'
                        });
                        return;
                    }
                }
                _this.isLoading = true;
                _this.$api.FeedbackSubmit(subData).then(res => {
                    // console.log(res)
                    _this.isLoading = false;
                    if (res.status == 1) {
                        Toast({
                            type: 'success',
                            message: "感谢您对讲解员的评价!",
                            getContainer: '.team_order_detail',
                            onClose: () => {
                                _this.getinfo(); //重新获取订单信息
                                _this.showRateModal = false;
                            }
                        })
                    } else {
                        Toast(res.msg);
                    }
                }).catch(err => {
                    _this.isLoading = false;
                })
            },
        }
    }
</script>
<style scoped lang="scss">
    .order {
        min-height: 100vh;
        background-color: #F3F5F9;
        overflow-y: scroll;

        .o {
            padding: 0 18px;
            margin: 5px 0;
            background-color: #fff;

            .order_item {
                display: flex;
                align-items: center;
                height: 50px;
                line-height: 50px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                font-size: 14px;

                &:last-child {
                    border: 0;
                }

                .label {
                    width: 60px;
                    flex-shrink: 0;
                    text-align: justify;
                    text-align-last: justify;
                    margin-right: 30px;
                }
            }

            .title {
                height: 40px;
                line-height: 40px;
                font-size: 14px;
            }
        }

        //讲解员评价列表
        .guide__wrap {
            padding: 0 15px;
            font-size: 15px;
            background-color: #ffffff;

            .tit {
                font-weight: 500;
                padding-top: 15px;
                padding-bottom: 10px;
            }

            .guide {
                &__item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 0;

                    & + .guide__item {
                        border-top: 1px solid rgba(181, 181, 181, 0.18);
                    }

                    &--info {
                        .name {
                            display: flex;
                            align-items: center;
                            margin-bottom: 10px;
                            min-height: 20px;

                            span {
                                margin-top: 4px;
                                margin-right: 10px;
                            }

                            /deep/ .van-rate {
                                &__item[aria-checked='true'] {
                                    .van-rate__icon {
                                        color: #EE8E41 !important;
                                    }
                                }
                            }
                        }

                        .num {
                            font-size: 14px;
                            font-weight: 500;
                            color: #A3A3A3;
                        }
                    }

                    &--btn {
                        width: 76px;
                        height: 24px;
                        line-height: 22px;
                        font-size: 14px;
                        text-align: center;
                        border-radius: 12px;
                        border: 1px solid #CCCCCC;
                        background: rgba(190, 143, 62, 0);

                        &:active {
                            opacity: 0.7;
                        }
                    }
                }
            }
        }

        /deep/
        .rate {
            padding: 15px 30px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .van-rate {
                &__item[aria-checked='true'] {
                    .van-rate__icon {
                        color: #EE8E41 !important;
                    }
                }
            }

            .msg {
                margin-top: 15px;
                text-align: center;
                font-size: 14px;
                font-weight: 500;
                color: rgba(53, 53, 53, 1);
            }

            .tags {
                width: 100%;
                min-height: 53px;
                margin-top: 25px;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                &::after {
                    content: '';
                    width: 150px;
                }

                li {
                    position: relative;
                    width: 150px;
                    padding: 5px 0;
                    font-size: 16px;
                    text-align: center;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: rgba(53, 53, 53, 0.6);
                    border-radius: 3px;
                    background-color: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.4);

                    &:nth-of-type(n+3) {
                        margin-top: 10px;
                    }

                    &.active {
                        color: #EE8E41;
                        border-color: #EE8E41;
                        background-color: #F0E5D5;
                    }

                    &.disabled {
                        color: #AFAFAF;
                        cursor: not-allowed;
                        border-color: #E6E6E6;
                        background-color: #E6E6E6;
                    }
                }
            }

            .message {
                width: 100%;
                margin-top: 10px;

                /deep/ .van-cell {
                    padding: 5px 13px !important;
                    border: 1px solid rgba(173, 173, 173, 1);
                    border-radius: 5px;
                }
            }

            .bottom {
                width: 100%;
                margin-top: 20px;
                display: flex;
                justify-content: center;

                /deep/ .van {

                    &-button {
                        width: 248px;
                        height: 50px;
                        line-height: 48px;
                        text-align: center;
                        background: #2BCBD5;
                        border-radius: 24px;
                        font-size: 18px;
                        font-weight: 500;
                        color: #FFFFFF;

                        &--danger {
                            border: 0 !important;
                            background-color: #EE8E41;
                        }

                        &__text {
                            font-size: 18px;
                        }
                    }
                }
            }
        }

        .shownodata {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #fff;
            padding: 161px 0 0 0;
            display: flex;
            align-items: center;
            flex-direction: column;
            .img{
                width: 225px;
                img{
                    width: 100%;
                }
            }
            .text{
                font-size: 17px;
                padding: 50px 0;
                font-weight:500;
            }
            /deep/ .van-button {
                height: 39px;
                line-height: 39px;
                background: #EE8E41;
                border-radius:20px;
                border: 0;
                display: block;
                font-size: 18px;
                color: #fff;
                width: 261px;
                /*position: fixed;*/
                /*bottom: 30px;*/
            }
        }

    }

</style>
