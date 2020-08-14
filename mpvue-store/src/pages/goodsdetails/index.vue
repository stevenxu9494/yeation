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
        <p>¥{{info.sellPrice}}</p>
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
    <div class="bottom-fixed">
      <div class="collect-box" @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' : '']"></div>
      </div>
      <div class="car-box" @click="toCart">
        <div class="car" >
          <!-- <span>{{allnumber}}</span> -->
          <span>5</span>
          <img src="/static/images/ic_menu_shoping_nor.png" alt="">
        </div>
      </div>
      <div @click="buy">立即购买</div>
      <div @click="addCart">加入购物车</div>
    </div>

    <!-- 选择规格的弹出层 -->
    <div class="pop" v-show="showpop" @click="showType"></div>
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
      <div class="top">
        <div class="left">
          <img :src="info.thumbUrl" alt="">
        </div>
        <div class="right">
          <div>
            <p>{{info.name}}</p>
            <p>价格¥{{info.sellPrice}}</p>
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
export default {
  data () {
    return {
//       gallery: [], // banner
      id: 0,
      openid: '',
      info: {},
      showpop: false,
      number: 0,
      collectFlag: false,
//       brand: {},    
//       attribute: [],
//       goods_desc: '',
//       issueList: [], // 常见问题
//       productList: [],
//       goodsId: '',
//       allnumber: 0,
//       allPrice: '' // 总价=数量*单价
    }
  },
  // 商品分享, 小程序自带格式, title/path/imageUrl
  onShareAppMessage() {
    console.log(this.info.name)
    return {
      title: this.info.name,
      path: '/pages/goods/main?id' + this.info.id,
      imageUrl: this.info.imageUrl
    }
  },
  mounted () {
    this.onGotUserInfo();
    // 原生小程序夹带url参数使用this.$root.query.id
    this.id = parseInt(this.$root.$mp.query.id)
    // console.log(typeof this.id, '------')
    // this.goodsDetail()
    this.goodsDetail()
  },
  methods: {
    onGotUserInfo: function(e){
      //将this对象保存到that中
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          console.log('云函数调用成功')
          console.log(res.result.openid)
          this.openid = res.result.openid
        },
        fail: err => {
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
      wx.cloud.callFunction({
        name: 'getgoodsdetails',
        data: {
          id: this.id
        },
        success: res => {
          console.log('云函数调用成功')
          // console.log(res.result.data)
          this.info = res.result.data[0]
          console.log(this.info)
        },
        fail: err => {
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
          console.log('云函数collect调用成功')
          console.log(res.result.data.length)
          if(res.result.data.length>0){
            this.collectFlag = true
          }else{
            this.collectFlag = false
          }
        },
        fail: err => {
          console.error('[云函数] [getlistdata2] 调用失败', err)
        }
      })
    },
//     async goodsDetail () {
//       const data = await get('/goods/detailaction', {
//         id: this.id,
//         openId: this.openId
//       })
//       console.log(data)
//       this.info = data.info
//       this.gallery = data.gallery
//       this.attribute = data.attribute
//       this.goods_desc = data.info.goods_desc
//       this.issueList = data.issue
//       this.productList = data.productList
//       this.goodsId = data.info.id
//       // 进页面就判断是否收藏过
//       this.collectFlag = data.collected
//       // 购物车内有多少件物品(非种类)
//       this.allnumber = data.allnumber
//       this.allPrice = data.info.retail_price
//     },
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
      if(this.collectFlag == false){
        this.collectFlag = !this.collectFlag
        wx.cloud.callFunction({
          name: 'insertcollect',          
          data: {
            type: "insert",
            id: this.id,
            openid: this.openid
          },
          success: res => {
            console.log('云函数调用成功')
            // console.log(res.result.data)
            console.log(typeof this.id)
            console.log(typeof this.openid)
            wx.showToast({
              title: '收藏成功',
              icon: 'success',
              duration: 1500
            })
          },
          fail: err => {
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
            console.log('云函数delete调用成功')
            // console.log(res.result.data)
            wx.showToast({
            title: '取消收藏',
            icon: 'fail',
            duration: 1500
          })
          },
          fail: err => {
            console.error('[云函数] [getlistdata2] 调用失败', err)
          }
        })
      }
    },
    toCart () {
      // 切换tab
      wx.switchTab({
        url: '/pages/cartNew/main'
      });  
    },
    async buy () {
      // 弹出层是否已经弹出
      if (this.showpop) {
        // 如果没有选择数量，使用微信官方弹窗提示选择商品
        if (this.number === 0) {
          wx.showToast({
            title: '请选择商品数量',
            // 2秒后消失
            duration: 3000,
            icon: 'none',
            // 除蒙层外其他地方不能点
            mask: true,
            success: res => {}
          })
          return false
        }
        // 已经选择了数量，打开接口请求
        const data = await post('/order/submitAction', {
          goodsId: this.goodsId,
          openId: this.openId,
          allPrice: this.allPrice
        })
        if (data) {
          wx.navigateTo({
            url: '/pages/order/main'
          });
            
        }
      } else {
        this.showpop = true
      }
    },
    async addCart () {
      if (this.showpop) {
        if (this.number == 0) {
          wx.showToast({
            title: '请选择商品数量',
            duration: 2000,
            icon: 'none',
            mask: true,
            success: res => {}
          })
          return false
        }
        const data = await post('cart/addCart', {
          openId: this.openId,
          goodsId: this.goodsId,
          number: this.number
        })
        if (data) {
          this.allnumber = this.allnumber + this.number
          wx.showToast({
            title: '添加购物车成功',
            icon: 'success',
            duration: 1500
          })
        }
      } else {
        this.showpop = true
      }
  }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>