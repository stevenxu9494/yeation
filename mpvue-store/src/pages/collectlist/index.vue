<template>
  <div class="collection">
    <div class="title">
      我的收藏
    </div>
    <div class="sublist">
      <div @click="goodsDetail(subitem.id)" v-for="(subitem, subindex) in collectlist" :key="subindex">
        <img :src="subitem.thumbUrl" alt="">
        <p>{{subitem.name}}</p>
        <p>￥{{subitem.sellPrice}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { showLoading, hideLoading } from '../../utils/loading'
export default {
  onShow() {
    // this.openId = getStorageOpenid();
    console.log(this.openid)
    this.getlist();
  },
  created() {},
  mounted() {},
  data() {
    return {
      openid: "",
      collectlist: []
    };
  },
  components: {},
  methods: {
    // async getlist() {
    //   const data = await get('/collect/listAction', {
    //     openId: this.openId
    //   })
    //   this.collectlist = data.collectGoodsList;
    // },
    getlist() {
      showLoading('加载中...');
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          // console.log('云函数login调用成功')
          // console.log(res.result.openid)
          this.openid = res.result.openid
          wx.cloud.callFunction({
            name: 'insertcollect',
            data: {
                type: "getall",
                openid: this.openid
              },
            success: res => {
              wx.hideLoading()
              this.collectlist = res.result.data;
              console.log("1111111111111")
              console.log(this.collectlist)
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
    goodsDetail(id) {
      wx.navigateTo({
        url: "/pages/goodsdetails/main?id=" + id
      });
    },
  },
  computed: {}
};
</script>
<style lang='less' scoped>
@import './style.less';
</style>
