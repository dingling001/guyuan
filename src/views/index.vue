<template>
    <div class="msgbox">
        <div class="label">请填写预留的手机号码</div>
        <div class="inputbox">
            <img src="../assets/img/phone.png" alt="">
            <van-field type="number" placeholder="在此输入预留的手机号" readonly clickable :value="phone"
                       @touchstart.native.stop="show = true"></van-field>
        </div>
        <van-number-keyboard
                v-model="phone"
                :show="show"
                :maxlength="11"
                @blur="show = false"
        />
        <van-button type="default" @click="leavemsg">确认</van-button>
    </div>
</template>

<script>
    import {Toast} from 'vant'

    export default {
        name: "msg",
        data() {
            return {
                show: false,
                phone: '',
                gorder_id: '',
                contact_phone: ''
            }
        },
        created() {
            this.gorder_id = this.$route.query.gorder_id;
        },
        methods: {
            // 验证手机号
            leavemsg() {
                if (!/^1\d{10}$/gi.test(this.phone)) {
                    Toast('请输入正确的手机号')
                } else {
                    this.$api.GOrderIdFeedback(this.gorder_id).then(res => {
                        console.log(res)
                        if (res.status == 1) {
                            if (this.phone == res.data.order.contact_phone) {
                                this.$router.push({path: '/home', query: {gorder_id: this.gorder_id}})
                            } else {
                                Toast('预约手机号暂无订单信息')
                            }
                        } else {
                            Toast('预约手机号暂无订单信息')
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .msgbox {
        min-height: 100vh;
        background-color: #F5F5F5;
        background-image: url("../assets/img/bg.png");
        background-size: cover;
        background-repeat: no-repeat;

        .label {
            padding: 124px 0 34px 56px;
            font-size: 17px;
            color: #fff;
        }

        .inputbox {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 261px;
            margin: 0 auto;
            border-bottom: 1px solid rgba(255, 255, 255, .7);

            img {
                width: 13.5px;
            }

            /deep/ .van-cell {
                background: none;

                input {
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                    background: none;
                    outline: none;
                    border: 0;
                    color: #fff;

                    &::placeholder {
                        color: rgba(255, 255, 255, .5);
                    }
                }
            }


        }


        /deep/ .van-button {
            height: 39px;
            background: #EE8E41;
            border-radius: 4px;
            border: 0;
            margin: 39px auto;
            display: block;
            font-size: 18px;
            color: #fff;
            width: 261px;
            /*position: fixed;*/
            /*bottom: 30px;*/
        }
    }
</style>