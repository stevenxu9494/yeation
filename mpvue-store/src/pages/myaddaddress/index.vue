<template>
  <div class="addaddress">
    <div class="item">
      <input type="text" placeholder="姓名" v-model="userName">
    </div>
    <div class="item">
      <input type="text" placeholder="手机号码" v-model="telNumber">
    </div>
    <div class="item">
      <picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
        <input type="text" placeholder="省份、城市、区县" v-model="address">
      </picker>
    </div>
    <div class="item">
      <!-- v-model是可以双向绑定 -->
      <input type="text" placeholder="详细地址，如楼道、楼盘号等" v-model="detailaddress">
    </div>

    <div class="item itemend">
      <checkbox-group @change="checkboxChange">
        <label class="checkbox">
          <checkbox class="box" value="true" :checked="checked" color="#b4282d"></checkbox>
          设置为默认地址
        </label>
      </checkbox-group>
      <div @click="wxaddress">微信一键导入>></div>
    </div>
    
    <div v-if="isInsert">
      <div class="bottom" @click="insertAddress" :class="{safeArea: isIPhoneX}">保存</div>
    </div> 
    <div v-else>
      <div class="bottom" @click="saveAddress" :class="{safeArea: isIPhoneX}">保存</div>
    </div>
  </div>
</template>

<script>
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  data () {
    return {
      userName: '',
      telNumber: '',
      region: [],
      customItem: '全部',
      address: '',
      detailaddress: '',
      checked: false,
      openid: '',
      res: '',
      id: '',
      isInsert: true,
      is_default: 0
    }
  },
  mounted() {
    // this.openId = getStorageOpenid()
    // 是否携带上个页面的参数
    // 携带地址res是为编辑    
    if (this.$root.$mp.query.res) {
      this.res = JSON.parse(decodeURIComponent(this.$root.$mp.query.res))
      console.log(this.res, '------')
      this.userName = this.res.userName
      this.telNumber = this.res.telNumber
      this.address = `${this.res.provinceName} ${this.res.cityName} ${this.res.countyName}`
      this.detailaddress = this.res.detailInfo
    }
    // 携带id是为新增地址
    if (this.$root.$mp.query.id) {
      this.id = this.$root.$mp.query.id
      this.getDetail()
      this.isInsert = false
    }
    // 新增地址，不携带id    
  },
  methods: {
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
                type: "get",
                openid: this.openid,
                addressId: this.id
              },
            success: res => {
              // console.log('云函数cart调用成功')
              // console.log(this.openid)
              wx.hideLoading()
              // console.log("1111111111111")
              // console.log(res.result.data[0])
              let detail = res.result.data[0]
              this.userName = detail.name
              this.telNumber = detail.mobile
              this.address = detail.address
              this.detailaddress = detail.address_detail
              this.checked = detail.is_default === 1 ? true : false
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
      // const data = await get('/address/detailAction', {
      //   id: this.id
      // })
      // console.log(data)
      // let detail = data.data
      // this.userName = detail.name
      // this.telNumber = detail.mobile
      // this.address = detail.address
      // this.detailaddress = detail.address_detail
      // this.checked = detail.is_default === 1 ? true : false
    },
    checkboxChange (e) {
      this.checked = e.mp.detail.value[0]
      // console.log(e.mp.detail.value)
    },
    bindRegionChange (e) {      
      let value = e.mp.detail.value
      this.address = `${value[0]} ${value[1]} ${value[2]}`
    },
    // 微信自带获得微信地址
    wxaddress () {
      wx.chooseAddress({
        success: (result) => {
          this.userName = result.userName
          this.telNumber = result.telNumber
          this.address = `${result.provinceName} ${result.cityName} ${result.countyName}`
          this.detailaddress = result.detailInfo
        },
        fail: () => {},
        complete: () => {}
      });
    },
    saveAddress () {
      showLoading('加载中...');
      if(this.checked) {
        this.is_default = 1
      } else {
        this.is_default = 0
      }
      
      wx.cloud.callFunction({
        name: 'address',
        data: {
          type: "update",
          openid: this.openid,
          addressId: this.id,          
          name: this.userName,
          mobile: this.telNumber,
          address: this.address,
          address_detail: this.detailaddress,
          is_default:this.is_default    
        },
        success: res => {
          console.log('云函数address:update调用成功')
          // console.log(this.openid)
          console.log(this.openid)
          console.log(this.id)
          console.log(this.userName)
          console.log(this.telNumber)
          console.log(this.address)
          console.log(this.detailaddress)
          console.log(this.is_default)
          wx.hideLoading()
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000,
            mask: true,
            success: (result) => {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 2000)
            },
            fail: () => {},
            complete: () => {}
          });
        },
        fail: err => {
          wx.hideLoading()
          console.error('[云函数] [address:update] 调用失败', err)
        }
      })
    },
    insertAddress () {
      if(this.checked) {
        this.is_default = 1
      } else {
        this.is_default = 0
      }
      // console.log(this.openid)
      // console.log(this.id)
      // console.log(this.userName)
      // console.log(this.telNumber)
      // console.log(this.address)
      // console.log(this.detailaddress)
      // console.log(this.is_default)
      showLoading('加载中...');
      console.log("this is insert address function")
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          // console.log('云函数login调用成功')
          // console.log(res.result.openid)
          this.openid = res.result.openid          
          wx.cloud.callFunction({
            name: 'address',
            data: {
              type: "insert",
              openid: this.openid,
              name: this.userName,
              mobile: this.telNumber,
              address: this.address,
              address_detail: this.detailaddress,
              is_default:this.is_default                
            },
            
            success: res => {
              // console.log('云函数cart调用成功')
              // console.log(this.openid)
              wx.hideLoading()
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 2000,
                mask: true,
                success: (result) => {
                  setTimeout(() => {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 2000)
                },
                fail: () => {},
                complete: () => {}
              });
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
      // const data = await post('/address/saveAction', {
      //   userName: this.userName,
      //   telNumber: this.telNumber,
      //   address: this.address,
      //   detailaddress: this.detailaddress,
      //   checked: this.checked,
      //   openId: this.openId,
      //   addressId: this.id
      // })
      // console.log(data)
      // if (data.data) {
      //   wx.showToast({
      //     title: '添加成功',
      //     icon: 'success',
      //     duration: 2000,
      //     mask: true,
      //     success: (result) => {
      //       setTimeout(() => {
      //         wx.navigateBack({
      //           delta: 1
      //         })
      //       }, 2000)
      //     },
      //     fail: () => {},
      //     complete: () => {}
      //   });
          
      // }
    }
  }
}
</script>

<style lang="less" scoped>
@import "./style.less";
</style>