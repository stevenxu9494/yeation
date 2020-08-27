<template>
  <div class="address">
    <scroll-view scroll-y="true" class="addcont" style="height: 100%">
      <div class="item" v-if="listData.length !== 0">
        <div class="list" v-for="(item, index) in listData" :key="index">
          <div class="addresslist">
            <div>
              <span>{{item.name}}</span>
              <div class="moren" v-if="item.is_default">默认</div>
            </div>
            <div class="info" @click="selAddress(item._id)">
              <p>{{item.mobile}}</p>
              <p>{{item.address+item.address_detail}}</p>
            </div>
            <div @click="toDetail(item._id)"></div>
          </div>
        </div>
      </div>

      <div class="center" v-else>
        <p>收货地址在哪里?</p>
      </div>
    </scroll-view>

    <div class="bottom" :class="{safeArea: isIPhoneX}">
      <div @click="wxaddress(1)">+新建地址</div>
      <div @click="wxaddress">一键导入微信地址</div>
    </div>
  </div>
</template>

<script>
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  data() {
    return {
      listData: [],
      openid: ""
    };
  },
  onShow() {
    this.getAddressList();
  },
  methods: {
    toDetail(_id) {
      wx.navigateTo({
        url: "/pages/myaddaddress/main?id=" + _id
      });
    },
    wxaddress(index) {
      if (index === 1) {
        wx.navigateTo({
          url: "/pages/myaddaddress/main"
        });
      } else {
        // 微信自带选择地址
        wx.chooseAddress({
          success: function(res) {
            let result = encodeURIComponent(JSON.stringify(res));
            wx.navigateTo({
              url: "/pages/myaddaddress/main?res=" + result
            });
          }
        });
      }
    },
    getAddressList() {
      // let _this = this;
      // const data = await get("/address/getListAction", {
      //   openId: _this.openId
      // });
      // console.log(data);
      // _this.listData = data.data;
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
              // console.log('云函数cart调用成功')
              // console.log(this.openid)
              wx.hideLoading()
              if (res.result.data.length){
                this.listData = res.result.data
                console.log(this.listData)
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
    },
    selAddress (_id) {
      wx.setStorageSync('addressId', _id)
      wx.navigateBack({
        delta: 1
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "./style.less";
</style>