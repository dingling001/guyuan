<template>
    <van-pull-refresh v-model="isDownLoading" @refresh="onRefresh" v-if="list.exhibit.length">
        <van-list
                v-model="isUpLoading"
                :finished="finished"
                finished-text="到底了"
                @load="onLoad"
                class="home"
                v-wechat-title="title"
                :offset="offset"
        >
            <div class="homeitem" v-for="item in list.exhibit" :key="item.exhibit_id"
                 @click="godetail(item.exhibit_id)">
                <div class="homeimg"><img :src="item.exhibit_list_img" alt=""></div>
                <div class="hometitle van-ellipsis">{{item.exhibition_name}}</div>
            </div>
        </van-list>
    </van-pull-refresh>
</template>

<script>
    // @ is an alias to /src

    export default {
        name: 'home',
        data() {
            return {
                title: '相关展品',
                list: {
                    exhibit: []
                },
                take: 8,
                page: 0,
                isDownLoading: false,
                isUpLoading: false,
                finished: false,
                offset: 50
            }
        },
        created() {
            this.exhibit_id = this.$route.query.exhibit_id;
            this._ExhibitList();
        },
        methods: {
            _ExhibitList() {
                this.$api.ExhibitCateTj(1, this.exhibit_id, this.take * this.page, this.take, 1).then((res) => {
                    if (res.status == 1) {//请求成功
                        if (this.list.exhibit.length) {//当请求前有数据时 第n次请求
                            if (this.isUpLoading) {// 上拉加载
                                this.list.exhibit = this.list.exhibit.concat(res.data.exhibit) //上拉加载新数据添加到数组中
                                this.$nextTick(() => { //在下次 DOM 更新循环结束之后执行延迟回调
                                    this.isUpLoading = false  //关闭上拉加载中
                                })
                                if (res.data.exhibit.length < this.take) {//没有更多数据
                                    this.finished = true   //上拉加载完毕
                                }
                            }
                            if (this.isDownLoading) {//关闭下拉刷新
                                this.isDownLoading = false; //关闭下拉刷新中
                                this.list.exhibit = res.data.exhibit; //重新给数据赋值
                                if (this.finished) { //如果上拉加载完毕为true则设为false。解决上拉加载完毕后再下拉刷新就不会执行上拉加载问题
                                    this.finished = false
                                }
                            }
                        } else {
                            this.list.exhibit = res.data.exhibit
                        }
                    }
                })
            },
            // 下拉刷新
            onRefresh() {
                setTimeout(() => {
                    this.isDownLoading = false;
                    this.page = 0;
                    this._ExhibitList();
                }, 500);
            },
            // 上拉加载
            onLoad() {
                this.page++;
                this.isUpLoading = true;
                this._ExhibitList();
            },
            // 详情
            godetail(id) {
                this.$router.push({path: '/exdetail', query: {exhibit_id: id}})
            }
        }
    }
</script>
<style scoped lang="scss">
    .home {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 9px 15px 50px 15px;
        position: relative;

        /deep/ .van-list__finished-text {
            position: absolute;
            width: 100%;
            bottom: 0;
            text-align: center;
        }

        /deep/ .van-list__loading {
            position: absolute;
            width: 100%;
            bottom: 0;
            text-align: center;
        }

        .homeitem {
            width: 165px;
            height: 201px;
            box-shadow: 0 2px 8px 0 rgba(128, 128, 128, 0.24);
            margin-bottom: 15px;

            &:active {
                opacity: .7;
            }

            .homeimg {
                width: 165px;
                height: 165px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;

                img {
                    width: 100%;
                }
            }

            .hometitle {
                padding: 0 10px;
                text-align: center;
                line-height: 36px;
                color: #323232;
                font-size: 15px;
            }
        }
    }
</style>
