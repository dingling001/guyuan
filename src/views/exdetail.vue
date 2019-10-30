<template>
    <div class="dbox" v-wechat-title="einfo.exhibit_name">
        <swiper :options="swiperOption" ref="mySwiper" class="imgs">
            <!-- 这部分放你要渲染的那些内容 -->
            <swiper-slide v-for="(item,index) in einfo.exhibit_imgs" :key="index">
                <img :src="item">
            </swiper-slide>
            <!-- 这是轮播的小圆点 -->
            <div class="swiper-pagination" slot="pagination" v-show="einfo.exhibit_imgs.length>1"></div>
        </swiper>
        <div class="info">
            <div>
                <div class="infoname">{{einfo.exhibit_name}}</div>
                <div class="infotype">类型：<span v-for="(i,index) in einfo.cate_str" :key="index">{{i.name}}</span></div>
            </div>
            <div class="infolike">
                <div :class="['iconfont', einfo.is_like==1?'iconxihuan':'iconxihuan1']"></div>
                <div>{{einfo.like_num}}</div>
            </div>
        </div>
        <div class="hr"></div>
        <div class="title"><span>展品介绍</span></div>
        <div class="ccontent" v-html="einfo.content"></div>
        <div class="hr"></div>
        <div class="title"><span class="titles">相关展品</span><span class="more">更多 <span
                class="iconfont iconjinru"></span></span>
        </div>
        <div class="othermore">
            <div class="otheritem"><img src="" alt=""></div>
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
                    loop: true,
                    observe: true,
                    observeParents: true,
                    pagination: {el: ".swiper-pagination"}
                },
                exhibit_id: '',
                einfo: {
                    exhibit_imgs: []
                }
            }
        },
        created() {
            if (this.$route.query.exhibit_id) {
                this.exhibit_id = this.$route.query.exhibit_id;
                this._ExhibitInfo()
            } else {
                this.$router.replace('/')
            }
        },
        methods: {
            _ExhibitInfo() {
                this.$api.ExhibitInfo(1, this.exhibit_id).then(res => {
                    if (res.status == 1) {
                        this.einfo = res.data;
                    }
                })
            }
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
                width: 12px;
                /*px*/
                height: 12px;
                /*px*/
                &.swiper-pagination-bullet-active {
                    width: 36px;
                    /*px*/
                    height: 12px;
                    /*px*/
                    background: rgba(255, 255, 255, 1);
                    border-radius: 6px;
                    /*px*/
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
            align-items: center;
            justify-content: space-between;

            .infoname {
                font-size: 36px;
                /*px*/
                padding-bottom: 12px;
            }

            .infotype {
                color: #757575;
                font-size: 28px;
                /*px*/
                span {
                    margin-right: 10px;
                }
            }

            .infolike {
                text-align: center;

                .iconfont {
                    font-size: 44px;
                    /*px*/
                    margin-bottom: 5px;
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
                font-size: 32px;
                /* px*/
                &.titles {
                    border-bottom: 2px solid #E6B204;
                    /*no*/
                    padding: 15px 0;
                }

                &.more {
                    color: #646464;
                    font-size: 26px;
                    /*px*/
                }
            }
        }

        .ccontent {
            padding: 15px;
            line-height: 24px;
            color: #323232;
            font-size: 30px;
            /*px*/
            text-align: justify;
        }
        .othermore{
            display: flex;
            align-items: center;
            padding: 15px;
            .otheritem{
                width: 77px;
                height: 77px;
                img{
                    width: 100%;
                }
            }
        }
    }
</style>