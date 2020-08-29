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
      goodsId:"",
      goodsQuantity:"",
      goodsPrice:"",
      goodsSummary:"",
      goodsName:"",
      goodsImage:""
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
            name: 'address',
            data: {
                type: "default",
                openid: this.openid
              },
            success: res => {
              hideLoading()
              if (res.result.data.length){
                this.address = res.result.data[0]
                console.log(this.address)
              } else{
                this.address = {}
              }   
            },
            fail: err => {
              hideLoading()
              console.error('[云函数] [login] 调用失败', err)
            }
          })    
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
              this.listData = res.result.data[0]
              this.allprice = this.listData.allprice
              this.quantity = this.listData.goodsQuantity.split(',')
              this.price = this.listData.goodsPrice.split(',')
              this.summary = this.listData.goodsSummary.split(',')
              this.name = this.listData.goodsName.split(',')
              this.image = this.listData.goodsImage.split(',')                       
              this.goodsId = this.listData.goodsId
              this.goodsQuantity = this.listData.goodsQuantity
              this.goodsPrice = this.listData.goodsPrice
              this.goodsSummary = this.listData.goodsSummary
              this.goodsName = this.listData.goodsName
              this.goodsImage = this.listData.goodsImage
            },
            fail: err => {
              hideLoading()
              console.error('[云函数] [login] 调用失败', err)
            }
          })
                
        },
        fail: err => {
          hideLoading()
          console.error('[云函数] [login] 调用失败', err)
        }
      })
    },
    getDateTime() {
      var now     = new Date(); 
      var year    = now.getFullYear();
      var month   = now.getMonth()+1; 
      var day     = now.getDate();
      var hour    = now.getHours();
      var minute  = now.getMinutes();
      var second  = now.getSeconds(); 
      if(month.toString().length == 1) {
            month = '0'+month;
      }
      if(day.toString().length == 1) {
            day = '0'+day;
      }   
      if(hour.toString().length == 1) {
            hour = '0'+hour;
      }
      if(minute.toString().length == 1) {
            minute = '0'+minute;
      }
      if(second.toString().length == 1) {
            second = '0'+second;
      }   
      var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
        return dateTime;
    },
    isEmpty(obj) {
      for(var prop in obj) {
        if(obj.hasOwnProperty(prop)) {
          return false;
        }
      }
      return true;
    },
    pay () {     
      console.log(this.address) 
      if (!this.isEmpty(this.address)){
        showLoading('加载中...');
        var currentdate = new Date(); 
        var orderid = currentdate.valueOf();
        var datetime =  this.getDateTime();
        wx.cloud.callFunction({
          name: 'ordersummary',
          data: {
              type: "insert",
              openid: this.openid,
              orderid: orderid.toString(),
              ordertime: datetime,
              paid: false,
              shipped: false,
              name: this.address.name,
              mobile: this.address.mobile,
              address: this.address.address,
              address_detail: this.address.address_detail,
              goodsId: this.listData.goodsId,
              goodsQuantity: this.listData.goodsQuantity,
              goodsPrice: this.listData.goodsPrice,
              goodsSummary: this.listData.goodsSummary,
              goodsName: this.listData.goodsName,
              goodsImage: this.listData.goodsImage,
              allprice: this.allprice
          },
          success: res => {
            hideLoading();
            wx.navigateTo({
              url: '/pages/mypayment/main?orderid=' + orderid
            })
          },
          fail: err => {
              hideLoading()
              console.error('[云函数] [login] 调用失败', err)
          }
        })
      } else {
        wx.showToast({
          title: '请选择收件地址',
          icon: 'none',
          duration: 1500,
          mask: false,
          success: res => {}
        })
      }
      // wx.showToast({
      //   title: '支付功能暂未开发',
      //   icon: 'none',
      //   duration: 1500,
      //   mask: false,
      //   success: res => {}
      // })
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