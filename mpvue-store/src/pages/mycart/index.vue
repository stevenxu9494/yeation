<template>
  <div class="cart">
    <div class="top">
      <div>100%正品承诺</div>
      <div>澳洲直邮</div>
      <div>假一赔十</div>
    </div>
    <div class="cartlist">
      <div class="hasitem" v-if="listData.length!==0">
        <div class="item" v-for="(item, index) in listData" :key="index">
          <div class="con">
            <div class="left">
              <!-- List里是否存在 -->
              <div class="icon" @click="changeColor(index, item.id)" :class="[Listids[index] ? 'active' : '']"></div>
              <div class="img">
                <img :src="item.thumbUrl" alt="">
              </div>
              <div class="info">
                <p>{{item.name}}</p>
                <p>单价：¥{{item.sellPrice}}</p>
              </div>
            </div>
            <div class="right">                  
              <div class="num">x {{item.number}}</div>
            </div>
            <div @click="delGoods(item.id,index)" class="delete">
              <div>删除</div>
            </div>
          </div>          
        </div>
      </div>

      <div class="nogoods" v-else>
        <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png" alt="">
      </div>
    </div>

    <div class="fixed">
      <div class="left" @click="allCheck" :class="{'active': allcheck}">
        全选({{isCheckedNumber}})
      </div>
      <div class="right">
        <div>¥{{allPrice}}</div>
        <div @click="orderDown">下单</div>
      </div>
    </div>
  </div>
</template>

<script>
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  data () {
    return {
      openid: '',
      listData: [],
      Listids: [],
      allcheck: false
    }
  },
  onShow () {    
    this.getListData();
  },
  methods: {
    getListData() {
      showLoading('加载中...');
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          // console.log('云函数login调用成功')
          // console.log(res.result.openid)
          this.openid = res.result.openid
          wx.cloud.callFunction({
            name: 'cart',
            data: {
                type: "get",
                openid: this.openid
              },
            success: res => {
              // console.log('云函数cart调用成功')
              // console.log(this.openid)
              wx.hideLoading()
              this.listData = res.result.data
              console.log(this.listData)
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
      
    },
    changeColor (index, id) {
      if (this.Listids[index]) {
        this.$set(this.Listids, index, false)
      } else {
        this.$set(this.Listids, index, id)
      }
    },
    allCheck () {
      // 先清空选择
      this.Listids = []
      if (this.allcheck) {
        this.allcheck = false
      } else {
        this.allcheck = true
        // 全部选择
        for (let i = 0; i < this.listData.length; i++) {
          const element = this.listData[i]
          this.Listids.push(element.id)
        }
      }
    },
    orderDown () {
      showLoading('加载中...');
      if (this.Listids.length == 0) {
        wx.showToast({
          title: '请选择商品',
          icon: 'none',
          duration: 1500
        })
        return false
      }
      // 去除数组中空的false
      let newgoodsid = []
      let newgoodsnumber = []
      let newgoodsprice = []
      let newgoodssummary = []
      let newgoodsname = []
      let newgoodsimage = []
      for (let i = 0; i < this.Listids.length; i++) {
        const element = this.Listids[i]
        const quantity = this.listData[i].number
        const price = this.listData[i].sellPrice
        const summary = parseInt(price) * parseInt(quantity)
        const name = this.listData[i].name
        const image = this.listData[i].thumbUrl
        if (element) {
          newgoodsid.push(element)
          newgoodsnumber.push(quantity)
          newgoodsprice.push(price)
          newgoodssummary.push(summary.toString())
          newgoodsname.push(name)
          newgoodsimage.push(image)
        }
      }
      let goodsId = newgoodsid.join(',')
      let goodsQuantity = newgoodsnumber.join(',')
      let goodsPrice = newgoodsprice.join(',')
      let goodsSummary = newgoodssummary.join(',')
      let goodsName = newgoodsname.join(',')
      let goodsImage = newgoodsimage.join(',')
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
                allprice: this.allPrice
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
                goodsId: goodsId,
                goodsQuantity: goodsQuantity,
                goodsPrice: goodsPrice,
                goodsSummary: goodsSummary,
                goodsName: goodsName,
                goodsImage: goodsImage,
                allprice: this.allPrice
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
    },
//     async orderDown () {
//       if (this.Listids.length == 0) {
//         wx.showToast({
//           title: '请选择商品',
//           icon: 'none',
//           duration: 1500
//         })
//         return false
//       }
//       // 去除数组中空的false
//       let newgoodsid = []
//       for (let i = 0; i < this.Listids.length; i++) {
//         const element = this.Listids[i]
//         if (element) {
//           newgoodsid.push(element)
//         }
//       }
//       let goodsId = newgoodsid.join(',')
//       const data = await post('/order/submitAction', {
//         goodsId: goodsId,
//         openId: this.openId,
//         allPrice: this.allPrice
//       })
//       if (data) {
//         wx.navigateTo({
//           url: '/pages/order/main'
//         });
//       }
//     }
    delGoods(id, index) {
      if(this.Listids[index] === undefined || this.Listids[index] === false) {
        wx.showModal({
        title: '提示',
        content: '确定要删除吗？',
        success: (sm) =>{
          if (sm.confirm) {
            showLoading('加载中...');
              // 用户点击了确定 可以调用删除方法了
            wx.cloud.callFunction({
              name: 'cart',
              data: {
                type: "delete",
                openid: this.openid,
                id:id
              },
              success:res =>{
                // console.log('云函数cart:remove调用成功')              
                for (let i = 0; i < this.listData.length; i++) {
                  const element = this.listData[i]
                  if (element.id == id) {
                    this.listData.splice(i,1)
                  }
                }
                wx.hideLoading()  
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1500
                })
              },
              fail: err => {
                wx.hideLoading()
                console.error('[云函数] [login] 调用失败', err)
              }
            })
          } else if (sm.cancel) {
            wx.hideLoading()
            console.log('用户点击取消')
          }
        }
      })} else{
        wx.showToast({
          title: '请先取消选择再删除',
          icon: 'none',
          duration: 2000
        })
      }
  }
  },
  computed: {
    // 实时查看是否全选
    isCheckedNumber () {
      let number = 0
      for (let i = 0; i < this.Listids.length; i++) {
        if (this.Listids[i]) {
          number++
        }
      }
      if (number == this.listData.length && number !== 0) {
        this.allcheck = true
      } else {
        this.allcheck = false
      }
      return number
    },
    // 实时计算总价
    allPrice () {
      let Price = 0
      for (let i = 0; i < this.Listids.length; i++) {
        if (this.Listids[i]) {
          Price += this.listData[i].sellPrice * this.listData[i].number
        }
      }
      return Price
    }
  }
}
</script>

<style lang="less" scoped>
@import './style.less';
</style>