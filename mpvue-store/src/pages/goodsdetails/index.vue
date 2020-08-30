<template>
  <div class="goods">
    <div class="swiper">
      <!-- <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <blok v-for="(item, index) in gallery" :key="index">
          <swiper-item class="swiper-item"> -->
      <img :src=info.imageUrl alt=""/>
          <!-- </swiper-item>
        </blok>
      </swiper> -->
      <button class="share" hover-class="none" open-type="share" value="">分享商品</button>
    </div>
    <div class="swiper-b">
      <div class="item">100%正品承诺</div>
      <div class="item">澳洲直邮</div>
      <div class="item">假一赔十</div>
    </div>
    <div class="goods-info">
      <div class="c">
        <p>{{info.name}}</p>
        <p>品牌名称：{{info.brand}}</p>
        <p v-if="info.price !== 0" class="price">¥{{info.sellPrice}}</p>
        <p v-else class="price">价格波动，请联系客服</p>
        <!-- <div class="brand" v-if="brand.name">
          <p>{{brand.name}}</p>
        </div> -->
      </div>
    </div>
    <div class="section-nav" @click="showType">
      <div>请选择规格数量</div>
      <div></div>
    </div>

    <!-- 图片展示 -->
    <div class="details" v-for="item in info.detailUrl" :key="item">
      <image :src=item alt="" mode='widthFix'/>
    </div>
    <!-- footer -->
    <div class="bottom-fixed" :class="{safeArea: isIPhoneX}">
      <div class="collect-box" @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' : '']"></div>
      </div>
      <div class="car-box" @click="toCart">
        <div class="car" >
          <span>{{allnumber}}</span>
          <img src="/static/images/ic_menu_shoping_nor.png" alt="">
        </div>
      </div>
      <div v-if="info.price !== 0" @click="buy()">立即购买</div>
      <div v-else @click="notForSale()">立即购买</div>      
      <div v-if="info.price !== 0" @click="addCart()">加入购物车</div>
      <div v-else @click="notForSale()">加入购物车</div>
    </div>

    <!-- 选择规格的弹出层 -->
    <div class="pop" v-show="showpop" @click="showType"></div>
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown', {safe: isIPhoneX}]">
      <div class="top">
        <div class="left">
          <img :src="info.thumbUrl" alt="">
        </div>
        <div class="right">
          <div>
            <p>{{info.name}}</p>
            <p v-if="info.price !== 0" class="price">¥{{info.sellPrice}}</p>
            <p v-else class="price">价格波动，请联系客服</p>
            <p>请选择数量</p> 
          </div>
        </div>
        <div class="close" @click="showType">✖️</div>
      </div>
      <div class="b">
        <p>数量</p> 
        <div class="count">
          <div class="cut" @click="reduce">-</div>
          <input type="text" class="number" v-model="number" disabled="false">
          <div class="add" @click="add">+</div>
        </div>
      </div>
    </div>
  </div>
</template>

// <script>
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  data () {
    return {
      id: 0,
      openid: '',
      info: {},
      showpop: false,
      number: 0,
      collectFlag: false,
      sellPrice: 0,
      hasGoods: [],
      allnumber: 0
    }
  },
  // 商品分享, 小程序自带格式, title/path/imageUrl
  onShareAppMessage() {
    console.log(this.info.name)
    return {
      title: this.info.name,
      path: '/pages/goodsdetails/main?id=' + this.info.id,
      imageUrl: this.info.imageUrl
    }
  },
  mounted () {
    this.onGotUserInfo();
    // 原生小程序夹带url参数使用this.$root.query.id
    this.id = parseInt(this.$root.$mp.query.id)
    // console.log(typeof this.id, '------')
    // this.goodsDetail()
    this.number = 0
    this.goodsDetail()
  },
  methods: {
    onGotUserInfo: function(e){
      showLoading('加载中...');
      //将this对象保存到that中
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          this.openid = res.result.openid
          wx.cloud.callFunction({
            name: 'cart',
            data: {
              type: "get",
              openid: this.openid
            },
            success: res => {
              // console.log('云函数cart:get调用成功')
              // console.log(res.result.data)
              hideLoading()
              if (res.result.data.length === 0) {
                this.allnumber = 0                
              } else{
                this.allnumber = res.result.data.map(item => item.number).reduce((total, num) => total + num)
              }
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
    goodsDetail() {
      // 获取右边商品的数据
      // this.nowIndex = index
      // this.nowItem = item.category
      // console.log(this.nowIndex)
      // console.log(this.nowItem)
      showLoading('加载中...');
      wx.cloud.callFunction({
        name: 'getgoodsdetails',
        data: {
          id: this.id
        },
        success: res => {
          hideLoading()
          // console.log('云函数调用成功')
          // console.log(res.result.data)
          this.info = res.result.data[0]
          // console.log(this.info)
        },
        fail: err => {
          hideLoading()
          console.error('[云函数] [getlistdata2] 调用失败', err)
        }
      })
      wx.cloud.callFunction({
        name: 'insertcollect',
        data: {
          type: "get",
          id: this.id,
          openid: this.openid
        },
        success: res => {
          hideLoading()
          if(res.result.data.length>0){
            this.collectFlag = true
          }else{
            this.collectFlag = false
          }
        },
        fail: err => {
          hideLoading()
          console.error('[云函数] [getlistdata2] 调用失败', err)
        }
      })
    },
    showType () {
      this.showpop = !this.showpop
    },
    add () {
      this.number += 1
    },
    reduce () {
      if (this.number > 1) {
        this.number -= 1
      } else {
        return false
      }
    },
    collect () {
      showLoading('加载中...');
      if(this.collectFlag === false){
        this.collectFlag = !this.collectFlag
        wx.cloud.callFunction({
          name: 'insertcollect',          
          data: {
            type: "insert",
            id: this.id,
            openid: this.openid,
            thumbUrl: this.info.thumbUrl,
            name: this.info.name,
            sellPrice: this.info.sellPrice,
          },
          success: res => {
            // console.log('云函数调用成功')
            // console.log(res.result.data)
            // console.log(typeof this.id)
            // console.log(typeof this.openid)
            hideLoading()
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1500
            })
          },
          fail: err => {
            hideLoading()
            console.error('[云函数] [getlistdata2] 调用失败', err)
          }
        })
      }else{
        this.collectFlag = !this.collectFlag
        wx.cloud.callFunction({
          name: 'insertcollect',          
          data: {
            type: "delete",
            id: this.id,
            openid: this.openid
          },
          success: res => {
            // console.log('云函数delete调用成功')
            // console.log(res.result.data)
            hideLoading()
            wx.showToast({
            title: '取消收藏',
            icon: 'fail',
            duration: 1500
          })
          },
          fail: err => {
            hideLoading()
            console.error('[云函数] [getlistdata2] 调用失败', err)
          }
        })
      }
    },
    toCart () {
      // 切换tab
      wx.reLaunch({
        url: '/pages/mycart/main'
      });  
    },
    notForSale () {
      wx.showToast({
        title: '价格波动，请联系客服',
        // 2秒后消失
        duration: 3000,
        icon: 'none',
        // 除蒙层外其他地方不能点
        mask: true,
        success: res => {}
      })
    },
    buy() {
      if (this.showpop) {
      // 如果没有选择数量，使用微信官方弹窗提示选择商品
        if (this.number === 0) {
          hideLoading()
          wx.showToast({
            title: '请选择商品数量',
            // 2秒后消失
            duration: 3000,
            icon: 'none',
            // 除蒙层外其他地方不能点
            mask: true,
            success: res => {}
          })
        } else {
          showLoading('加载中...');
          let goodsId = this.info.id.toString()
          let goodsQuantity = this.number.toString()
          let goodsPrice = this.info.sellPrice.toString()
          let goodsSummary = (parseInt(goodsPrice) * parseInt(goodsQuantity)).toString()
          let goodsName = this.info.name
          let goodsImage = this.info.thumbUrl
          wx.cloud.callFunction({
          name: 'order',
          data: {
              type: "check",
              openid: this.openid
            },
          success: res => {
            // console.log('云函数cart调用成功')
            // console.log(this.openid)
            wx.hideLoading()
            console.log(res.result.data.length)
            // 存在未支付订单
            if(res.result.data.length) {
              console.log("####这是update步骤####")
              console.log(goodsName)
              wx.cloud.callFunction({
                name: 'order',
                data: {
                    type: "update",
                    openid: this.openid,
                    paid: false,
                    shipped:false,
                    goodsId: goodsId,
                    goodsQuantity: goodsQuantity,
                    goodsPrice: goodsPrice,
                    goodsSummary: goodsSummary,
                    goodsName: goodsName,
                    goodsImage: goodsImage,
                    allprice: goodsSummary
                  },
                success: res => {
                  // console.log('云函数cart调用成功')
                  // console.log(this.openid)
                  wx.hideLoading()
                  wx.navigateTo({
                    url: '/pages/myorder/main'
                  });
                },
                fail: err => {
                  wx.hideLoading()
                  console.error('[云函数] [login] 调用失败', err)
                }
              })
            } else{
              // 不存在未支付订单
              wx.cloud.callFunction({
                name: 'order',
                data: {
                    type: "insert",
                    openid: this.openid,
                    paid: false,
                    shipped:false,
                    goodsId: goodsId,
                    goodsQuantity: goodsQuantity,
                    goodsPrice: goodsPrice,
                    goodsSummary: goodsSummary,
                    goodsName: goodsName,
                    goodsImage: goodsImage,
                    allprice: goodsSummary
                  },
                success: res => {
                  // console.log('云函数cart调用成功')
                  // console.log(this.openid)
                  wx.hideLoading()
                  wx.navigateTo({
                    url: '/pages/myorder/main'
                  });
                },
                fail: err => {
                  wx.hideLoading()
                  console.error('[云函数] [login] 调用失败', err)
                }
              })
            }
            // wx.navigateTo({
            //   url: '/pages/myorder/main'
            // });
          },
          fail: err => {
            wx.hideLoading()
            console.error('[云函数] [login] 调用失败', err)
          }
        })
        }
      }else {
        this.showpop = true
      }
        
      
    },
    addCart () {
      if (this.showpop) {
        if (this.number === 0) {
          hideLoading()
          wx.showToast({
            title: '请选择商品数量',
            duration: 2000,
            icon: 'none',
            mask: true,
            success: res => {}
          })
          return false
        }else {
          showLoading('加载中...');
          wx.cloud.callFunction({
            name: 'cart',
            data: {
              type: "check",
              id: this.id,
              openid: this.openid
            },
            success: res => {
              // console.log('云函数cart调用成功')
              this.hasGoods = res.result.data
              if(this.hasGoods.length===0){
                wx.cloud.callFunction({
                  name: 'cart',
                  data: {
                    type: "insert",
                    id: this.id,
                    openid: this.openid,
                    number: this.number,
                    sellPrice: this.info.sellPrice,
                    name: this.info.name,
                    thumbUrl: this.info.thumbUrl,
                    isOrdered: false
                  },
                  success: res => {
                    hideLoading()
                    this.onGotUserInfo()
                    wx.showToast({
                      title: '添加购物车成功',
                      icon: 'success',
                      duration: 1500
                    })
                    this.showpop = false
                  },
                  fail: err => {
                    hideLoading()
                    console.error('[云函数] [getlistdata2] 调用失败', err)
                  }
                })
              } else{
                console.log("这是更新步骤")
                wx.cloud.callFunction({
                  name: 'cart',
                  data: {
                    type: "update",
                    id: this.id,
                    openid: this.openid,
                    number: this.number,
                    sellPrice: this.info.sellPrice,
                    name: this.info.name,
                    thumbUrl: this.info.thumbUrl,
                    isOrdered: false
                  },
                  success: res => {
                    hideLoading()
                    this.onGotUserInfo()
                    wx.showToast({
                      title: '添加购物车成功',
                      icon: 'success',
                      duration: 1500
                    })
                    this.showpop = false
                  },
                  fail: err => {
                    hideLoading()
                    console.error('[云函数] [getlistdata2] 调用失败', err)
                  }
                })
              }
            },
            fail: err => {
              hideLoading()
              console.error('[云函数] [getlistdata2] 调用失败', err)
            }
          })
          
        }
      }else {
        this.showpop = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>