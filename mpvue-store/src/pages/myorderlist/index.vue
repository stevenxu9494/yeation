<template>
<div class="orderlist">
    <div class="orders">
        <div class="order" v-for="(item, index) in listData" :key="index">
            <div class="h">
                <div class="l">订单编号：{{item.orderid}}</div>
                <!-- <div class="r">{{item.order_status_span}}</div> -->
            </div>
            <div class="goods" v-for="(iitem, iindex) in item.goodsId" :key="iindex">
                <div class="img">
                    <image :src="item.goodsImage[iindex]"/>
                </div>
                <div class="info">
                    <text class="name">{{item.goodsName[iindex]}}</text>
                    <text class="number">共{{item.goodsQuantity[iindex]}}件商品</text>
                </div>
                <div class="status"></div>
            </div>
            <div class="b">
                <div class="l">金额：￥{{item.allprice}}</div>
                <div class="r">
                    <button class="btn" @click="checkOrder(item.orderid)">查看</button>
                </div>
            </div>
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
      listData:[],
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
            type: "getall",
            openid: this.openid
        },
        success: res => {
            hideLoading();
            console.log('云函数ordersummary:getall调用成功')
            this.listData = res.result.data
            for (let i = 0; i < this.listData.length; i++) {
              this.listData[i].goodsId = this.listData[i].goodsId.split(',')
              this.listData[i].goodsQuantity = this.listData[i].goodsQuantity.split(',')
              this.listData[i].goodsPrice = this.listData[i].goodsPrice.split(',')
              this.listData[i].goodsSummary = this.listData[i].goodsSummary.split(',')
              this.listData[i].goodsName = this.listData[i].goodsName.split(',')
              this.listData[i].goodsImage = this.listData[i].goodsImage.split(',')
              console.log(this.listData[i])
            }
        },
        fail: err => {
          wx.hideLoading()
          console.error('[云函数] [login] 调用失败', err)
        }
        })
    },
    checkOrder(orderid) {
      wx.navigateTo({
        url: '/pages/mypayment/main?orderid=' + orderid
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "./style.less";
</style>