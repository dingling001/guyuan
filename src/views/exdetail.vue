<template>
    <div class="dbox" v-wechat-title="einfo.exhibit_name">
        <swiper :options="swiperOption" ref="mySwiper" class="imgs" v-if="einfo.exhibit_imgs.length">
            <!-- 这部分放你要渲染的那些内容 -->
            <swiper-slide v-for="(item,index) in einfo.exhibit_imgs" :key="index">
                <img :src="item" alt="">
            </swiper-slide>
            <!-- 这是轮播的小圆点 -->
            <div class="swiper-pagination" slot="pagination" v-show="einfo.exhibit_imgs.length>1"></div>
        </swiper>
        <div class="info">
            <div class="infoleft">
                <div class="infoname">{{einfo.exhibit_name}}</div>
                <div class="infotype">类型：<span v-for="(i,index) in einfo.cate_str" :key="index">{{i.name}}</span></div>
            </div>
            <div>
                <div class="infolike">
                    <div class="iconfont iconliulanliang"></div>
                    <div>{{einfo.look_num||0}}</div>
                </div>
                <div class="infolike" @click="like_fn">
                    <div :class="['iconfont', einfo.is_like==1?'iconxihuan':'iconxihuan1']"></div>
                    <div :class="{activetext:einfo.is_like==1}">{{einfo.like_num||0}}</div>
                </div>
            </div>
        </div>
        <div class="hr"></div>
        <div class="title"><span class="titles">展品介绍</span></div>
        <div class="ccontent" v-html="einfo.content"></div>
        <div class="hr"></div>
        <div class="title"><span class="titles">相关展品</span><span class="more" @click="gomore">更多 <span
                class="iconfont iconjinru"></span></span>
        </div>
        <div class="othermore">
            <div class="otheritem" v-for="item in tj_list " :key="item.exhibit_id" @click="changeInfo(item.exhibit_id)">
                <img :src="item.exhibit_list_img" alt="">
            </div>
        </div>
    </div>
</template>

<script>
    import {swiper, swiperSlide} from 'vue-awesome-swiper'

    require('swiper/dist/css/swiper.css')
    export default {
        components: {
            swiper,
            swiperSlide
        },
        name: "exdetail",
        data() {
            return {
                swiperOption: {
                    //是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
                    notNextTick: true,
                    paginationClickable: true,
                    // loop: true,
                    observe: true,
                    observeParents: true,
                    pagination: {el: ".swiper-pagination"}
                },
                exhibit_id: 1,
                einfo: {
                    exhibit_imgs: []
                },
                tj_list: [],
                skip: 0,
                take: 4,
                like_status: true
            }
        },
        created() {
            this.exhibit_id = this.$route.query.exhibit_id || 14;
            this._ExhibitInfo();
            this._ExhibitCateTj();
        },
        methods: {
            // 展品详情
            _ExhibitInfo() {
                this.$api.ExhibitInfo(1, this.exhibit_id).then(res => {
                    if (res.status == 1) {
                        this.einfo = res.data;
                        this.see_fn();
                    }
                })
            },
            // 获取相关展品
            _ExhibitCateTj() {
                this.$api.ExhibitCateTj(1, this.exhibit_id, this.skip, this.take, 0).then(res => {
                    if (res.status == 1) {
                        this.tj_list = res.data;
                    }
                })
            },
            // 更多
            gomore() {
                this.$router.push({path: '/home', query: {exhibit_id: this.exhibit_id}})
            },
            // 相关展品详情
            changeInfo(id) {
                this.$toast({
                    type: 'loading',
                    message: '加载中…'
                })
                this.exhibit_id = id;
                this.like_status = true;
                this._ExhibitInfo();
                this._ExhibitCateTj();
                window.scrollTo(0, 0)
            },
            // 点赞
            like_fn() {
                if (this.einfo.is_like == 0 && this.like_status) {
                    this.einfo.is_like = 1;
                    this.einfo.like_num += 1;
                    this.$api.DoLike(this.exhibit_id, 2).then(res => {
                        this.like_status = false
                    })
                }
            },
            // 浏览量
            see_fn() {
                if (this.einfo.is_like == 0) {
                }
                this.$api.DoLike(this.exhibit_id, 1).then(res => {
                    if (res.status == 1) {
                    }
                })
            },
        },
        //定义这个sweiper对象
        computed: {
            swiper() {
                return this.$refs.mySwiper.swiper;
            }
        },
    }
</script>

<style scoped lang="scss">
    .dbox {
        /deep/ .imgs {
            margin: 8px 15px;

            .swiper-slide {
                height: 345px;
                overflow: hidden;

                img {
                    width: 100%;
                }
            }

            .swiper-pagination-bullet {
                background-color: #fff;
                transition: ease-in-out .3s;
                opacity: 1;
                width: 6px;
                /*no*/
                height: 6px;
                /*no*/
                &.swiper-pagination-bullet-active {
                    width: 18px;
                    /*no*/
                    height: 6px;
                    /*no*/
                    background: rgba(255, 255, 255, 1);
                    border-radius: 3px;
                    /*no*/
                    opacity: 1;
                }
            }
        }

        .info {
            padding: 15px 15px 15px 0;
            margin: 0 15px;
            border-bottom: 1px solid #EEEEEE;
            /*no*/
            display: flex;
            /*align-items: center;*/
            justify-content: space-between;

            .infoleft {
                max-width: 240px;
                flex-shrink: 0;
                margin-right: 10px;

                .infoname {
                    font-size: 18px;
                    padding-bottom: 12px;
                }

                .infotype {
                    color: #757575;
                    font-size: 14px;

                    span {
                        margin-right: 10px;
                        line-height: 20px;
                    }
                }

            }

            .infolike {
                text-align: center;
                display: inline-block;

                &:last-child {
                    margin-left: 30px;
                }

                .iconfont {
                    font-size: 22px;
                    margin-bottom: 5px;
                    transition: ease-in-out .1s;
                    width: 22px;
                    height: 22px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &.iconxihuan {
                        color: #FF7E00;
                    }

                    &.iconliulanliang {
                        font-size: 17px;
                    }
                }

                .activetext {
                    color: #FF7E00;
                }
            }
        }

        .hr {
            background-color: #D2D2D2;
            height: 10px;
            opacity: .4;
        }

        .title {
            margin: 0 15px;
            border-bottom: 1px solid #EEEEEF;
            /*no*/
            display: flex;
            align-items: center;
            justify-content: space-between;

            span {
                display: inline-block;
                font-size: 16px;

                &.titles {
                    border-bottom: 2px solid #E6B204;
                    /*no*/
                    padding: 15px 0 8px 0;
                }

                &.more {
                    color: #646464;
                    font-size: 13px;
                }
            }
        }

        .ccontent {
            padding: 15px;
            line-height: 24px;
            color: #323232;
            font-size: 15px;
            text-align: justify;
        }

        .othermore {
            display: flex;
            align-items: center;
            padding: 15px;

            .otheritem {
                width: 77px;
                height: 77px;
                margin-right: 13px;
                border-radius: 50%;
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;

                img {
                    width: 100%;
                }
            }
        }
    }
</style>