<template>
  <div class="order">
    <div class="address" v-if="address.name" @click="toAddressList">
      <div class="item">
        <div class="list">
          <div class="addresslist">
            <div>
              <span>{{address.name}}</span>
              <div class="moren">默认</div>
            </div>
            <div class="info">
              <p>{{address.mobile}}</p>
              <p>{{address.address+address.address_detail}}</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="seladdress" v-else @click="toAdd">请选择默认地址</div>

    <div class="orderbox">
      <div class="item">
        <div>商品合计</div>
        <div>¥{{allprice}}</div>
      </div>
      <div class="item">
        <div>运费</div>
        <div>免运费</div>
      </div>
      <div class="item">
        <div>优惠券</div>
        <div>暂无</div>
      </div>
    </div>

    <div class="cartlist">
      <div class="item" v-for="(item, index) in name" :key="index">
        <div class="con">
          <div class="left">
            <div class="img">
              <img :src="image[index]" alt="">
            </div>
            <div class="info">
              <p>{{name[index]}}</p>
              <p>¥{{price[index]}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">x{{quantity[index]}}</div>
          </div>
          <!-- <div @click="delGoods(item.id,index)" class="delete">
            <div>删除</div>
          </div> -->
        </div>
      </div>
    </div>

    <div class="bottom" :class="{safeArea: isIPhoneX}">
      <div>实付：¥ {{allprice}}</div>
      <div class="pay" @click="pay">支付</div>
    </div>
  </div>
</template>

<script>
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  data () {
    return {
      address: {},
      quantity: [],
      price: [],
      summary: [],
      name: [],
      image: [],
      allprice: '',
      openid: '',
      listData: [],
    }
  },
  // 原生小程序，等于mounted()
  onShow () {
    this.getDetail()
  },
  methods: {
    toAddressList () {
      wx.navigateTo({
        url: '/pages/myaddressSelect/main'
      })
    },
    toAdd () {
      wx.navigateTo({
        url: '/pages/myaddaddress/main'
      })
    },
    getDetail () {
      showLoading('加载中...');
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          // console.log('云函数login调用成功')
          // console.log(res.result.openid)
          this.openid = res.result.openid
          wx.cloud.callFunction({
            name: 'order',
            data: {
                type: "get",
                openid: this.openid
              },
            success: res => {
              console.log('云函数order:get调用成功')
              // console.log(this.openid)
              this.quantity= [],
              this.price=[],
              this.summary=[],
              this.name=[],
              this.image=[],
              wx.hideLoading()
              this.listData = res.result.data[0]
              this.allprice = this.listData.allprice
              // if (this.listData.goodsQuantity.indexOf(",")!=-1){
              this.quantity = this.listData.goodsQuantity.split(',')
              this.price = this.listData.goodsPrice.split(',')
              this.summary = this.listData.goodsSummary.split(',')
              this.name = this.listData.goodsName.split(',')
              this.image = this.listData.goodsImage.split(',')                       
              // }else {
              //   this.quantity.push(this.listData.goodsQuantity)
              //   this.price.push(this.listData.goodsPrice)
              //   this.summary.push(this.listData.goodsSummary)
              //   this.name.push(this.listData.goodsName)
              //   this.image.push(this.listData.goodsImage)    
              // }
            },
            fail: err => {
              wx.hideLoading()
              console.error('[云函数] [login] 调用失败', err)
            }
          })
          wx.cloud.callFunction({
            name: 'address',
            data: {
                type: "default",
                openid: this.openid
              },
            success: res => {
              console.log('云函数cart:default调用成功')
              console.log(this.openid)
              wx.hideLoading()
              if (res.result.data.length){
                this.address = res.result.data[0]
                console.log(this.address)
              }              
            },
            fail: err => {
              wx.hideLoading()
              console.error('[云函数] [login] 调用失败', err)
            }
          })          
        },
        fail: err => {
          wx.hideLoading()
          console.error('[云函数] [login] 调用失败', err)
        }
      })
      // const data = await get('/order/detailAction', {
      //   openId: this.openId,
      //   addressId: this.addressId
      // })
      // console.log(data)
      // if (data) {
      //   // this.allprice = data.price
      //   this.listData = data.goodsList
      //   this.address = data.address
      // }
      // // map计算购物车总价
      // this.listData.map((item) => {
      //   this.allprice = Number(item.retail_price * item.number) + Number(this.allprice)
      // })
    },
  //   delGoods(id, index) {
  //     wx.showModal({
  //     title: '提示',
  //     content: '确定要删除吗？',
  //     success: (sm) =>{
  //       if (sm.confirm) {
  //         showLoading('加载中...');
  //           // 用户点击了确定 可以调用删除方法了
  //         wx.cloud.callFunction({
  //           name: 'cart',
  //           data: {
  //             type: "delete",
  //             openid: this.openid,
  //             id:id
  //           },
  //           success:res =>{
  //             // console.log('云函数cart:remove调用成功')              
  //             for (let i = 0; i < this.listData.length; i++) {
  //               const element = this.listData[i]
  //               if (element.id == id) {
  //                 this.listData.splice(i,1)
  //               }
  //             }
  //             wx.hideLoading()  
  //             wx.showToast({
  //               title: '删除成功',
  //               icon: 'success',
  //               duration: 1500
  //             })
  //           },
  //           fail: err => {
  //             wx.hideLoading()
  //             console.error('[云函数] [login] 调用失败', err)
  //           }
  //         })
  //       } else if (sm.cancel) {
  //         wx.hideLoading()
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // },
    pay () {
      wx.showToast({
        title: '支付功能暂未开发',
        icon: 'none',
        duration: 1500,
        mask: false,
        success: res => {}
      })
    }
  },
  computed: {
    // 实时查看是否全选
    // isCheckedNumber () {
    //   let number = 0
    //   for (let i = 0; i < this.Listids.length; i++) {
    //     if (this.Listids[i]) {
    //       number++
    //     }
    //   }
    //   if (number == this.listData.length && number !== 0) {
    //     this.allcheck = true
    //   } else {
    //     this.allcheck = false
    //   }
    //   return number
    // },
    // // 实时计算总价
    allPrice () {
      let Price = 0
      for (let i = 0; i < this.listData.length; i++) {
        Price += this.listData[i].sellPrice * this.listData[i].number
      }
      return Price
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>