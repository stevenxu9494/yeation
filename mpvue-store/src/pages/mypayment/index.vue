<template>
<div class="payment">
    <div class="order-info">
        <div class="item-congraz">恭喜您下单成功！</div>
        <div class="item-a">下单时间：{{info.ordertime}}</div>
        <div class="item-b">订单编号：{{info.orderid}}</div>
        <div class="item-c">
            <div class="l">金额：<span class="cost">￥{{info.allprice}}</span></div>
            <div class="r">
                <div class="btn" @click="cancelOrder">取消订单</div>
            </div>
        </div>
    </div>
    <div class="order-goods">
        <div class="h">
            <div class="label">商品信息</div>
            <!-- <div class="status">{{orderInfo.order_status_span}}</div> -->
        </div>
        <div class="goods">
            <div class="item" v-for="(item, index) in name" :key="index">
                <div class="img">
                    <image :src="image[index]"/>
                </div>
                <div class="info">
                    <div class="t">
                        <span class="name">{{name[index]}}</span>
                        <span class="number">x{{quantity[index]}}</span>
                    </div>
                    <div class="price">￥{{price[index]}}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="order-bottom">
        <div class="address">
            <div class="t">
                <span class="name">{{receiver}}</span>
                <span class="mobile">{{mobile}}</span>
            </div>
            <div class="b">{{address}}</div>
        </div>
        <div class="total">
            <div class="t">
                <span class="label">商品合计：</span>
                <span class="txt">￥{{info.allprice}}</span>
            </div>
            <div class="b">
                <span class="label">运费：</span>
                <span class="txt">￥0</span>
            </div>
        </div>
        <div class="pay-fee">
            <span class="label">金额：</span>
            <span class="txt">￥{{info.allprice}}</span>
        </div>
    </div>
</div>
</template>

<script>
import { showLoading, hideLoading } from '../../utils/loading';
export default {
  data () {
    return {
      openid: "",
      info: {},
      address: {},
      quantity: [],
      price: [],
      summary: [],
      name: [],
      image: [],
      receiver: "",
      mobile: "",
      address: ""
    }
  },
  mounted () {
    this.openid = wx.getStorageSync('openid') || '';
    // 原生小程序夹带url参数使用this.$root.query.id
    // this.id = this.$root.$mp.query.id
    this.orderid = this.$root.$mp.query.orderid 
    // this.orderid = '1598595766296'
    // console.log(this.orderid, '------')
    this.getOrderSummary()
  },
  methods: {
    getOrderSummary() {
        showLoading('加载中...');
        wx.cloud.callFunction({
        name: 'ordersummary',
        data: {
            type: "get",
            openid: this.openid,
            orderid: this.orderid
        },
        success: res => {
            hideLoading();
            // console.log('云函数login调用成功')
            this.info = res.result.data[0]
            this.quantity = this.info.goodsQuantity.split(',')
            this.price = this.info.goodsPrice.split(',')
            this.summary = this.info.goodsSummary.split(',')
            this.name = this.info.goodsName.split(',')
            this.image = this.info.goodsImage.split(',')    
            this.receiver = this.info.name
            this.address = this.info.address + " " + this.info.address_detail
            this.mobile = this.info.mobile
            console.log(this.name)
        },
        fail: err => {
            wx.hideLoading()
            console.error('[云函数] [login] 调用失败', err)
        }
        })
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style.less";
</style>